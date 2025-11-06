import React, { useState, useEffect, useRef } from 'react';
import { 
  Card, 
  Button, 
  Typography, 
  Space, 
  message, 
  Row, 
  Col,
  Progress,
  Avatar,
  Divider,
  Spin,
  Modal
} from 'antd';
import { 
  SoundOutlined, 
  RobotOutlined, 
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  StopOutlined,
  AudioOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import answerService from '../services/answerService';
import questionService from '../services/questionService';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../utils/i18n';
import SEOHead from '../components/SEOHead';
import evaluationService from '../services/evaluationService';
import { API_CONFIG } from '../config/api';
import request from '../utils/request';

const { Title, Text } = Typography;

const VoiceInterview = () => {
  const { language } = useLanguage();
  const DEFAULT_NUM_QUESTIONS = 5;
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  
  const navigate = useNavigate();
  const { currentInterview, addInterviewRecord } = useStore();
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const mediaMimeTypeRef = useRef(''); // 实际使用的音频容器类型
  const lastFinalAtRef = useRef(0); // 上次最终识别时间，用于断句
  const backendAsrDisabledRef = useRef(false); // 若发现后端不可用，则后续跳过调用
  const recognitionRef = useRef(null);
  const consoleScrollRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const recognitionStateRef = useRef('idle'); // idle | starting | running | stopping
  const [recognizedText, setRecognizedText] = useState('');
  const [asrAvailable, setAsrAvailable] = useState(true);
  const recognizedTextRef = useRef('');
  const [answers, setAnswers] = useState([]);
  const questionIndexRef = useRef(0);
  const questionsRef = useRef([]); // 后端题目缓存
  const currentQuestionIdRef = useRef(null);
  const currentQuestionRef = useRef(null);
  const [totalQuestions, setTotalQuestions] = useState(DEFAULT_NUM_QUESTIONS);
  const isGeneratingQuestionsRef = useRef(false);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const waitQuestionsSinceRef = useRef(0);

  // 根据语言设置面试问题
  const getInterviewQuestions = (language) => {
    const questions = {
      'zh-CN': [
        "请简单介绍一下您自己，包括您的技术背景和项目经验。",
        "您最熟悉的技术栈是什么？请详细说明您的技术优势。",
        "请描述一个您参与过的复杂项目，您在其中扮演什么角色？",
        "在团队协作中，您是如何处理技术分歧的？",
        "您如何保持技术学习的热情？最近在学习什么新技术？",
        "请描述一次您解决技术难题的经历。",
        "您对代码质量有什么要求？如何进行代码审查？",
        "在项目时间紧张的情况下，您如何平衡功能实现和代码质量？"
      ],
      'zh-TW': [
        "請簡單介紹一下您自己，包括您的技術背景和專案經驗。",
        "您最熟悉的技術棧是什麼？請詳細說明您的技術優勢。",
        "請描述一個您參與過的複雜專案，您在其中扮演什麼角色？",
        "在團隊協作中，您是如何處理技術分歧的？",
        "您如何保持技術學習的熱情？最近在學習什麼新技術？",
        "請描述一次您解決技術難題的經歷。",
        "您對程式碼品質有什麼要求？如何進行程式碼審查？",
        "在專案時間緊張的情況下，您如何平衡功能實現和程式碼品質？"
      ],
      'en-US': [
        "Please introduce yourself briefly, including your technical background and project experience.",
        "What is your most familiar tech stack? Please elaborate on your technical strengths.",
        "Describe a complex project you participated in and your role in it.",
        "How do you handle technical disagreements in team collaboration?",
        "How do you maintain enthusiasm for learning? What new technologies are you learning recently?",
        "Describe an experience where you solved a technical challenge.",
        "What are your requirements for code quality? How do you conduct code reviews?",
        "How do you balance feature implementation and code quality when project time is tight?"
      ],
      'en-GB': [
        "Please introduce yourself briefly, including your technical background and project experience.",
        "What is your most familiar tech stack? Please elaborate on your technical strengths.",
        "Describe a complex project you participated in and your role in it.",
        "How do you handle technical disagreements in team collaboration?",
        "How do you maintain enthusiasm for learning? What new technologies are you learning recently?",
        "Describe an experience where you solved a technical challenge.",
        "What are your requirements for code quality? How do you conduct code reviews?",
        "How do you balance feature implementation and code quality when project time is tight?"
      ],
      'ja-JP': [
        "簡単に自己紹介してください。技術的背景とプロジェクト経験を含めてください。",
        "最も得意な技術スタックは何ですか？技術的な強みを詳しく説明してください。",
        "参加した複雑なプロジェクトについて説明し、あなたの役割を教えてください。",
        "チーム協力において、技術的な意見の相違をどのように処理しますか？",
        "学習への情熱をどのように維持していますか？最近学んでいる新しい技術は何ですか？",
        "技術的な課題を解決した経験を説明してください。",
        "コード品質に対する要求は何ですか？コードレビューをどのように行いますか？",
        "プロジェクト時間が厳しい場合、機能実装とコード品質のバランスをどのように取りますか？"
      ],
      'ko-KR': [
        "간단히 자기소개해 주세요. 기술적 배경과 프로젝트 경험을 포함해서요.",
        "가장 익숙한 기술 스택은 무엇인가요? 기술적 강점을 자세히 설명해 주세요.",
        "참여한 복잡한 프로젝트를 설명하고, 그 안에서의 역할을 말씀해 주세요.",
        "팀 협업에서 기술적 의견 차이를 어떻게 처리하시나요?",
        "학습에 대한 열정을 어떻게 유지하시나요? 최근에 배우고 있는 새로운 기술은 무엇인가요?",
        "기술적 도전을 해결한 경험을 설명해 주세요.",
        "코드 품질에 대한 요구사항은 무엇인가요? 코드 리뷰를 어떻게 진행하시나요?",
        "프로젝트 시간이 촉박할 때 기능 구현과 코드 품질의 균형을 어떻게 맞추시나요?"
      ]
    };
    return questions[language] || questions['zh-CN'];
  };

  // 从题目里抽取关键词，提升识别稳定性
  function extractKeywords(text) {
    if (!text) return [];
    const cleaned = text
      .replace(/[，。！？、,!.?\-\(\)\[\]{}:;"'`]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    const words = cleaned.split(' ');
    // 过滤过短词与常见虚词
    const stop = new Set(['的','了','和','是','在','我','你','他','她','它','我们','你们','他们','请','如何','什么','以及','并且','或者']);
    const result = [];
    for (const w of words) {
      if (!w) continue;
      if (w.length <= 1) continue;
      if (stop.has(w)) continue;
      result.push(w);
    }
    return result;
  }

  // 标点与断句增强（启发式）
  function refineTranscript(existing, added, lang, gapMs) {
    let text = (existing || '');
    let fragment = (added || '').trim();
    if (!fragment) return text;

    // 英文首字母大小写 & 句首大写
    if (lang.startsWith('en')) {
      fragment = fragment.replace(/\s+/g, ' ');
      if (!text || /[\.\?!]$/.test(text.trim())) {
        fragment = fragment.charAt(0).toUpperCase() + fragment.slice(1);
      }
      // 根据末尾停顿补标点
      if (/[\.!?]$/.test(fragment) === false) {
        if (gapMs >= 1200) fragment += '.';
      }
      return (text + (text ? ' ' : '') + fragment).replace(/\s+([\.!?])/g, '$1');
    }

    // 中文：合并空格、替换半角标点
    fragment = fragment
      .replace(/[\s]+/g, '')
      .replace(/,/g, '，')
      .replace(/\./g, '。');

    // 句末标点推断：长停顿或结束词
    const enders = ['吗','呢','吧','啊','对吧','是不是','好吧'];
    const endsWithEnder = enders.some(e => fragment.endsWith(e));
    if (!/[。！？]$/.test(fragment)) {
      if (gapMs >= 1200 || endsWithEnder) {
        fragment += endsWithEnder ? '？' : '。';
      }
    }
    return text + fragment;
  }

  useEffect(() => {
    if (!currentInterview) {
      if (!sessionStorage.getItem('setup_tip_shown')) {
        message.warning('请先设置面试岗位信息');
        sessionStorage.setItem('setup_tip_shown', '1');
      }
      navigate('/job-setup');
      return;
    }
  }, [currentInterview, navigate]);

  useEffect(() => {
    let interval;
    if (interviewStarted) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [interviewStarted]);

  // 自动滚动到最新状态/问题
  useEffect(() => {
    const el = consoleScrollRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }
  }, [questionCount, currentQuestion, isPlaying, isListening, interviewStarted]);

  const initSpeechRecognition = () => {
    if (!currentInterview) {
      console.warn('面试配置未加载');
      return false;
    }

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      try {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true; // 持续监听，由我们控制停止时机
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = currentInterview.language || 'zh-CN';
        recognitionRef.current.maxAlternatives = 8; // 提高备选结果数量，选置信度最高的文本

        // 可用时添加简单语法，强化与当前题目相关词汇
        try {
          const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
          if (SpeechGrammarList && currentQuestionRef.current) {
            const grams = extractKeywords(currentQuestionRef.current).slice(0, 30).join(' ');
            const grammar = `#JSGF V1.0; grammar kws; public <kws> = ${grams};`;
            const list = new SpeechGrammarList();
            list.addFromString(grammar, 1);
            recognitionRef.current.grammars = list;
          }
        } catch (e) {
          // 某些浏览器不支持 Grammar，忽略即可
        }

        recognitionRef.current.onstart = () => {
          recognitionStateRef.current = 'running';
          recognizedTextRef.current = '';
          setRecognizedText('');
        };

        recognitionRef.current.onresult = (event) => {
          let finalText = '';
          let interimText = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const res = event.results[i];
            if (res.isFinal) {
              const alts = Array.from(res);
              const best = alts.sort((a, b) => (b.confidence || 0) - (a.confidence || 0))[0];
              finalText += best?.transcript || res[0]?.transcript || '';
            } else {
              interimText += res[0]?.transcript || '';
            }
          }

          // 断句与标点增强
          if (finalText) {
            const now = Date.now();
            const gap = lastFinalAtRef.current ? now - lastFinalAtRef.current : 0;
            lastFinalAtRef.current = now;
            const refined = refineTranscript(
              (recognizedTextRef.current || ''),
              finalText,
              currentInterview.language || 'zh-CN',
              gap
            );
            recognizedTextRef.current = refined;
            setRecognizedText(refined);
          } else if (interimText) {
            const preview = `${recognizedTextRef.current || ''}${interimText}`;
            setRecognizedText(preview);
          }
        };

        recognitionRef.current.onerror = (event) => {
          console.error('语音识别错误:', event.error);
          setIsListening(false);
          setIsRecording(false);
          recognitionStateRef.current = 'idle';
          
          const errorMessages = {
            'no-speech': '未检测到语音，请重试',
            'audio-capture': '无法访问麦克风，请检查权限',
            'not-allowed': '麦克风权限被拒绝，请在浏览器设置中允许',
            'network': '网络错误，请检查网络连接',
            'aborted': '语音识别被中断',
            'service-not-allowed': '语音识别服务不可用'
          };
          
          const errorMsg = errorMessages[event.error] || `语音识别失败: ${event.error}`;
          message.error(errorMsg);
        };

        recognitionRef.current.onend = () => {
          console.log('[VOICE-DEBUG] 浏览器语音识别结束，文本=', recognizedTextRef.current);
          recognitionStateRef.current = 'idle';
          if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
          // 注意：现在主要依赖 MediaRecorder.onstop 处理音频和识别
          // 这里只是记录浏览器识别结果，实际提交在 MediaRecorder.onstop 中进行
        };

        return true;
      } catch (error) {
        console.error('初始化语音识别失败:', error);
        message.error('初始化语音识别失败');
        return false;
      }
    } else {
      message.warning('您的浏览器不支持语音识别功能');
      return false;
    }
  };

  const startInterview = () => {
    setShowPermissionModal(true);
  };

  const handlePermissionGranted = async () => {
    setShowPermissionModal(false);
    
    // 初始化语音识别
    const initialized = initSpeechRecognition();
    if (!initialized) {
      message.error('语音识别初始化失败，请刷新页面重试');
      return;
    }
    
    // 重置进度与答案
    questionIndexRef.current = 0;
    setQuestionCount(0);
    setCurrentQuestion(null);
    setAnswers([]);
    questionsRef.current = [];
    currentQuestionIdRef.current = null;

    // 异步生成面试题并缓存（不阻塞欢迎语播报）
    isGeneratingQuestionsRef.current = true;
    setIsGeneratingQuestions(true);
    (async () => {
      try {
        if (currentInterview?.id) {
          const payload = { interview_id: currentInterview.id, num_questions: DEFAULT_NUM_QUESTIONS };
          await questionService.generateQuestions(payload);
          const list = await questionService.getQuestionsByInterview(currentInterview.id);
          if (Array.isArray(list) && list.length) {
            questionsRef.current = list; // [{id, question_text, question_order, ...}]
            setTotalQuestions(Math.min(list.length, DEFAULT_NUM_QUESTIONS));
          }
        }
      } catch (e) {
        console.warn('生成/获取题目失败，将使用本地题库', e);
      } finally {
        isGeneratingQuestionsRef.current = false;
        setIsGeneratingQuestions(false);
      }
    })();

    const welcomeMessages = {
      'zh-CN': `您好！欢迎参加${currentInterview.position}的语音面试。我是您的AI面试官，接下来我会问您一些问题，请用语音回答。面试预计${currentInterview.duration}分钟，准备好了吗？`,
      'zh-TW': `您好！歡迎參加${currentInterview.position}的語音面試。我是您的AI面試官，接下來我會問您一些問題，請用語音回答。面試預計${currentInterview.duration}分鐘，準備好了嗎？`,
      'en-US': `Hello! Welcome to the voice interview for ${currentInterview.position}. I'm your AI interviewer, and I'll ask you some questions. Please answer with your voice. The interview is expected to last ${currentInterview.duration} minutes. Are you ready?`,
      'en-GB': `Hello! Welcome to the voice interview for ${currentInterview.position}. I'm your AI interviewer, and I'll ask you some questions. Please answer with your voice. The interview is expected to last ${currentInterview.duration} minutes. Are you ready?`,
      'ja-JP': `こんにちは！${currentInterview.position}の音声面接へようこそ。私はあなたのAI面接官です。いくつか質問をさせていただきますので、音声でお答えください。面接は${currentInterview.duration}分程度を予定しています。準備はよろしいですか？`,
      'ko-KR': `안녕하세요! ${currentInterview.position} 음성 면접에 오신 것을 환영합니다. 저는 당신의 AI 면접관입니다. 몇 가지 질문을 드릴 예정이니 음성으로 답변해 주세요. 면접은 ${currentInterview.duration}분 정도 예상됩니다. 준비되셨나요?`
    };
    
    const welcomeMessage = welcomeMessages[currentInterview.language || 'zh-CN'] || welcomeMessages['zh-CN'];
    // 立即播报欢迎语
    speakText(welcomeMessage);
    setInterviewStarted(true);
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = currentInterview?.language || 'zh-CN';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => {
        setIsPlaying(false);
        // 仅当播放欢迎语（此时还没有 currentQuestion）时进入第一题
        if (!currentQuestionRef.current) {
          askNextQuestion();
        }
      };
      
      speechSynthesis.speak(utterance);
    }
  };

  const askNextQuestion = () => {
    const index = questionIndexRef.current;
    
    // 若题目还在后台生成，等待最多 8 秒再回退到本地题库
    if (questionsRef.current.length === 0 && isGeneratingQuestionsRef.current) {
      if (!waitQuestionsSinceRef.current) waitQuestionsSinceRef.current = Date.now();
      if (Date.now() - waitQuestionsSinceRef.current < 8000) {
        setTimeout(() => askNextQuestion(), 300);
        return;
      }
      // 超时后清零，允许回退
      waitQuestionsSinceRef.current = 0;
    }

    // 优先使用后端问题，如果没有则使用 mock 数据
    let question = null;
    let localTotal = 0;
    
    if (questionsRef.current.length > 0) {
      // 使用后端问题
      const cappedLen = Math.min(questionsRef.current.length, DEFAULT_NUM_QUESTIONS);
      setTotalQuestions(cappedLen);
      const backendQuestion = questionsRef.current.find(q => q.question_order === index + 1) || questionsRef.current[index];
      if (backendQuestion) {
        question = backendQuestion.question_text;
        currentQuestionIdRef.current = backendQuestion.id;
        localTotal = cappedLen;
        console.log('[VOICE-DEBUG] 使用后端问题: order=', index + 1, ' id=', backendQuestion.id, ' text=', question.substring(0, 50) + '...');
      }
    }
    
    if (!question) {
      // 回退到 mock 数据
      const interviewQuestions = getInterviewQuestions(currentInterview.language || 'zh-CN');
      const cappedLen = Math.min(interviewQuestions.length, DEFAULT_NUM_QUESTIONS);
      setTotalQuestions(cappedLen);
      if (index < cappedLen) {
        question = interviewQuestions[index];
        currentQuestionIdRef.current = null;
        localTotal = cappedLen;
        console.log('[VOICE-DEBUG] 使用 mock 问题: index=', index, ' text=', question.substring(0, 50) + '...');
      }
    }
    
    if (question && index < localTotal) {
      questionIndexRef.current = index + 1;
      setCurrentQuestion(question);
      currentQuestionRef.current = question;
      setQuestionCount(questionIndexRef.current);
      speakText(question);
    } else {
      endInterview();
    }
  };

  const endInterview = () => {
    const endMessages = {
      'zh-CN': '感谢您参加本次面试！面试已结束，我们会对您的表现进行评估。',
      'zh-TW': '感謝您參加本次面試！面試已結束，我們會對您的表現進行評估。',
      'en-US': 'Thank you for participating in this interview! The interview has ended, and we will evaluate your performance.',
      'en-GB': 'Thank you for participating in this interview! The interview has ended, and we will evaluate your performance.',
      'ja-JP': '今回の面接にご参加いただき、ありがとうございました！面接は終了いたしました。あなたのパフォーマンスを評価いたします。',
      'ko-KR': '이번 면접에 참여해 주셔서 감사합니다! 면접이 종료되었습니다. 귀하의 성과를 평가하겠습니다.'
    };
    
    const endMessage = endMessages[currentInterview.language || 'zh-CN'] || endMessages['zh-CN'];
    speakText(endMessage);
    setInterviewStarted(false);
    
    // 保存面试记录
    const interviewRecord = {
      id: Date.now(),
      position: currentInterview.position,
      type: 'voice',
      duration: timeElapsed,
      questions: questionCount,
      score: Math.floor(Math.random() * 30) + 70, // 模拟评分
      date: new Date().toISOString(),
      status: 'completed',
      language: currentInterview.language || 'zh-CN'
    };
    
    addInterviewRecord(interviewRecord);
    
    // 最后一题后生成 AI 评价
    (async () => {
      try {
        if (currentInterview?.id) {
          await evaluationService.generateEvaluationByInterview(currentInterview.id);
        }
      } catch (e) {
        console.error('生成评价失败:', e);
      }
    })();

    // 跳转到结果页面
    setTimeout(() => {
      navigate('/interview-result', { state: { record: interviewRecord } });
    }, 3000);
  };

  const startRecording = async () => {
    // 播报过程中禁止点击开始录音
    if (isPlaying) {
      message.info('请先听完题目播报');
      return;
    }
    if (recognitionStateRef.current === 'starting' || recognitionStateRef.current === 'running') {
      message.warning('语音识别已在运行中');
      return;
    }
    if (recognitionStateRef.current === 'stopping') {
      setTimeout(startRecording, 200);
      return;
    }
    if (!recognitionRef.current) {
      message.error('语音识别不可用，请重新开始面试');
      // 尝试重新初始化
      const initialized = initSpeechRecognition();
      if (!initialized) {
        return;
      }
    }

    try {
      // 确保之前的识别已停止
      try {
        recognitionStateRef.current = 'stopping';
        recognitionRef.current.stop();
      } catch (e) {
        // 忽略停止错误
      }

      // 获取麦克风权限并开始录制音频
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        } 
      });
      
      // 初始化 MediaRecorder 用于录制音频
      audioChunksRef.current = [];
      // 选择浏览器支持的最佳容器类型（优先 webm;codecs=opus，其次 ogg;codecs=opus）
      const candidates = [
        'audio/webm;codecs=opus',
        'audio/ogg;codecs=opus',
        'audio/webm'
      ];
      let selectedType = '';
      if (window.MediaRecorder && typeof MediaRecorder.isTypeSupported === 'function') {
        selectedType = candidates.find(t => MediaRecorder.isTypeSupported(t)) || '';
      }
      mediaMimeTypeRef.current = selectedType;
      mediaRecorderRef.current = selectedType
        ? new MediaRecorder(stream, { mimeType: selectedType })
        : new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = async () => {
        console.log('[VOICE-DEBUG] MediaRecorder 停止，开始处理音频');
        if (audioChunksRef.current.length > 0) {
          // 创建音频 Blob
          const blobType = mediaMimeTypeRef.current || 'audio/webm;codecs=opus';
          const audioBlob = new Blob(audioChunksRef.current, { type: blobType });
          console.log('[VOICE-DEBUG] 音频 Blob 大小:', audioBlob.size, 'bytes');
          
          // 发送到后端进行 ASR 识别
          try {
            await processAudioWithBackend(audioBlob);
          } catch (error) {
            console.error('[VOICE-DEBUG] 后端 ASR 失败，使用浏览器识别结果:', error);
            // 如果后端识别失败，使用浏览器的识别结果
            const browserResult = recognizedTextRef.current?.trim();
            if (browserResult) {
              handleVoiceInput(browserResult);
            } else {
              message.warning('语音识别失败，请重新录音');
            }
          }
        }
      };

      // 延迟启动，确保之前的识别已完全停止
      setTimeout(() => {
        try {
          recognitionStateRef.current = 'starting';
          // 同时启动音频录制和语音识别
          mediaRecorderRef.current.start();
          recognitionRef.current.start();
          setIsListening(true);
          setIsRecording(true);
          console.log('[VOICE-DEBUG] 开始音频录制和语音识别，语言:', currentInterview.language);
          message.success('开始录音，请说话...');
        } catch (error) {
          console.error('启动录音失败:', error);
          if (error.message && error.message.includes('already started')) {
            message.warning('语音识别已在运行中');
          } else {
            message.error('启动录音失败，请重试');
          }
          setIsListening(false);
          setIsRecording(false);
          recognitionStateRef.current = 'idle';
        }
      }, 200);
    } catch (error) {
      console.error('录音准备失败:', error);
      message.error('录音准备失败，请检查麦克风权限');
      setIsListening(false);
      setIsRecording(false);
      recognitionStateRef.current = 'idle';
    }
  };

  const stopRecording = () => {
    try {
      if (recognitionRef.current) {
        recognitionStateRef.current = 'stopping';
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        console.log('[VOICE-DEBUG] stopRecording -> 调用 recognition.stop()');
        recognitionRef.current.stop();
      }
      
      // 停止音频录制
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        console.log('[VOICE-DEBUG] stopRecording -> 停止音频录制');
        mediaRecorderRef.current.stop();
      }
      
      setIsListening(false);
      setIsRecording(false);
      console.log('[VOICE-DEBUG] 录音已停止, 等待处理音频和识别结果');
      message.info('录音已停止，正在识别语音...');
    } catch (error) {
      console.error('停止录音失败:', error);
      setIsListening(false);
      setIsRecording(false);
      recognitionStateRef.current = 'idle';
    }
  };

  // 仅通过后端代上传识别：将音频发给 /voice/asr/submit，由后端上传到 TOS 并调用 AUC
  const processAudioWithBackend = async (audioBlob) => {
    console.log('[VOICE-DEBUG] 开始后端代上传识别');
    const formData = new FormData();
    const mime = mediaMimeTypeRef.current || audioBlob.type || '';
    const fmt = mime.includes('ogg') || mime.includes('opus') ? 'opus' : (mime.includes('webm') ? 'webm' : 'opus');
    formData.append('audio', audioBlob, `recording.${fmt}`);
    formData.append('language', currentInterview.language || 'zh-CN');
    formData.append('fmt', fmt);
    const resp = await request.post(`/voice/asr/submit`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      transformRequest: v => v,
    });
    const result = resp.data || resp;
    console.log('[VOICE-DEBUG] 后端代上传识别结果:', result);
    const recognizedText = result.text?.trim();
    if (recognizedText) {
      message.success('语音识别完成');
      handleVoiceInput(recognizedText);
      return;
    }
    throw new Error('后端代上传返回空结果');
  };

  const handleVoiceInput = async (transcript) => {
    console.log('[VOICE-DEBUG] handleVoiceInput 被调用, transcript=', transcript);
    // 保存本题答案（基于当前题目ID）
    if (currentInterview?.id) {
      setAnswers(prev => ([...prev, { question: currentQuestionRef.current, answer: transcript }]));
      // 异步提交到后端
      try {
        // 优先使用缓存的当前题ID
        let questionId = currentQuestionIdRef.current;
        console.log('[VOICE-DEBUG] 提交前 questionId=', questionId, ' questionIndex=', questionIndexRef.current);
        if (!questionId) {
          const list = await questionService.getQuestionsByInterview(currentInterview.id);
          if (Array.isArray(list)) {
            questionsRef.current = list;
            const idx = questionIndexRef.current - 1; // 当前题序从1开始
            if (list[idx]) questionId = list[idx].id;
          }
        }

        if (questionId) {
          console.log('[VOICE-DEBUG] 发起 POST /answers, question_id=', questionId);
          // 防止重复提交：发起前再次确认识别状态不在 running
          if (recognitionStateRef.current === 'running' || recognitionStateRef.current === 'starting') {
            try { recognitionRef.current && recognitionRef.current.stop(); } catch(_) {}
          }
          await answerService.createAnswer({
            question_id: questionId,
            answer_text: transcript,
            answer_type: 'voice',
            audio_url: null,
            duration: null,
          });
          console.log('[VOICE-DEBUG] 提交答案成功');
        } else {
          console.warn('[VOICE-DEBUG] 未找到对应的 question_id，答案未提交');
        }
      } catch (e) {
        console.error('[VOICE-DEBUG] 提交答案失败:', e);
        message.error('提交答案失败，但不影响继续下一题');
      }
    }
    // 清空显示中的临时文本
    recognizedTextRef.current = '';
    setRecognizedText('');
    // 清空当前题，避免 TTS 结束时的自动推进误触发
    setCurrentQuestion(null);
    currentQuestionRef.current = null;
    // 进入下一题
    setTimeout(() => {
      askNextQuestion();
    }, 600);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentInterview) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>
          <Text>正在加载面试信息...</Text>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SEOHead 
        title={`${t('voiceInterview.title', language)} - ${currentInterview.position}`}
        description={language === 'en-US' || language === 'en-GB' ? 'Have a voice conversation with the AI interviewer to experience a real interview scenario' :
                     language === 'ja-JP' ? 'AI面接官と音声で対話し、実際の面接シーンを体験してください' :
                     language === 'ko-KR' ? 'AI 면접관과 음성으로 대화하여 실제 면접 상황을 경험하세요' :
                     '与AI面试官进行语音对话，体验真实的面试场景'}
      />
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
          {t('voiceInterview.title', language)} - {currentInterview.position}
        </Title>
        <Text type="secondary">
          {language === 'en-US' || language === 'en-GB' ? 'Have a voice conversation with the AI interviewer to experience a real interview scenario' :
           language === 'ja-JP' ? 'AI面接官と音声で対話し、実際の面接シーンを体験してください' :
           language === 'ko-KR' ? 'AI 면접관과 음성으로 대화하여 실제 면접 상황을 경험하세요' :
           '与AI面试官进行语音对话，体验真实的面试场景'}
        </Text>
      </div>

      {/* 面试信息卡片（仅在开始后显示） */}
      {interviewStarted && (
      <Card style={{ marginBottom: '16px', borderRadius: '12px' }}>
        <Row gutter={16} align="middle">
          <Col>
            <Space>
              <ClockCircleOutlined style={{ color: '#1890ff' }} />
              <Text strong>
                {currentInterview.language === 'en-US' || currentInterview.language === 'en-GB' ? 'Interview Duration:' :
                 currentInterview.language === 'ja-JP' ? '面接時間:' :
                 currentInterview.language === 'ko-KR' ? '면접 시간:' :
                 '面试时长：'}
              </Text>
              <Text>{formatTime(timeElapsed)} / {currentInterview.duration}
                {currentInterview.language === 'en-US' || currentInterview.language === 'en-GB' ? ' min' :
                 currentInterview.language === 'ja-JP' ? '分' :
                 currentInterview.language === 'ko-KR' ? '분' :
                 '分钟'}
              </Text>
            </Space>
          </Col>
          <Col>
            <Space>
              <CheckCircleOutlined style={{ color: '#52c41a' }} />
              <Text strong>
                {currentInterview.language === 'en-US' || currentInterview.language === 'en-GB' ? 'Questions Answered:' :
                 currentInterview.language === 'ja-JP' ? '回答済み質問:' :
                 currentInterview.language === 'ko-KR' ? '답변한 질문:' :
                 '已回答问题：'}
              </Text>
              <Text>{questionCount} / {totalQuestions}</Text>
            </Space>
          </Col>
          <Col flex="auto">
            <Progress 
              percent={Math.round((questionCount / (totalQuestions || DEFAULT_NUM_QUESTIONS)) * 100)} 
              size="small"
              status={interviewStarted ? 'active' : 'normal'}
            />
          </Col>
        </Row>
      </Card>
      )}

      {/* 语音控制区域 */}
      <Card 
        title={currentInterview.language === 'en-US' || currentInterview.language === 'en-GB' ? 'Voice Interview Console' :
               currentInterview.language === 'ja-JP' ? '音声面接コンソール' :
               currentInterview.language === 'ko-KR' ? '음성 면접 콘솔' :
               '语音面试控制台'}
        style={{ 
          marginBottom: '16px', 
          borderRadius: '12px',
          textAlign: 'center'
        }}
      >
        <div ref={consoleScrollRef} style={{ marginBottom: '24px', maxHeight: '420px', overflowY: 'auto', padding: '8px' }}>
          <Avatar 
            size={120}
            icon={<RobotOutlined />} 
            style={{ 
              backgroundColor: isPlaying ? '#52c41a' : '#1890ff',
              marginBottom: '16px',
              animation: isPlaying ? 'pulse 1s infinite' : 'none'
            }} 
          />
          <div style={{ marginBottom: '16px' }}>
            <Title level={4} style={{ margin: 0 }}>
              {isPlaying ? 
                (currentInterview.language === 'en-US' || currentInterview.language === 'en-GB' ? 'AI is speaking...' :
                 currentInterview.language === 'ja-JP' ? 'AIが話しています...' :
                 currentInterview.language === 'ko-KR' ? 'AI가 말하고 있습니다...' :
                 'AI正在说话...') :
               isListening ? 
                (currentInterview.language === 'en-US' || currentInterview.language === 'en-GB' ? 'Listening to your answer...' :
                 currentInterview.language === 'ja-JP' ? 'あなたの回答を聞いています...' :
                 currentInterview.language === 'ko-KR' ? '답변을 듣고 있습니다...' :
                 '正在听取您的回答...') :
                (currentInterview.language === 'en-US' || currentInterview.language === 'en-GB' ? 'Waiting to start' :
                 currentInterview.language === 'ja-JP' ? '開始待ち' :
                 currentInterview.language === 'ko-KR' ? '시작 대기' :
                 '等待开始')
              }
            </Title>
            {currentQuestion && (
              <Text type="secondary" style={{ display: 'block', marginTop: '8px' }}>
                {currentInterview.language === 'en-US' || currentInterview.language === 'en-GB' ? 'Current Question: ' :
                 currentInterview.language === 'ja-JP' ? '現在の質問: ' :
                 currentInterview.language === 'ko-KR' ? '현재 질문: ' :
                 '当前问题：'}{currentQuestion}
              </Text>
            )}
          </div>
        </div>

        <Space size="large">
          {!interviewStarted ? (
            <Button
              type="primary"
              size="large"
              icon={<PlayCircleOutlined />}
              onClick={startInterview}
              style={{ borderRadius: '8px' }}
            >
              {currentInterview.language === 'en-US' || currentInterview.language === 'en-GB' ? 'Start Interview' :
               currentInterview.language === 'ja-JP' ? '面接開始' :
               currentInterview.language === 'ko-KR' ? '면접 시작' :
               '开始面试'}
            </Button>
          ) : (
            <>
              {!isRecording ? (
                <Button
                  type="primary"
                  size="large"
                  icon={<AudioOutlined />}
                  onClick={startRecording}
                  disabled={isPlaying}
                  style={{ borderRadius: '8px' }}
                >
                  {currentInterview.language === 'en-US' || currentInterview.language === 'en-GB' ? 'Start Answering' :
                   currentInterview.language === 'ja-JP' ? '回答開始' :
                   currentInterview.language === 'ko-KR' ? '답변 시작' :
                   '开始回答'}
                </Button>
              ) : (
                <Button
                  type="default"
                  size="large"
                  icon={<StopOutlined />}
                  onClick={stopRecording}
                  style={{ borderRadius: '8px' }}
                >
                  {currentInterview.language === 'en-US' || currentInterview.language === 'en-GB' ? 'Stop Recording' :
                   currentInterview.language === 'ja-JP' ? '録音停止' :
                   currentInterview.language === 'ko-KR' ? '녹음 중지' :
                   '停止录音'}
                </Button>
              )}
            </>
          )}
        </Space>

        <Divider />

        <div style={{ textAlign: 'left' }}>
          <Title level={5}>
            {currentInterview.language === 'en-US' || currentInterview.language === 'en-GB' ? 'Instructions:' :
             currentInterview.language === 'ja-JP' ? '使用説明:' :
             currentInterview.language === 'ko-KR' ? '사용 설명:' :
             '使用说明：'}
          </Title>
          <ul style={{ paddingLeft: '20px' }}>
            <li>
              {currentInterview.language === 'en-US' || currentInterview.language === 'en-GB' ? 'Click "Start Interview" to begin the voice interview' :
               currentInterview.language === 'ja-JP' ? '「面接開始」をクリックして音声面接を開始' :
               currentInterview.language === 'ko-KR' ? '"면접 시작"을 클릭하여 음성 면접 시작' :
               '点击"开始面试"开始语音面试'}
            </li>
            <li>
              {currentInterview.language === 'en-US' || currentInterview.language === 'en-GB' ? 'AI will speak first, please listen carefully to the questions' :
               currentInterview.language === 'ja-JP' ? 'AIが最初に話します。質問をよく聞いてください' :
               currentInterview.language === 'ko-KR' ? 'AI가 먼저 말합니다. 질문을 주의 깊게 들어주세요' :
               'AI会先说话，请仔细听问题'}
            </li>
            <li>
              {currentInterview.language === 'en-US' || currentInterview.language === 'en-GB' ? 'After AI finishes, click "Start Answering" to record' :
               currentInterview.language === 'ja-JP' ? 'AIが終わったら「回答開始」をクリックして録音' :
               currentInterview.language === 'ko-KR' ? 'AI가 끝나면 "답변 시작"을 클릭하여 녹음' :
               'AI说完后，点击"开始回答"进行录音'}
            </li>
            <li>
              {currentInterview.language === 'en-US' || currentInterview.language === 'en-GB' ? 'Click "Stop Recording" after finishing your answer' :
               currentInterview.language === 'ja-JP' ? '回答が終わったら「録音停止」をクリック' :
               currentInterview.language === 'ko-KR' ? '답변을 마친 후 "녹음 중지"를 클릭' :
               '回答完毕后点击"停止录音"'}
            </li>
            <li>
              {currentInterview.language === 'en-US' || currentInterview.language === 'en-GB' ? 'The system will automatically recognize your voice and continue to the next question' :
               currentInterview.language === 'ja-JP' ? 'システムが自動的に音声を認識し、次の質問に進みます' :
               currentInterview.language === 'ko-KR' ? '시스템이 자동으로 음성을 인식하고 다음 질문으로 진행합니다' :
               '系统会自动识别您的语音并继续下一题'}
            </li>
          </ul>
        </div>
      </Card>

      {/* 权限请求模态框 */}
      <Modal
        title={currentInterview.language === 'en-US' || currentInterview.language === 'en-GB' ? 'Voice Permission Request' :
               currentInterview.language === 'ja-JP' ? '音声権限リクエスト' :
               currentInterview.language === 'ko-KR' ? '음성 권한 요청' :
               '语音权限请求'}
        open={showPermissionModal}
        onOk={handlePermissionGranted}
        onCancel={() => setShowPermissionModal(false)}
        okText={currentInterview.language === 'en-US' || currentInterview.language === 'en-GB' ? 'Allow' :
                currentInterview.language === 'ja-JP' ? '許可' :
                currentInterview.language === 'ko-KR' ? '허용' :
                '允许'}
        cancelText={currentInterview.language === 'en-US' || currentInterview.language === 'en-GB' ? 'Cancel' :
                   currentInterview.language === 'ja-JP' ? 'キャンセル' :
                   currentInterview.language === 'ko-KR' ? '취소' :
                   '取消'}
      >
        <p>
          {currentInterview.language === 'en-US' || currentInterview.language === 'en-GB' ? 'To conduct a voice interview, we need access to your microphone.' :
           currentInterview.language === 'ja-JP' ? '音声面接を行うために、マイクへのアクセスが必要です。' :
           currentInterview.language === 'ko-KR' ? '음성 면접을 진행하기 위해 마이크 접근 권한이 필요합니다.' :
           '为了进行语音面试，需要访问您的麦克风权限。'}
        </p>
        <p>
          {currentInterview.language === 'en-US' || currentInterview.language === 'en-GB' ? 'Please click "Allow" to continue the interview.' :
           currentInterview.language === 'ja-JP' ? '面接を続行するには「許可」をクリックしてください。' :
           currentInterview.language === 'ko-KR' ? '면접을 계속하려면 "허용"을 클릭하세요.' :
           '请点击"允许"以继续面试。'}
        </p>
      </Modal>

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default VoiceInterview;

