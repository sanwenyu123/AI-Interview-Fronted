import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  Space,
  message,
  Row,
  Col,
  Select,
  Tag,
  Divider,
  Upload,
  Spin,
  Alert
} from 'antd';
import {
  EditOutlined,
  PlusOutlined,
  DeleteOutlined,
  SaveOutlined,
  PlayCircleOutlined,
  UploadOutlined,
  FileTextOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import interviewService from '../services/interviewService';
import questionService from '../services/questionService';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../utils/i18n';
import SEOHead from '../components/SEOHead';
import { API_CONFIG } from '../config/api';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const JobSetup = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [resumeAnalyzing, setResumeAnalyzing] = useState(false);
  const [resumeAnalysis, setResumeAnalysis] = useState(null);
  const [uploadedResume, setUploadedResume] = useState(null);
  const navigate = useNavigate();
  const { setCurrentInterview } = useStore();
  const { language } = useLanguage();

  // 预设岗位模板 - 多语言支持
  const getJobTemplates = () => {
    if (language === 'en-US' || language === 'en-GB') {
      return [
        {
          title: 'Frontend Developer',
          description: 'Responsible for web frontend development, familiar with React, Vue and other frameworks, with good programming skills and teamwork spirit.',
          skills: ['JavaScript', 'React', 'HTML/CSS', 'Node.js']
        },
        {
          title: 'Backend Developer',
          description: 'Responsible for server-side development, familiar with Java, Python and other languages, with database design and API development capabilities.',
          skills: ['Java', 'Python', 'MySQL', 'Spring Boot']
        },
        {
          title: 'Product Manager',
          description: 'Responsible for product planning and design, with user research, requirement analysis and project management capabilities.',
          skills: ['Product Design', 'User Research', 'Project Management', 'Data Analysis']
        },
        {
          title: 'UI/UX Designer',
          description: 'Responsible for user interface and user experience design, with good aesthetic ability and design tool usage skills.',
          skills: ['UI Design', 'UX Design', 'Figma', 'User Research']
        }
      ];
    } else if (language === 'ja-JP') {
      return [
        {
          title: 'フロントエンド開発者',
          description: 'Web フロントエンド開発を担当し、React、Vue などのフレームワークに精通し、優れたプログラミング能力とチームワーク精神を備えています。',
          skills: ['JavaScript', 'React', 'HTML/CSS', 'Node.js']
        },
        {
          title: 'バックエンド開発者',
          description: 'サーバーサイド開発を担当し、Java、Python などの言語に精通し、データベース設計と API 開発能力を備えています。',
          skills: ['Java', 'Python', 'MySQL', 'Spring Boot']
        },
        {
          title: 'プロダクトマネージャー',
          description: '製品企画・設計を担当し、ユーザー研究、要件分析、プロジェクト管理能力を備えています。',
          skills: ['プロダクト設計', 'ユーザー研究', 'プロジェクト管理', 'データ分析']
        },
        {
          title: 'UI/UXデザイナー',
          description: 'ユーザーインターフェースとユーザーエクスペリエンス設計を担当し、優れた美的感覚とデザインツール使用スキルを備えています。',
          skills: ['UIデザイン', 'UXデザイン', 'Figma', 'ユーザー研究']
        }
      ];
    } else if (language === 'ko-KR') {
      return [
        {
          title: '프론트엔드 개발자',
          description: '웹 프론트엔드 개발을 담당하며, React, Vue 등의 프레임워크에 능숙하고, 우수한 프로그래밍 능력과 팀워크 정신을 갖추고 있습니다.',
          skills: ['JavaScript', 'React', 'HTML/CSS', 'Node.js']
        },
        {
          title: '백엔드 개발자',
          description: '서버 사이드 개발을 담당하며, Java, Python 등의 언어에 능숙하고, 데이터베이스 설계 및 API 개발 능력을 갖추고 있습니다.',
          skills: ['Java', 'Python', 'MySQL', 'Spring Boot']
        },
        {
          title: '제품 관리자',
          description: '제품 기획 및 설계를 담당하며, 사용자 연구, 요구사항 분석 및 프로젝트 관리 능력을 갖추고 있습니다.',
          skills: ['제품 설계', '사용자 연구', '프로젝트 관리', '데이터 분석']
        },
        {
          title: 'UI/UX 디자이너',
          description: '사용자 인터페이스 및 사용자 경험 설계를 담당하며, 우수한 미적 감각과 디자인 도구 사용 기술을 갖추고 있습니다.',
          skills: ['UI 디자인', 'UX 디자인', 'Figma', '사용자 연구']
        }
      ];
    } else {
      // 默认中文
      return [
        {
          title: '前端开发工程师',
          description: '负责Web前端开发，熟悉React、Vue等框架，具备良好的编程能力和团队协作精神。',
          skills: ['JavaScript', 'React', 'HTML/CSS', 'Node.js']
        },
        {
          title: '后端开发工程师',
          description: '负责服务端开发，熟悉Java、Python等语言，具备数据库设计和API开发能力。',
          skills: ['Java', 'Python', 'MySQL', 'Spring Boot']
        },
        {
          title: '产品经理',
          description: '负责产品规划和设计，具备用户研究、需求分析和项目管理能力。',
          skills: ['产品设计', '用户研究', '项目管理', '数据分析']
        },
        {
          title: 'UI/UX设计师',
          description: '负责用户界面和用户体验设计，具备良好的审美能力和设计工具使用能力。',
          skills: ['UI设计', 'UX设计', 'Figma', '用户研究']
        }
      ];
    }
  };

  const jobTemplates = getJobTemplates();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // 创建面试记录
      const interviewData = {
        // 与后端 InterviewCreate 保持一致
        position: values.position,
        description: values.description || '',
        skills: values.skills || [],
        difficulty: values.difficulty,
        duration: values.duration || 30,
        language: language,
        type: 'voice',
      };

      const interview = await interviewService.createInterview(interviewData);

      // 不在此处生成面试题，改为进入语音面试时生成

      // 保存到全局状态
      const interviewConfig = {
        id: interview.id,
        position: values.position,
        description: values.description || '',
        skills: values.skills || [],
        difficulty: values.difficulty,
        duration: values.duration || 30,
        language: language,
        createdAt: interview.created_at,
      };

      setCurrentInterview(interviewConfig);
      message.success(language === 'en-US' ? 'Job settings saved!' :
                      language === 'ja-JP' ? '職種設定が保存されました！' :
                      language === 'ko-KR' ? '직무 설정이 저장되었습니다!' :
                      '岗位设置已保存！');

      // 直接进入语音面试
      navigate('/voice-interview');
    } catch (error) {
      console.error('保存失败:', error);
      const detail = error?.response?.data?.detail;
      const errMsg = Array.isArray(detail)
        ? detail.map((e) => e?.msg).join('; ')
        : (typeof detail === 'string' ? detail : '保存失败，请重试');
      message.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSelect = (template) => {
    form.setFieldsValue({
      position: template.title,
      description: template.description,
      skills: template.skills,
      difficulty: 'medium', // 默认中等难度
    });
  };

  // 简历上传处理
  const handleResumeUpload = async (file) => {
    const isValidType = file.type === 'application/pdf' || 
                       file.type === 'application/msword' || 
                       file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                       file.type === 'text/plain';
    
    if (!isValidType) {
      message.error(language === 'en-US' ? 'Please upload PDF, DOC, DOCX or TXT files only!' :
                    language === 'ja-JP' ? 'PDF、DOC、DOCX、TXTファイルのみアップロードしてください！' :
                    language === 'ko-KR' ? 'PDF, DOC, DOCX, TXT 파일만 업로드해주세요!' :
                    '请只上传PDF、DOC、DOCX或TXT格式的文件！');
      return false;
    }

    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error(language === 'en-US' ? 'File must be smaller than 10MB!' :
                    language === 'ja-JP' ? 'ファイルは10MB未満である必要があります！' :
                    language === 'ko-KR' ? '파일은 10MB 미만이어야 합니다!' :
                    '文件大小必须小于10MB！');
      return false;
    }

    setResumeUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // 调用简历上传API
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.API_PREFIX}/resume/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      setUploadedResume(result);
      
      message.success(language === 'en-US' ? 'Resume uploaded successfully!' :
                      language === 'ja-JP' ? '履歴書のアップロードが成功しました！' :
                      language === 'ko-KR' ? '이력서 업로드가 성공했습니다!' :
                      '简历上传成功！');

      // 开始AI分析
      await analyzeResume(result.id);
      
    } catch (error) {
      console.error('Resume upload failed:', error);
      message.error(language === 'en-US' ? 'Resume upload failed, please try again' :
                    language === 'ja-JP' ? '履歴書のアップロードに失敗しました。再試行してください' :
                    language === 'ko-KR' ? '이력서 업로드에 실패했습니다. 다시 시도해주세요' :
                    '简历上传失败，请重试');
    } finally {
      setResumeUploading(false);
    }

    return false; // 阻止默认上传行为
  };

  // AI分析简历
  const analyzeResume = async (resumeId) => {
    setResumeAnalyzing(true);
    
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.API_PREFIX}/resume/${resumeId}/analyze`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const analysis = await response.json();
      setResumeAnalysis(analysis);
      
      // 根据分析结果自动填充表单
      if (analysis.suggested_skills && analysis.suggested_skills.length > 0) {
        const currentSkills = form.getFieldValue('skills') || [];
        const newSkills = [...new Set([...currentSkills, ...analysis.suggested_skills])];
        form.setFieldValue('skills', newSkills);
      }

      message.success(language === 'en-US' ? 'Resume analysis completed!' :
                      language === 'ja-JP' ? '履歴書の分析が完了しました！' :
                      language === 'ko-KR' ? '이력서 분석이 완료되었습니다!' :
                      '简历分析完成！');
      
    } catch (error) {
      console.error('Resume analysis failed:', error);
      message.error(language === 'en-US' ? 'Resume analysis failed, please try again' :
                    language === 'ja-JP' ? '履歴書の分析に失敗しました。再試行してください' :
                    language === 'ko-KR' ? '이력서 분석에 실패했습니다. 다시 시도해주세요' :
                    '简历分析失败，请重试');
    } finally {
      setResumeAnalyzing(false);
    }
  };

  // 打开页面时预填最近一次岗位设置
  useEffect(() => {
    (async () => {
      try {
        const list = await interviewService.getInterviews({
          page: 1,
          page_size: 1,
          limit: 1,
          sort: 'created_at',
          order: 'desc',
          order_by: '-created_at',
        });
        const items = Array.isArray(list) ? list : (Array.isArray(list?.items) ? list.items : []);
        const latest = items && items.length > 0 ? items[0] : null;
        if (latest) {
          form.setFieldsValue({
            position: latest.position || '',
            description: latest.description || '',
            skills: latest.skills || [],
            difficulty: latest.difficulty || 'medium',
            duration: latest.duration || 30,
          });
          // 同步全局当前面试配置
          setCurrentInterview({
            id: latest.id,
            position: latest.position,
            description: latest.description || '',
            skills: latest.skills || [],
            difficulty: latest.difficulty,
            duration: latest.duration,
            language: latest.language,
            createdAt: latest.created_at || latest.createdAt,
          });
        }
      } catch (e) {
        // 失败忽略，不影响用户手动填写
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <SEOHead 
        title={t('jobSetup.title', language)}
        description={t('jobSetup.subtitle', language)}
      />
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
          <EditOutlined style={{ marginRight: '8px' }} />
          {t('jobSetup.title', language)}
        </Title>
        <Text type="secondary">
          {t('jobSetup.subtitle', language)}
        </Text>
      </div>

      <Row gutter={[16, 16]}>
        {/* 岗位设置表单 */}
        <Col xs={24} lg={16}>
          <Card title={t('jobSetup.jobInfo', language)} style={{ borderRadius: '12px' }}>
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              size="large"
            >
              <Form.Item
                name="position"
                label={t('jobSetup.jobTitle', language)}
                rules={[{ required: true, message: t('jobSetup.jobTitle', language) + '!' }]}
              >
                <Input
                  placeholder={language === 'en-US' ? 'e.g.: Frontend Developer' : 
                              language === 'ja-JP' ? '例：フロントエンド開発者' :
                              language === 'ko-KR' ? '예: 프론트엔드 개발자' :
                              '例如：前端开发工程师'}
                  style={{ borderRadius: '8px' }}
                />
              </Form.Item>

              <Form.Item
                name="description"
                label={t('jobSetup.jobDescription', language)}
              >
                <TextArea
                  rows={4}
                  placeholder={language === 'en-US' ? 'Please describe job responsibilities, requirements and skills... (optional)' :
                              language === 'ja-JP' ? '職務内容、要件、スキルを詳しく記述してください...（任意）' :
                              language === 'ko-KR' ? '직무 내용, 요구사항, 기술을 자세히 설명해주세요... (선택사항)' :
                              '请详细描述岗位职责、要求和技能...（可选）'}
                  style={{ borderRadius: '8px' }}
                />
              </Form.Item>

              <Form.Item
                name="skills"
                label={t('jobSetup.techStack', language)}
              >
                <Select
                  mode="tags"
                  placeholder={language === 'en-US' ? 'Enter or select skill tags' :
                              language === 'ja-JP' ? 'スキルタグを入力または選択' :
                              language === 'ko-KR' ? '기술 태그 입력 또는 선택' :
                              '输入或选择技能标签'}
                  style={{ borderRadius: '8px' }}
                >
                  <Option value="JavaScript">JavaScript</Option>
                  <Option value="React">React</Option>
                  <Option value="Vue">Vue</Option>
                  <Option value="Python">Python</Option>
                  <Option value="Java">Java</Option>
                  <Option value="Node.js">Node.js</Option>
                  <Option value="MySQL">MySQL</Option>
                  {language === 'en-US' || language === 'en-GB' ? (
                    <>
                      <Option value="Product Design">Product Design</Option>
                      <Option value="UI Design">UI Design</Option>
                      <Option value="Project Management">Project Management</Option>
                    </>
                  ) : language === 'ja-JP' ? (
                    <>
                      <Option value="プロダクト設計">プロダクト設計</Option>
                      <Option value="UIデザイン">UIデザイン</Option>
                      <Option value="プロジェクト管理">プロジェクト管理</Option>
                    </>
                  ) : language === 'ko-KR' ? (
                    <>
                      <Option value="제품 설계">제품 설계</Option>
                      <Option value="UI 디자인">UI 디자인</Option>
                      <Option value="프로젝트 관리">프로젝트 관리</Option>
                    </>
                  ) : (
                    <>
                      <Option value="产品设计">产品设计</Option>
                      <Option value="UI设计">UI设计</Option>
                      <Option value="项目管理">项目管理</Option>
                    </>
                  )}
                </Select>
              </Form.Item>

              {/* 简历上传功能 */}
              <Form.Item
                label={t('jobSetup.resumeUpload', language)}
              >
                <Upload
                  beforeUpload={handleResumeUpload}
                  showUploadList={false}
                  accept=".pdf,.doc,.docx,.txt"
                  disabled={resumeUploading || resumeAnalyzing}
                >
                  <Button 
                    icon={<UploadOutlined />} 
                    loading={resumeUploading}
                    style={{ borderRadius: '8px' }}
                  >
                    {resumeUploading ? 
                      t('jobSetup.uploading', language) :
                      t('jobSetup.uploadResume', language)
                    }
                  </Button>
                </Upload>
                <div style={{ marginTop: '8px', color: '#666', fontSize: '12px' }}>
                  {t('jobSetup.resumeFormats', language)}
                </div>
              </Form.Item>

              {/* AI分析进度 */}
              {resumeAnalyzing && (
                <Alert
                  message={
                    <Space>
                      <Spin size="small" />
                      {t('jobSetup.aiAnalyzing', language)}
                    </Space>
                  }
                  type="info"
                  style={{ marginBottom: '16px', borderRadius: '8px' }}
                />
              )}

              {/* AI分析结果 */}
              {resumeAnalysis && (
                <Card 
                  title={
                    <Space>
                      <CheckCircleOutlined style={{ color: '#52c41a' }} />
                      {t('jobSetup.aiAnalysisResult', language)}
                    </Space>
                  }
                  size="small"
                  style={{ marginBottom: '16px', borderRadius: '8px' }}
                >
                  <Row gutter={[16, 16]}>
                    <Col span={24}>
                      <div>
                        <Text strong>
                          {t('jobSetup.workExperience', language)}
                        </Text>
                        <div style={{ marginTop: '4px', padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                          <Text>{resumeAnalysis.work_experience_summary || 
                                t('jobSetup.noWorkExperience', language)}</Text>
                        </div>
                      </div>
                    </Col>
                    <Col span={24}>
                      <div>
                        <Text strong>
                          {t('jobSetup.projectExperience', language)}
                        </Text>
                        <div style={{ marginTop: '4px', padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                          <Text>{resumeAnalysis.project_experience_summary || 
                                t('jobSetup.noProjectExperience', language)}</Text>
                        </div>
                      </div>
                    </Col>
                    {resumeAnalysis.suggested_skills && resumeAnalysis.suggested_skills.length > 0 && (
                      <Col span={24}>
                        <div>
                          <Text strong>
                            {t('jobSetup.suggestedSkills', language)}
                          </Text>
                          <div style={{ marginTop: '4px' }}>
                            {resumeAnalysis.suggested_skills.map((skill, index) => (
                              <Tag key={index} color="blue" style={{ margin: '2px' }}>
                                {skill}
                              </Tag>
                            ))}
                          </div>
                        </div>
                      </Col>
                    )}
                  </Row>
                </Card>
              )}

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="difficulty"
                    label={t('jobSetup.difficulty', language)}
                    rules={[{ required: true, message: t('jobSetup.difficulty', language) + '!' }]}
                  >
                    <Select placeholder={language === 'en-US' ? 'Select difficulty' :
                                       language === 'ja-JP' ? '難易度を選択' :
                                       language === 'ko-KR' ? '난이도 선택' :
                                       '选择难度'} style={{ borderRadius: '8px' }}>
                      <Option value="easy">{t('difficulty.beginner', language)}</Option>
                      <Option value="medium">{t('difficulty.intermediate', language)}</Option>
                      <Option value="hard">{t('difficulty.advanced', language)}</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="duration"
                    label={t('jobSetup.duration', language)}
                  >
                    <Select placeholder={language === 'en-US' ? 'Select duration' :
                                       language === 'ja-JP' ? '時間を選択' :
                                       language === 'ko-KR' ? '시간 선택' :
                                       '选择时长'} style={{ borderRadius: '8px' }}>
                      <Option value={15}>15{language === 'en-US' ? ' min' : language === 'ja-JP' ? '分' : language === 'ko-KR' ? '분' : '分钟'}</Option>
                      <Option value={30}>30{language === 'en-US' ? ' min' : language === 'ja-JP' ? '分' : language === 'ko-KR' ? '분' : '分钟'}</Option>
                      <Option value={45}>45{language === 'en-US' ? ' min' : language === 'ja-JP' ? '分' : language === 'ko-KR' ? '분' : '分钟'}</Option>
                      <Option value={60}>60{language === 'en-US' ? ' min' : language === 'ja-JP' ? '分' : language === 'ko-KR' ? '분' : '分钟'}</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item>
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    icon={<SaveOutlined />}
                    size="large"
                    style={{ borderRadius: '8px' }}
                  >
                    {t('jobSetup.saveSettings', language)}
                  </Button>
                  <Button
                    type="default"
                    htmlType="button"
                    onClick={() => form.resetFields()}
                    size="large"
                    style={{ borderRadius: '8px' }}
                  >
                    {language === 'en-US' ? 'Reset' :
                     language === 'ja-JP' ? 'リセット' :
                     language === 'ko-KR' ? '재설정' :
                     '重置'}
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        {/* 岗位模板 */}
        <Col xs={24} lg={8}>
          <Card title={t('jobSetup.quickTemplate', language)} style={{ borderRadius: '12px' }}>
            <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
              {t('jobSetup.templateTip', language)}
            </Text>

            {jobTemplates.map((template, index) => (
              <Card
                key={index}
                size="small"
                hoverable
                onClick={() => handleTemplateSelect(template)}
                style={{
                  marginBottom: '12px',
                  cursor: 'pointer',
                  borderRadius: '8px'
                }}
              >
                <div>
                  <Title level={5} style={{ margin: '0 0 8px 0' }}>
                    {template.title}
                  </Title>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {template.description}
                  </Text>
                  <div style={{ marginTop: '8px' }}>
                    {template.skills.map((skill, skillIndex) => (
                      <Tag key={skillIndex} size="small" color="blue">
                        {skill}
                      </Tag>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </Card>
        </Col>
      </Row>

      {/* 操作提示 */}
      <Card style={{ marginTop: '16px', borderRadius: '12px' }}>
        <div style={{ textAlign: 'center' }}>
          <Title level={4} style={{ color: '#1890ff' }}>
            {t('jobSetup.setupComplete', language)}
          </Title>
          <Text type="secondary" style={{ display: 'block', marginBottom: '24px' }}>
            {t('jobSetup.microphoneTip', language)}
          </Text>
          <Space size="large">
            <Button
              type="primary"
              size="large"
              icon={<PlayCircleOutlined />}
              onClick={() => navigate('/voice-interview')}
              style={{ borderRadius: '8px' }}
            >
              {t('jobSetup.startVoiceInterview', language)}
            </Button>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default JobSetup;
