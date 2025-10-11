import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Input, 
  Button, 
  Typography, 
  Space, 
  message, 
  Row, 
  Col,
  Progress,
  Avatar,
  Divider,
  Spin
} from 'antd';
import { 
  SendOutlined, 
  RobotOutlined, 
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';

const { Title, Text } = Typography;
const { TextArea } = Input;

const TextInterview = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  
  const navigate = useNavigate();
  const { currentInterview, addInterviewRecord } = useStore();

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

    // 开始面试
    startInterview();
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

  const startInterview = () => {
    const interviewQuestions = getInterviewQuestions(currentInterview.language || 'zh-CN');
    const welcomeMessages = {
      'zh-CN': `您好！欢迎参加${currentInterview.position}的面试。我是您的AI面试官，接下来我会问您一些问题，请认真回答。面试预计${currentInterview.duration}分钟，准备好了吗？`,
      'zh-TW': `您好！歡迎參加${currentInterview.position}的面試。我是您的AI面試官，接下來我會問您一些問題，請認真回答。面試預計${currentInterview.duration}分鐘，準備好了嗎？`,
      'en-US': `Hello! Welcome to the interview for ${currentInterview.position}. I'm your AI interviewer, and I'll ask you some questions. Please answer carefully. The interview is expected to last ${currentInterview.duration} minutes. Are you ready?`,
      'en-GB': `Hello! Welcome to the interview for ${currentInterview.position}. I'm your AI interviewer, and I'll ask you some questions. Please answer carefully. The interview is expected to last ${currentInterview.duration} minutes. Are you ready?`,
      'ja-JP': `こんにちは！${currentInterview.position}の面接へようこそ。私はあなたのAI面接官です。いくつか質問をさせていただきますので、真剣にお答えください。面接は${currentInterview.duration}分程度を予定しています。準備はよろしいですか？`,
      'ko-KR': `안녕하세요! ${currentInterview.position} 면접에 오신 것을 환영합니다. 저는 당신의 AI 면접관입니다. 몇 가지 질문을 드릴 예정이니 진지하게 답변해 주세요. 면접은 ${currentInterview.duration}분 정도 예상됩니다. 준비되셨나요?`
    };
    
    const welcomeMessage = {
      id: Date.now(),
      type: 'ai',
      content: welcomeMessages[currentInterview.language || 'zh-CN'] || welcomeMessages['zh-CN'],
      timestamp: new Date().toISOString()
    };
    
    setMessages([welcomeMessage]);
    setInterviewStarted(true);
  };

  const askNextQuestion = () => {
    const interviewQuestions = getInterviewQuestions(currentInterview.language || 'zh-CN');
    if (questionCount < interviewQuestions.length) {
      const question = interviewQuestions[questionCount];
      const questionMessage = {
        id: Date.now(),
        type: 'ai',
        content: question,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, questionMessage]);
      setCurrentQuestion(question);
      setQuestionCount(prev => prev + 1);
    } else {
      // 面试结束
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
    
    const endMessage = {
      id: Date.now(),
      type: 'ai',
      content: endMessages[currentInterview.language || 'zh-CN'] || endMessages['zh-CN'],
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, endMessage]);
    setInterviewStarted(false);
    
    // 保存面试记录
    const interviewRecord = {
      id: Date.now(),
      position: currentInterview.position,
      type: 'text',
      duration: timeElapsed,
      questions: questionCount,
      messages: messages,
      score: Math.floor(Math.random() * 30) + 70, // 模拟评分
      date: new Date().toISOString(),
      status: 'completed',
      language: currentInterview.language || 'zh-CN'
    };
    
    addInterviewRecord(interviewRecord);
    
    // 跳转到结果页面
    setTimeout(() => {
      navigate('/interview-result', { state: { record: interviewRecord } });
    }, 2000);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);
    
    // 模拟AI处理时间
    setTimeout(() => {
      setLoading(false);
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
          {currentInterview.language === 'en-US' || currentInterview.language === 'en-GB' ? 'Text Interview - ' :
           currentInterview.language === 'ja-JP' ? 'テキスト面接 - ' :
           currentInterview.language === 'ko-KR' ? '텍스트 면접 - ' :
           '文字面试 - '}{currentInterview.position}
        </Title>
        <Text type="secondary">
          {currentInterview.language === 'en-US' || currentInterview.language === 'en-GB' ? 'Have a text conversation with the AI interviewer to showcase your professional abilities' :
           currentInterview.language === 'ja-JP' ? 'AI面接官とテキストで対話し、あなたの専門能力をアピールしてください' :
           currentInterview.language === 'ko-KR' ? 'AI 면접관과 텍스트로 대화하여 전문 능력을 보여주세요' :
           '与AI面试官进行文字对话，展示您的专业能力'}
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

      {/* 对话区域 */}
      <Card 
        title={currentInterview.language === 'en-US' || currentInterview.language === 'en-GB' ? 'Interview Conversation' :
               currentInterview.language === 'ja-JP' ? '面接会話' :
               currentInterview.language === 'ko-KR' ? '면접 대화' :
               '面试对话'}
        style={{ 
          marginBottom: '16px', 
          borderRadius: '12px',
          height: '500px',
          display: 'flex',
          flexDirection: 'column'
        }}
        styles={{ 
          body: {
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column',
            padding: '16px'
          }
        }}
      >
        <div style={{ 
          flex: 1, 
          overflowY: 'auto', 
          marginBottom: '16px',
          padding: '0 8px'
        }}>
          {messages.map((message) => (
            <div key={message.id} style={{ marginBottom: '16px' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'flex-start',
                justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start'
              }}>
                {message.type === 'ai' && (
                  <Avatar 
                    icon={<RobotOutlined />} 
                    style={{ 
                      backgroundColor: '#1890ff',
                      marginRight: '8px',
                      marginTop: '4px'
                    }} 
                  />
                )}
                
                <div style={{
                  maxWidth: '70%',
                  backgroundColor: message.type === 'user' ? '#1890ff' : '#f0f0f0',
                  color: message.type === 'user' ? 'white' : 'black',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  wordBreak: 'break-word'
                }}>
                  <div>{message.content}</div>
                  <div style={{ 
                    fontSize: '12px', 
                    opacity: 0.7,
                    marginTop: '4px'
                  }}>
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>
                
                {message.type === 'user' && (
                  <Avatar 
                    icon={<UserOutlined />} 
                    style={{ 
                      backgroundColor: '#52c41a',
                      marginLeft: '8px',
                      marginTop: '4px'
                    }} 
                  />
                )}
              </div>
            </div>
          ))}
          
          {loading && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Avatar 
                icon={<RobotOutlined />} 
                style={{ 
                  backgroundColor: '#1890ff',
                  marginRight: '8px'
                }} 
              />
              <div style={{
                backgroundColor: '#f0f0f0',
                padding: '12px 16px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center'
              }}>
                <Spin size="small" style={{ marginRight: '8px' }} />
                <Text>AI正在思考...</Text>
              </div>
            </div>
          )}
        </div>

        <Divider style={{ margin: '16px 0' }} />

        {/* 输入区域 */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <TextArea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={currentInterview.language === 'en-US' || currentInterview.language === 'en-GB' ? 'Please enter your answer...' :
                        currentInterview.language === 'ja-JP' ? 'あなたの回答を入力してください...' :
                        currentInterview.language === 'ko-KR' ? '답변을 입력해 주세요...' :
                        '请输入您的回答...'}
            autoSize={{ minRows: 2, maxRows: 4 }}
            onPressEnter={(e) => {
              if (e.shiftKey) return;
              e.preventDefault();
              handleSendMessage();
            }}
            style={{ borderRadius: '8px' }}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSendMessage}
            loading={loading}
            disabled={!inputValue.trim() || !interviewStarted}
            style={{ borderRadius: '8px' }}
          >
            {currentInterview.language === 'en-US' || currentInterview.language === 'en-GB' ? 'Send' :
             currentInterview.language === 'ja-JP' ? '送信' :
             currentInterview.language === 'ko-KR' ? '전송' :
             '发送'}
          </Button>
        </div>
      </Card>

      {/* 操作提示 */}
      <Card style={{ borderRadius: '12px' }}>
        <div style={{ textAlign: 'center' }}>
          <Text type="secondary">
            {currentInterview.language === 'en-US' || currentInterview.language === 'en-GB' ? 'Tip: Press Enter to send message, Shift+Enter for new line' :
             currentInterview.language === 'ja-JP' ? 'ヒント：Enterでメッセージを送信、Shift+Enterで改行' :
             currentInterview.language === 'ko-KR' ? '팁: Enter로 메시지 전송, Shift+Enter로 줄바꿈' :
             '提示：按Enter发送消息，Shift+Enter换行'}
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default TextInterview;
