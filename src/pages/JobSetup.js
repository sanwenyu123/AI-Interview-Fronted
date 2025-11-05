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
  Divider
} from 'antd';
import {
  EditOutlined,
  PlusOutlined,
  DeleteOutlined,
  SaveOutlined,
  PlayCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import interviewService from '../services/interviewService';
import questionService from '../services/questionService';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const JobSetup = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setCurrentInterview, language, setLanguage } = useStore();

  // 预设岗位模板
  const jobTemplates = [
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
        language: values.interviewLanguage || language,
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
        language: values.interviewLanguage || language,
        createdAt: interview.created_at,
      };

      setCurrentInterview(interviewConfig);
      message.success('岗位设置已保存！');

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
      interviewLanguage: language, // 使用当前语言设置
    });
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
            interviewLanguage: latest.language || language,
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
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
          <EditOutlined style={{ marginRight: '8px' }} />
          岗位设置
        </Title>
        <Text type="secondary">
          设置面试岗位信息，AI将根据您的设置生成个性化面试问题
        </Text>
      </div>

      <Row gutter={[16, 16]}>
        {/* 岗位设置表单 */}
        <Col xs={24} lg={16}>
          <Card title="岗位信息" style={{ borderRadius: '12px' }}>
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              size="large"
            >
              <Form.Item
                name="position"
                label="岗位名称"
                rules={[{ required: true, message: '请输入岗位名称!' }]}
              >
                <Input
                  placeholder="例如：前端开发工程师"
                  style={{ borderRadius: '8px' }}
                />
              </Form.Item>

              <Form.Item
                name="description"
                label="岗位描述"
              >
                <TextArea
                  rows={4}
                  placeholder="请详细描述岗位职责、要求和技能...（可选）"
                  style={{ borderRadius: '8px' }}
                />
              </Form.Item>

              <Form.Item
                name="skills"
                label="技能要求"
              >
                <Select
                  mode="tags"
                  placeholder="输入或选择技能标签"
                  style={{ borderRadius: '8px' }}
                >
                  <Option value="JavaScript">JavaScript</Option>
                  <Option value="React">React</Option>
                  <Option value="Vue">Vue</Option>
                  <Option value="Python">Python</Option>
                  <Option value="Java">Java</Option>
                  <Option value="Node.js">Node.js</Option>
                  <Option value="MySQL">MySQL</Option>
                  <Option value="产品设计">产品设计</Option>
                  <Option value="UI设计">UI设计</Option>
                  <Option value="项目管理">项目管理</Option>
                </Select>
              </Form.Item>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="difficulty"
                    label="面试难度"
                    rules={[{ required: true, message: '请选择面试难度!' }]}
                  >
                    <Select placeholder="选择难度" style={{ borderRadius: '8px' }}>
                      <Option value="easy">简单</Option>
                      <Option value="medium">中等</Option>
                      <Option value="hard">困难</Option>
                      <Option value="expert">专家</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="duration"
                    label="面试时长（分钟）"
                  >
                    <Select placeholder="选择时长" style={{ borderRadius: '8px' }}>
                      <Option value={15}>15分钟</Option>
                      <Option value={30}>30分钟</Option>
                      <Option value={45}>45分钟</Option>
                      <Option value={60}>60分钟</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="interviewLanguage"
                    label="面试语言"
                    initialValue={language}
                  >
                    <Select
                      placeholder="选择面试语言"
                      style={{ borderRadius: '8px' }}
                      onChange={(value) => setLanguage(value)}
                    >
                      <Option value="zh-CN">中文（简体）</Option>
                      <Option value="zh-TW">中文（繁体）</Option>
                      <Option value="en-US">English (US)</Option>
                      <Option value="en-GB">English (UK)</Option>
                      <Option value="ja-JP">日本語</Option>
                      <Option value="ko-KR">한국어</Option>
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
                    保存设置
                  </Button>
                  <Button
                    type="default"
                    htmlType="button"
                    onClick={() => form.resetFields()}
                    size="large"
                    style={{ borderRadius: '8px' }}
                  >
                    重置
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        {/* 岗位模板 */}
        <Col xs={24} lg={8}>
          <Card title="快速模板" style={{ borderRadius: '12px' }}>
            <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
              选择预设模板快速开始
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
            设置完成后，点击下方按钮开始语音面试
          </Title>
          <Text type="secondary" style={{ display: 'block', marginBottom: '24px' }}>
            系统将基于您的岗位配置生成题目并进入语音面试
          </Text>
          <Space size="large">
            <Button
              type="primary"
              size="large"
              icon={<PlayCircleOutlined />}
              onClick={() => navigate('/voice-interview')}
              style={{ borderRadius: '8px' }}
            >
              开始语音面试
            </Button>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default JobSetup;
