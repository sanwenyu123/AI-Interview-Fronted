import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Typography, 
  Space, 
  Row, 
  Col,
  Progress,
  Button,
  Divider,
  List,
  Tag,
  Statistic,
  Rate,
  Timeline
} from 'antd';
import { 
  TrophyOutlined, 
  ClockCircleOutlined, 
  CheckCircleOutlined,
  StarOutlined,
  MessageOutlined,
  ReloadOutlined,
  HomeOutlined,
  HistoryOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import useStore from '../store/useStore';

const { Title, Text, Paragraph } = Typography;

const InterviewResult = () => {
  const [interviewRecord, setInterviewRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { addInterviewRecord } = useStore();

  useEffect(() => {
    if (location.state?.record) {
      setInterviewRecord(location.state.record);
      setLoading(false);
    } else {
      // 如果没有记录，跳转到首页
      navigate('/');
    }
  }, [location.state, navigate]);

  const getScoreColor = (score) => {
    if (score >= 90) return '#52c41a';
    if (score >= 80) return '#1890ff';
    if (score >= 70) return '#fa8c16';
    return '#ff4d4f';
  };

  const getScoreLevel = (score) => {
    if (score >= 90) return '优秀';
    if (score >= 80) return '良好';
    if (score >= 70) return '一般';
    return '需要改进';
  };

  const getScoreDescription = (score) => {
    if (score >= 90) return '您的表现非常出色，展现了扎实的专业能力和良好的沟通技巧。';
    if (score >= 80) return '您的表现良好，在大部分方面都做得不错，还有提升空间。';
    if (score >= 70) return '您的表现一般，建议在专业知识和表达能力方面继续提升。';
    return '建议您加强专业知识学习，提高表达能力和面试技巧。';
  };

  // 模拟评价详情
  const evaluationDetails = [
    {
      category: '专业知识',
      score: Math.floor(interviewRecord?.score * 0.3 + Math.random() * 20) || 85,
      comment: '对相关技术有较好的理解，能够回答大部分专业问题。'
    },
    {
      category: '表达能力',
      score: Math.floor(interviewRecord?.score * 0.25 + Math.random() * 20) || 80,
      comment: '表达清晰，逻辑性强，能够有效传达自己的想法。'
    },
    {
      category: '项目经验',
      score: Math.floor(interviewRecord?.score * 0.25 + Math.random() * 20) || 88,
      comment: '有丰富的项目经验，能够详细描述项目细节和技术难点。'
    },
    {
      category: '学习能力',
      score: Math.floor(interviewRecord?.score * 0.2 + Math.random() * 20) || 82,
      comment: '展现出良好的学习能力和对新技术的敏感度。'
    }
  ];

  // 模拟改进建议
  const suggestions = [
    '建议深入学习最新的技术框架和工具',
    '可以多参与开源项目，积累实战经验',
    '加强系统设计能力的培养',
    '提高英语水平，关注国际技术动态',
    '多练习技术演讲和表达技巧'
  ];

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}分${secs}秒`;
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div>加载中...</div>
      </div>
    );
  }

  if (!interviewRecord) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div>未找到面试记录</div>
        <Button type="primary" onClick={() => navigate('/')}>
          返回首页
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
          <TrophyOutlined style={{ marginRight: '8px' }} />
          面试结果
        </Title>
        <Text type="secondary">
          查看您的面试表现和详细评价
        </Text>
      </div>

      {/* 总体评分卡片 */}
      <Card style={{ marginBottom: '24px', borderRadius: '12px' }}>
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} md={8} style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '72px', 
              fontWeight: 'bold',
              color: getScoreColor(interviewRecord.score),
              lineHeight: 1
            }}>
              {interviewRecord.score}
            </div>
            <Title level={3} style={{ margin: '8px 0', color: getScoreColor(interviewRecord.score) }}>
              {getScoreLevel(interviewRecord.score)}
            </Title>
            <Text type="secondary">
              {getScoreDescription(interviewRecord.score)}
            </Text>
          </Col>
          
          <Col xs={24} md={16}>
            <Row gutter={[16, 16]}>
              <Col xs={12} sm={6}>
                <Statistic
                  title="面试时长"
                  value={formatTime(interviewRecord.duration)}
                  prefix={<ClockCircleOutlined />}
                />
              </Col>
              <Col xs={12} sm={6}>
                <Statistic
                  title="回答问题"
                  value={interviewRecord.questions}
                  suffix="/ 8"
                  prefix={<CheckCircleOutlined />}
                />
              </Col>
              <Col xs={12} sm={6}>
                <Statistic
                  title="面试类型"
                  value={'语音面试'}
                />
              </Col>
              <Col xs={12} sm={6}>
                <Statistic
                  title="面试岗位"
                  value={interviewRecord.position}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]}>
        {/* 详细评价 */}
        <Col xs={24} lg={12}>
          <Card title="详细评价" style={{ borderRadius: '12px' }}>
            <List
              dataSource={evaluationDetails}
              renderItem={(item) => (
                <List.Item>
                  <div style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <Text strong>{item.category}</Text>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Progress 
                          percent={item.score} 
                          size="small" 
                          strokeColor={getScoreColor(item.score)}
                          style={{ width: '100px' }}
                        />
                        <Text strong style={{ color: getScoreColor(item.score) }}>
                          {item.score}分
                        </Text>
                      </div>
                    </div>
                    <Text type="secondary" style={{ fontSize: '14px' }}>
                      {item.comment}
                    </Text>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 改进建议 */}
        <Col xs={24} lg={12}>
          <Card title="改进建议" style={{ borderRadius: '12px' }}>
            <List
              dataSource={suggestions}
              renderItem={(suggestion, index) => (
                <List.Item>
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Tag color="blue" style={{ marginRight: '8px', marginTop: '2px' }}>
                      {index + 1}
                    </Tag>
                    <Text>{suggestion}</Text>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* 面试时间线 */}
      <Card title="面试过程" style={{ marginTop: '16px', borderRadius: '12px' }}>
        <Timeline>
          <Timeline.Item color="green">
            <Text strong>面试开始</Text>
            <br />
            <Text type="secondary">开始{interviewRecord.position}的{interviewRecord.type === 'text' ? '文字' : '语音'}面试</Text>
          </Timeline.Item>
          <Timeline.Item color="blue">
            <Text strong>问题回答</Text>
            <br />
            <Text type="secondary">共回答了{interviewRecord.questions}个问题</Text>
          </Timeline.Item>
          <Timeline.Item color="orange">
            <Text strong>面试结束</Text>
            <br />
            <Text type="secondary">面试时长：{formatTime(interviewRecord.duration)}</Text>
          </Timeline.Item>
          <Timeline.Item color="red">
            <Text strong>结果评估</Text>
            <br />
            <Text type="secondary">最终得分：{interviewRecord.score}分</Text>
          </Timeline.Item>
        </Timeline>
      </Card>

      {/* 操作按钮 */}
      <Card style={{ marginTop: '16px', borderRadius: '12px' }}>
        <div style={{ textAlign: 'center' }}>
          <Space size="large">
            <Button 
              type="primary" 
              size="large"
              icon={<ReloadOutlined />}
              onClick={() => navigate('/job-setup')}
              style={{ borderRadius: '8px' }}
            >
              重新面试
            </Button>
            <Button 
              size="large"
              icon={<HistoryOutlined />}
              onClick={() => navigate('/interview-history')}
              style={{ borderRadius: '8px' }}
            >
              查看历史
            </Button>
            <Button 
              size="large"
              icon={<HomeOutlined />}
              onClick={() => navigate('/')}
              style={{ borderRadius: '8px' }}
            >
              返回首页
            </Button>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default InterviewResult;
