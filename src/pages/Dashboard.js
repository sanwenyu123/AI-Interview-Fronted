import React from 'react';
import { Row, Col, Card, Typography, Button, Space, Statistic, Progress } from 'antd';
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

const { Title, Text } = Typography;

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, interviewHistory } = useStore();

  // 模拟统计数据
  const stats = {
    totalInterviews: interviewHistory.length,
    completedInterviews: interviewHistory.filter(item => item.status === 'completed').length,
    averageScore: interviewHistory.length > 0 
      ? Math.round(interviewHistory.reduce((sum, item) => sum + (item.score || 0), 0) / interviewHistory.length)
      : 0,
    totalTime: interviewHistory.reduce((sum, item) => sum + (item.duration || 0), 0),
  };

  const recentInterviews = interviewHistory.slice(-3).reverse();

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
          欢迎回来，{user?.username || '用户'}！
        </Title>
        <Text type="secondary">
          准备好开始您的AI面试之旅了吗？
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
            <Title level={4} style={{ margin: '8px 0' }}>岗位设置</Title>
            <Text type="secondary">设置面试岗位和描述</Text>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            onClick={() => navigate('/text-interview')}
            style={{ textAlign: 'center', borderRadius: '12px' }}
            styles={{ body: { padding: '24px' } }}
          >
            <EditOutlined style={{ fontSize: '32px', color: '#52c41a', marginBottom: '12px' }} />
            <Title level={4} style={{ margin: '8px 0' }}>文字面试</Title>
            <Text type="secondary">通过文字进行面试练习</Text>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            onClick={() => navigate('/voice-interview')}
            style={{ textAlign: 'center', borderRadius: '12px' }}
            styles={{ body: { padding: '24px' } }}
          >
            <SoundOutlined style={{ fontSize: '32px', color: '#fa8c16', marginBottom: '12px' }} />
            <Title level={4} style={{ margin: '8px 0' }}>语音面试</Title>
            <Text type="secondary">真实语音对话面试</Text>
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
            <Title level={4} style={{ margin: '8px 0' }}>面试记录</Title>
            <Text type="secondary">查看历史面试记录</Text>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* 统计信息 */}
        <Col xs={24} lg={12}>
          <Card title="面试统计" style={{ borderRadius: '12px' }}>
            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="总面试次数"
                  value={stats.totalInterviews}
                  prefix={<UserOutlined />}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="完成次数"
                  value={stats.completedInterviews}
                  prefix={<TrophyOutlined />}
                />
              </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: '16px' }}>
              <Col span={12}>
                <Statistic
                  title="平均分数"
                  value={stats.averageScore}
                  suffix="/ 100"
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="总练习时间"
                  value={Math.round(stats.totalTime / 60)}
                  suffix="分钟"
                  prefix={<ClockCircleOutlined />}
                />
              </Col>
            </Row>
          </Card>
        </Col>

        {/* 最近面试记录 */}
        <Col xs={24} lg={12}>
          <Card title="最近面试" style={{ borderRadius: '12px' }}>
            {recentInterviews.length > 0 ? (
              <div>
                {recentInterviews.map((interview, index) => (
                  <div key={index} style={{ 
                    padding: '12px 0', 
                    borderBottom: index < recentInterviews.length - 1 ? '1px solid #f0f0f0' : 'none'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <Text strong>{interview.position || '未知岗位'}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {interview.date || '未知日期'}
                        </Text>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1890ff' }}>
                          {interview.score || 0}
                        </div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>分</Text>
                      </div>
                    </div>
                  </div>
                ))}
                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                  <Button type="link" onClick={() => navigate('/interview-history')}>
                    查看全部记录
                  </Button>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <Text type="secondary">还没有面试记录</Text>
                <br />
                <Button 
                  type="primary" 
                  onClick={() => navigate('/job-setup')}
                  style={{ marginTop: '16px' }}
                >
                  开始第一次面试
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
            icon={<EditOutlined />}
            onClick={() => navigate('/text-interview')}
            style={{ 
              background: 'rgba(255,255,255,0.2)', 
              border: '1px solid rgba(255,255,255,0.3)',
              color: 'white'
            }}
          >
            文字面试
          </Button>
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
