import React from 'react';
import { Card, Form, Select, Button, Typography, Divider, Space, message, Row, Col } from 'antd';
import { SettingOutlined, SoundOutlined } from '@ant-design/icons';
import useStore from '../store/useStore';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../utils/i18n';
import SEOHead from '../components/SEOHead';

const { Title, Text } = Typography;
const { Option } = Select;

const Settings = () => {
  const { voice, setVoice } = useStore();
  const { language } = useLanguage();

  const handleVoiceChange = (value) => {
    setVoice(value);
    message.success(language === 'en-US' ? 'Voice settings saved' :
                    language === 'ja-JP' ? '音声設定が保存されました' :
                    language === 'ko-KR' ? '음성 설정이 저장되었습니다' :
                    '人声设置已保存');
  };

  const voiceOptions = [
    { 
      value: 'default', 
      label: language === 'en-US' ? 'Default Voice' :
             language === 'ja-JP' ? 'デフォルト音声' :
             language === 'ko-KR' ? '기본 음성' :
             '默认人声'
    },
    { 
      value: 'male', 
      label: language === 'en-US' ? 'Male Voice' :
             language === 'ja-JP' ? '男性音声' :
             language === 'ko-KR' ? '남성 음성' :
             '男声'
    },
    { 
      value: 'female', 
      label: language === 'en-US' ? 'Female Voice' :
             language === 'ja-JP' ? '女性音声' :
             language === 'ko-KR' ? '여성 음성' :
             '女声'
    },
  ];

  return (
    <div>
      <SEOHead 
        title={t('settings.title', language)}
        description={t('settings.subtitle', language)}
      />
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
          <SettingOutlined style={{ marginRight: '8px' }} />
          {t('settings.title', language)}
        </Title>
        <Text type="secondary">
          {t('settings.subtitle', language)}
        </Text>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={24}>
          <Card 
            title={
              <Space>
                <SoundOutlined style={{ color: '#1890ff' }} />
                {language === 'en-US' ? 'Voice Settings' :
                 language === 'ja-JP' ? '音声設定' :
                 language === 'ko-KR' ? '음성 설정' :
                 '人声设置'}
              </Space>
            }
            style={{ borderRadius: '12px' }}
          >
            <Form layout="vertical">
              <Form.Item label={language === 'en-US' ? 'Select Voice' :
                               language === 'ja-JP' ? '音声を選択' :
                               language === 'ko-KR' ? '음성 선택' :
                               '选择人声'}>
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
                {language === 'en-US' ? 'Choose your preferred AI voice type for a more personalized interview experience' :
                 language === 'ja-JP' ? 'お好みのAI音声タイプを選択して、よりパーソナライズされた面接体験を' :
                 language === 'ko-KR' ? '선호하는 AI 음성 유형을 선택하여 더욱 개인화된 면접 경험을' :
                 '选择您喜欢的AI人声类型，让面试体验更加个性化'}
              </Text>
            </Form>
          </Card>
        </Col>
      </Row>

      <Card 
        title={t('settings.otherSettings', language)} 
        style={{ marginTop: '16px', borderRadius: '12px' }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <div>
              <Title level={5}>{t('settings.interviewDuration', language)}</Title>
              <Text type="secondary">
                {t('settings.durationTip', language)}
              </Text>
              <Select
                defaultValue={30}
                style={{ width: '100%', marginTop: '8px' }}
                size="large"
              >
                <Option value={15}>15{language === 'en-US' ? ' min' : language === 'ja-JP' ? '分' : language === 'ko-KR' ? '분' : '分钟'}</Option>
                <Option value={30}>30{language === 'en-US' ? ' min' : language === 'ja-JP' ? '分' : language === 'ko-KR' ? '분' : '分钟'}</Option>
                <Option value={45}>45{language === 'en-US' ? ' min' : language === 'ja-JP' ? '分' : language === 'ko-KR' ? '분' : '分钟'}</Option>
                <Option value={60}>60{language === 'en-US' ? ' min' : language === 'ja-JP' ? '分' : language === 'ko-KR' ? '분' : '分钟'}</Option>
              </Select>
            </div>
          </Col>
          
          <Col xs={24} sm={12}>
            <div>
              <Title level={5}>{t('settings.questionDifficulty', language)}</Title>
              <Text type="secondary">
                {t('settings.difficultyTip', language)}
              </Text>
              <Select
                defaultValue="medium"
                style={{ width: '100%', marginTop: '8px' }}
                size="large"
              >
                <Option value="easy">{t('difficulty.beginner', language)}</Option>
                <Option value="medium">{t('difficulty.intermediate', language)}</Option>
                <Option value="hard">{t('difficulty.advanced', language)}</Option>
              </Select>
            </div>
          </Col>
        </Row>

        <Divider />

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <div>
              <Title level={5}>{t('settings.autoSave', language)}</Title>
              <Text type="secondary">
                {t('settings.autoSaveTip', language)}
              </Text>
              <Select
                defaultValue="enabled"
                style={{ width: '100%', marginTop: '8px' }}
                size="large"
              >
                <Option value="enabled">{language === 'en-US' ? 'Enabled' : language === 'ja-JP' ? '有効' : language === 'ko-KR' ? '활성화' : '启用'}</Option>
                <Option value="disabled">{language === 'en-US' ? 'Disabled' : language === 'ja-JP' ? '無効' : language === 'ko-KR' ? '비활성화' : '禁用'}</Option>
              </Select>
            </div>
          </Col>
          
          <Col xs={24} sm={12}>
            <div>
              <Title level={5}>{t('settings.voiceSettings', language)}</Title>
              <Text type="secondary">
                {t('settings.voiceSettingsTip', language)}
              </Text>
              <Select
                defaultValue="high"
                style={{ width: '100%', marginTop: '8px' }}
                size="large"
              >
                <Option value="low">{language === 'en-US' ? 'Low Accuracy (Fast)' : language === 'ja-JP' ? '低精度（高速）' : language === 'ko-KR' ? '낮은 정확도 (빠름)' : '低精度（快速）'}</Option>
                <Option value="medium">{language === 'en-US' ? 'Medium Accuracy' : language === 'ja-JP' ? '中精度' : language === 'ko-KR' ? '중간 정확도' : '中精度'}</Option>
                <Option value="high">{language === 'en-US' ? 'High Accuracy (Recommended)' : language === 'ja-JP' ? '高精度（推奨）' : language === 'ko-KR' ? '높은 정확도 (권장)' : '高精度（推荐）'}</Option>
              </Select>
            </div>
          </Col>
        </Row>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Button type="primary" size="large">
            {t('settings.saveAllSettings', language)}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
