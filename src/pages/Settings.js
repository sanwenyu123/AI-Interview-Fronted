import React from 'react';
import { Card, Form, Select, Button, Typography, Divider, Space, message, Row, Col } from 'antd';
import { SettingOutlined, GlobalOutlined, SoundOutlined } from '@ant-design/icons';
import useStore from '../store/useStore';

const { Title, Text } = Typography;
const { Option } = Select;

const Settings = () => {
  const { language, voice, setLanguage, setVoice } = useStore();

  const handleLanguageChange = (value) => {
    setLanguage(value);
    message.success('语言设置已保存');
  };

  const handleVoiceChange = (value) => {
    setVoice(value);
    message.success('人声设置已保存');
  };

  const languageOptions = [
    { value: 'zh-CN', label: '中文（简体）' },
    { value: 'zh-TW', label: '中文（繁体）' },
    { value: 'en-US', label: 'English (US)' },
    { value: 'en-GB', label: 'English (UK)' },
    { value: 'ja-JP', label: '日本語' },
    { value: 'ko-KR', label: '한국어' },
  ];

  const voiceOptions = [
    { value: 'default', label: '默认人声' },
    { value: 'male', label: '男声' },
    { value: 'female', label: '女声' },
    { value: 'young', label: '年轻声音' },
    { value: 'mature', label: '成熟声音' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
          <SettingOutlined style={{ marginRight: '8px' }} />
          系统设置
        </Title>
        <Text type="secondary">
          自定义您的面试体验
        </Text>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <GlobalOutlined style={{ color: '#1890ff' }} />
                语言设置
              </Space>
            }
            style={{ borderRadius: '12px' }}
          >
            <Form layout="vertical">
              <Form.Item label="选择语言">
                <Select
                  value={language}
                  onChange={handleLanguageChange}
                  style={{ width: '100%' }}
                  size="large"
                >
                  {languageOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Text type="secondary">
                选择您偏好的语言，AI将使用该语言与您进行面试对话
              </Text>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <SoundOutlined style={{ color: '#1890ff' }} />
                人声设置
              </Space>
            }
            style={{ borderRadius: '12px' }}
          >
            <Form layout="vertical">
              <Form.Item label="选择人声">
                <Select
                  value={voice}
                  onChange={handleVoiceChange}
                  style={{ width: '100%' }}
                  size="large"
                >
                  {voiceOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Text type="secondary">
                选择您喜欢的AI人声类型，让面试体验更加个性化
              </Text>
            </Form>
          </Card>
        </Col>
      </Row>

      <Card 
        title="其他设置" 
        style={{ marginTop: '16px', borderRadius: '12px' }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <div>
              <Title level={5}>面试时长设置</Title>
              <Text type="secondary">
                设置单次面试的时长限制（分钟）
              </Text>
              <Select
                defaultValue={30}
                style={{ width: '100%', marginTop: '8px' }}
                size="large"
              >
                <Option value={15}>15分钟</Option>
                <Option value={30}>30分钟</Option>
                <Option value={45}>45分钟</Option>
                <Option value={60}>60分钟</Option>
              </Select>
            </div>
          </Col>
          
          <Col xs={24} sm={12}>
            <div>
              <Title level={5}>问题难度</Title>
              <Text type="secondary">
                设置面试问题的难度级别
              </Text>
              <Select
                defaultValue="medium"
                style={{ width: '100%', marginTop: '8px' }}
                size="large"
              >
                <Option value="easy">简单</Option>
                <Option value="medium">中等</Option>
                <Option value="hard">困难</Option>
                <Option value="expert">专家</Option>
              </Select>
            </div>
          </Col>
        </Row>

        <Divider />

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <div>
              <Title level={5}>自动保存</Title>
              <Text type="secondary">
                自动保存面试记录和进度
              </Text>
              <Select
                defaultValue="enabled"
                style={{ width: '100%', marginTop: '8px' }}
                size="large"
              >
                <Option value="enabled">启用</Option>
                <Option value="disabled">禁用</Option>
              </Select>
            </div>
          </Col>
          
          <Col xs={24} sm={12}>
            <div>
              <Title level={5}>语音识别</Title>
              <Text type="secondary">
                语音面试时的识别精度
              </Text>
              <Select
                defaultValue="high"
                style={{ width: '100%', marginTop: '8px' }}
                size="large"
              >
                <Option value="low">低精度（快速）</Option>
                <Option value="medium">中精度</Option>
                <Option value="high">高精度（推荐）</Option>
              </Select>
            </div>
          </Col>
        </Row>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Button type="primary" size="large">
            保存所有设置
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
