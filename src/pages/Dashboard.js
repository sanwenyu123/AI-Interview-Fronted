import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Typography, Button, Space, Statistic, Progress, Spin } from 'antd';
import {
  PlayCircleOutlined,
  EditOutlined,
  SoundOutlined,
  HistoryOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import interviewService from '../services/interviewService';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../utils/i18n';
import SEOHead from '../components/SEOHead';

const { Title, Text } = Typography;

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useStore();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalInterviews: 0,
    completedInterviews: 0,
    averageScore: 0,
    totalTime: 0,
  });
  const [recentInterviews, setRecentInterviews] = useState([]);

  // 从后端加载统计数据和最近面试
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);

        // 获取统计数据
        const statsData = await interviewService.getStatistics();
        setStats({
          totalInterviews: statsData.total_interviews || 0,
          completedInterviews: statsData.completed_interviews || 0,
          averageScore: statsData.average_score || 0,
          totalTime: statsData.total_duration || 0,
        });

        // 获取最近面试记录
        const interviewsData = await interviewService.getInterviews({
          limit: 3,
          sort: 'created_at',
          order: 'desc'
        });
        setRecentInterviews(interviewsData || []);
      } catch (error) {
        console.error('加载数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" tip="加载中..." />
      </div>
    );
  }

  return (
    <div>
      <SEOHead 
        title={t('dashboard.title', language)}
        description={t('dashboard.subtitle', language)}
      />
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
          {language === 'en-US' ? `Welcome back, ${user?.username || 'User'}!` :
           language === 'ja-JP' ? `おかえりなさい、${user?.username || 'ユーザー'}さん！` :
           language === 'ko-KR' ? `환영합니다, ${user?.username || '사용자'}님!` :
           `欢迎回来，${user?.username || '用户'}！`}
        </Title>
        <Text type="secondary">
          {language === 'en-US' ? 'Ready to start your AI interview journey?' :
           language === 'ja-JP' ? 'AI面接の旅を始める準備はできましたか？' :
           language === 'ko-KR' ? 'AI 면접 여정을 시작할 준비가 되셨나요?' :
           '准备好开始您的AI面试之旅了吗？'}
        </Text>
      </div>

      {/* 快速操作卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            onClick={() => navigate('/job-setup')}
            style={{ textAlign: 'center', borderRadius: '12px' }}
            styles={{ body: { padding: '24px' } }}
          >
            <EditOutlined style={{ fontSize: '32px', color: '#1890ff', marginBottom: '12px' }} />
            <Title level={4} style={{ margin: '8px 0' }}>{t('dashboard.jobSetup', language)}</Title>
            <Text type="secondary">{t('dashboard.jobSetupDesc', language)}</Text>
          </Card>
        </Col>

        {/* 文字面试入口已移除 */}

        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            onClick={() => navigate('/voice-interview')}
            style={{ textAlign: 'center', borderRadius: '12px' }}
            styles={{ body: { padding: '24px' } }}
          >
            <SoundOutlined style={{ fontSize: '32px', color: '#fa8c16', marginBottom: '12px' }} />
            <Title level={4} style={{ margin: '8px 0' }}>{t('dashboard.startVoiceInterview', language)}</Title>
            <Text type="secondary">{t('dashboard.voiceInterviewDesc', language)}</Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            onClick={() => navigate('/interview-history')}
            style={{ textAlign: 'center', borderRadius: '12px' }}
            styles={{ body: { padding: '24px' } }}
          >
            <HistoryOutlined style={{ fontSize: '32px', color: '#722ed1', marginBottom: '12px' }} />
            <Title level={4} style={{ margin: '8px 0' }}>{t('dashboard.viewHistory', language)}</Title>
            <Text type="secondary">{t('dashboard.historyDesc', language)}</Text>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* 统计信息 */}
        <Col xs={24} lg={12}>
          <Card title={t('dashboard.interviewStats', language)} style={{ borderRadius: '12px' }}>
            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title={t('dashboard.totalInterviews', language)}
                  value={stats.totalInterviews}
                  prefix={<UserOutlined />}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title={language === 'en-US' ? 'Completed' :
                         language === 'ja-JP' ? '完了回数' :
                         language === 'ko-KR' ? '완료 횟수' :
                         '完成次数'}
                  value={stats.completedInterviews}
                  prefix={<TrophyOutlined />}
                />
              </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: '16px' }}>
              <Col span={12}>
                <Statistic
                  title={t('dashboard.averageScore', language)}
                  value={stats.averageScore}
                  suffix="/ 100"
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title={language === 'en-US' ? 'Total Practice Time' :
                         language === 'ja-JP' ? '総練習時間' :
                         language === 'ko-KR' ? '총 연습 시간' :
                         '总练习时间'}
                  value={Math.round(stats.totalTime / 60)}
                  suffix={language === 'en-US' ? 'min' : language === 'ja-JP' ? '分' : language === 'ko-KR' ? '분' : '分钟'}
                  prefix={<ClockCircleOutlined />}
                />
              </Col>
            </Row>
          </Card>
        </Col>

        {/* 最近面试记录 */}
        <Col xs={24} lg={12}>
          <Card title={t('dashboard.recentActivity', language)} style={{ borderRadius: '12px' }}>
            {recentInterviews.length > 0 ? (
              <div>
                {recentInterviews.map((interview, index) => (
                  <div key={index} style={{
                    padding: '12px 0',
                    borderBottom: index < recentInterviews.length - 1 ? '1px solid #f0f0f0' : 'none'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <Text strong>{interview.position || (language === 'en-US' ? 'Unknown Position' :
                                                              language === 'ja-JP' ? '不明な職種' :
                                                              language === 'ko-KR' ? '알 수 없는 직무' :
                                                              '未知岗位')}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {interview.date || (language === 'en-US' ? 'Unknown Date' :
                                              language === 'ja-JP' ? '不明な日付' :
                                              language === 'ko-KR' ? '알 수 없는 날짜' :
                                              '未知日期')}
                        </Text>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1890ff' }}>
                          {interview.score || 0}
                        </div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {language === 'en-US' ? 'pts' : language === 'ja-JP' ? '点' : language === 'ko-KR' ? '점' : '分'}
                        </Text>
                      </div>
                    </div>
                  </div>
                ))}
                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                  <Button type="link" onClick={() => navigate('/interview-history')}>
                    {language === 'en-US' ? 'View All Records' :
                     language === 'ja-JP' ? '全記録を見る' :
                     language === 'ko-KR' ? '모든 기록 보기' :
                     '查看全部记录'}
                  </Button>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <Text type="secondary">
                  {language === 'en-US' ? 'No interview records yet' :
                   language === 'ja-JP' ? 'まだ面接記録がありません' :
                   language === 'ko-KR' ? '아직 면접 기록이 없습니다' :
                   '还没有面试记录'}
                </Text>
                <br />
                <Button
                  type="primary"
                  onClick={() => navigate('/job-setup')}
                  style={{ marginTop: '16px' }}
                >
                  {language === 'en-US' ? 'Start First Interview' :
                   language === 'ja-JP' ? '最初の面接を開始' :
                   language === 'ko-KR' ? '첫 번째 면접 시작' :
                   '开始第一次面试'}
                </Button>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* 快速开始按钮 */}
      <div style={{
        textAlign: 'center',
        marginTop: '32px',
        padding: '24px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '12px',
        color: 'white'
      }}>
        <Title level={3} style={{ color: 'white', margin: '0 0 16px 0' }}>
          准备开始面试了吗？
        </Title>
        <Text style={{ color: 'rgba(255,255,255,0.8)', display: 'block', marginBottom: '24px' }}>
          选择您喜欢的面试方式，开始您的AI面试之旅
        </Text>
        <Space size="large">
          <Button
            type="primary"
            size="large"
            icon={<SoundOutlined />}
            onClick={() => navigate('/voice-interview')}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: 'white'
            }}
          >
            语音面试
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default Dashboard;
