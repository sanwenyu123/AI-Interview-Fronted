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

const { Title, Text } = Typography;

const VoiceInterview = () => {
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
  const recognitionRef = useRef(null);

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

  useEffect(() => {
    if (!currentInterview) {
      message.warning('请先设置面试岗位信息');
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

  const initSpeechRecognition = () => {
    if (!currentInterview) {
      console.warn('面试配置未加载');
      return false;
    }

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      try {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false; // 改为false，避免持续监听
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = currentInterview.language || 'zh-CN';
        recognitionRef.current.maxAlternatives = 1;

        recognitionRef.current.onresult = (event) => {
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            }
          }
          if (finalTranscript) {
            console.log('识别到的文本:', finalTranscript);
            handleVoiceInput(finalTranscript);
          }
        };

        recognitionRef.current.onerror = (event) => {
          console.error('语音识别错误:', event.error);
          setIsListening(false);
          setIsRecording(false);
          
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
          console.log('语音识别结束');
          setIsListening(false);
          setIsRecording(false);
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

  const handlePermissionGranted = () => {
    setShowPermissionModal(false);
    
    // 初始化语音识别
    const initialized = initSpeechRecognition();
    if (!initialized) {
      message.error('语音识别初始化失败，请刷新页面重试');
      return;
    }
    
    const welcomeMessages = {
      'zh-CN': `您好！欢迎参加${currentInterview.position}的语音面试。我是您的AI面试官，接下来我会问您一些问题，请用语音回答。面试预计${currentInterview.duration}分钟，准备好了吗？`,
      'zh-TW': `您好！歡迎參加${currentInterview.position}的語音面試。我是您的AI面試官，接下來我會問您一些問題，請用語音回答。面試預計${currentInterview.duration}分鐘，準備好了嗎？`,
      'en-US': `Hello! Welcome to the voice interview for ${currentInterview.position}. I'm your AI interviewer, and I'll ask you some questions. Please answer with your voice. The interview is expected to last ${currentInterview.duration} minutes. Are you ready?`,
      'en-GB': `Hello! Welcome to the voice interview for ${currentInterview.position}. I'm your AI interviewer, and I'll ask you some questions. Please answer with your voice. The interview is expected to last ${currentInterview.duration} minutes. Are you ready?`,
      'ja-JP': `こんにちは！${currentInterview.position}の音声面接へようこそ。私はあなたのAI面接官です。いくつか質問をさせていただきますので、音声でお答えください。面接は${currentInterview.duration}分程度を予定しています。準備はよろしいですか？`,
      'ko-KR': `안녕하세요! ${currentInterview.position} 음성 면접에 오신 것을 환영합니다. 저는 당신의 AI 면접관입니다. 몇 가지 질문을 드릴 예정이니 음성으로 답변해 주세요. 면접은 ${currentInterview.duration}분 정도 예상됩니다. 준비되셨나요?`
    };
    
    const welcomeMessage = welcomeMessages[currentInterview.language || 'zh-CN'] || welcomeMessages['zh-CN'];
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
        if (interviewStarted && questionCount < getInterviewQuestions(currentInterview.language || 'zh-CN').length) {
          askNextQuestion();
        }
      };
      
      speechSynthesis.speak(utterance);
    }
  };

  const askNextQuestion = () => {
    const interviewQuestions = getInterviewQuestions(currentInterview.language || 'zh-CN');
    if (questionCount < interviewQuestions.length) {
      const question = interviewQuestions[questionCount];
      setCurrentQuestion(question);
      setQuestionCount(prev => prev + 1);
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
    
    // 跳转到结果页面
    setTimeout(() => {
      navigate('/interview-result', { state: { record: interviewRecord } });
    }, 3000);
  };

  const startRecording = () => {
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
        recognitionRef.current.stop();
      } catch (e) {
        // 忽略停止错误
      }

      // 延迟启动，确保之前的识别已完全停止
      setTimeout(() => {
        try {
          recognitionRef.current.start();
          setIsListening(true);
          setIsRecording(true);
          console.log('开始语音识别，语言:', currentInterview.language);
          message.success('开始录音，请说话...');
        } catch (error) {
          console.error('启动录音失败:', error);
          if (error.message.includes('already started')) {
            message.warning('语音识别已在运行中');
          } else {
            message.error('启动录音失败，请重试');
          }
          setIsListening(false);
          setIsRecording(false);
        }
      }, 100);
    } catch (error) {
      console.error('录音准备失败:', error);
      message.error('录音准备失败');
      setIsListening(false);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    try {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      setIsRecording(false);
      console.log('录音已停止');
      message.info('录音已停止');
    } catch (error) {
      console.error('停止录音失败:', error);
      setIsListening(false);
      setIsRecording(false);
    }
  };

  const handleVoiceInput = (transcript) => {
    console.log('识别到的语音:', transcript);
    // 这里可以处理识别到的语音文本
    // 模拟AI处理
    setTimeout(() => {
      askNextQuestion();
    }, 1000);
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
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
          {currentInterview.language === 'en-US' || currentInterview.language === 'en-GB' ? 'Voice Interview - ' :
           currentInterview.language === 'ja-JP' ? '音声面接 - ' :
           currentInterview.language === 'ko-KR' ? '음성 면접 - ' :
           '语音面试 - '}{currentInterview.position}
        </Title>
        <Text type="secondary">
          {currentInterview.language === 'en-US' || currentInterview.language === 'en-GB' ? 'Have a voice conversation with the AI interviewer to experience a real interview scenario' :
           currentInterview.language === 'ja-JP' ? 'AI面接官と音声で対話し、実際の面接シーンを体験してください' :
           currentInterview.language === 'ko-KR' ? 'AI 면접관과 음성으로 대화하여 실제 면접 상황을 경험하세요' :
           '与AI面试官进行语音对话，体验真实的面试场景'}
        </Text>
      </div>

      {/* 面试信息卡片 */}
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
              <Text>{questionCount} / {getInterviewQuestions(currentInterview.language || 'zh-CN').length}</Text>
            </Space>
          </Col>
          <Col flex="auto">
            <Progress 
              percent={Math.round((questionCount / getInterviewQuestions(currentInterview.language || 'zh-CN').length) * 100)} 
              size="small"
              status={interviewStarted ? 'active' : 'normal'}
            />
          </Col>
        </Row>
      </Card>

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
        <div style={{ marginBottom: '24px' }}>
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
