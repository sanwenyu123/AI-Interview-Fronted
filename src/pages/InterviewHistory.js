import React, { useState } from 'react';
import { 
  Card, 
  Typography, 
  Space, 
  Row, 
  Col,
  Button,
  Tag,
  Statistic,
  Progress,
  Empty,
  Modal,
  List,
  Timeline
} from 'antd';
import { 
  HistoryOutlined, 
  EyeOutlined, 
  DeleteOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  SoundOutlined,
  EditOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';

const { Title, Text } = Typography;

const InterviewHistory = () => {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const navigate = useNavigate();
  const { interviewHistory, clearInterviewHistory } = useStore();

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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}分${secs}秒`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('zh-CN');
  };

  const handleViewDetail = (record) => {
    setSelectedRecord(record);
    setShowDetailModal(true);
  };

  const handleDeleteHistory = () => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要清空所有面试记录吗？此操作不可恢复。',
      onOk: () => {
        clearInterviewHistory();
      },
    });
  };

  const handleStartNewInterview = () => {
    navigate('/job-setup');
  };

  // 统计数据
  const stats = {
    total: interviewHistory.length,
    completed: interviewHistory.filter(item => item.status === 'completed').length,
    averageScore: interviewHistory.length > 0 
      ? Math.round(interviewHistory.reduce((sum, item) => sum + (item.score || 0), 0) / interviewHistory.length)
      : 0,
    totalTime: interviewHistory.reduce((sum, item) => sum + (item.duration || 0), 0),
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
          <HistoryOutlined style={{ marginRight: '8px' }} />
          面试记录
        </Title>
        <Text type="secondary">
          查看您的所有面试记录和表现统计
        </Text>
      </div>

      {/* 统计信息 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={12} sm={6}>
          <Card style={{ borderRadius: '12px', textAlign: 'center' }}>
            <Statistic
              title="总面试次数"
              value={stats.total}
              prefix={<HistoryOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ borderRadius: '12px', textAlign: 'center' }}>
            <Statistic
              title="完成次数"
              value={stats.completed}
              prefix={<TrophyOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ borderRadius: '12px', textAlign: 'center' }}>
            <Statistic
              title="平均分数"
              value={stats.averageScore}
              suffix="/ 100"
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ borderRadius: '12px', textAlign: 'center' }}>
            <Statistic
              title="总练习时间"
              value={Math.round(stats.totalTime / 60)}
              suffix="分钟"
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* 面试记录列表 */}
      {interviewHistory.length > 0 ? (
        <Row gutter={[16, 16]}>
          {interviewHistory.map((record, index) => (
            <Col xs={24} lg={12} xl={8} key={record.id}>
              <Card
                hoverable
                style={{ borderRadius: '12px' }}
                actions={[
                  <Button 
                    type="link" 
                    icon={<EyeOutlined />}
                    onClick={() => handleViewDetail(record)}
                  >
                    查看详情
                  </Button>
                ]}
              >
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <Title level={5} style={{ margin: 0 }}>
                      {record.position}
                    </Title>
                    <Tag color={record.type === 'text' ? 'blue' : 'green'}>
                      {record.type === 'text' ? '文字面试' : '语音面试'}
                    </Tag>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <CalendarOutlined style={{ marginRight: '4px', color: '#666' }} />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {formatDate(record.date)}
                    </Text>
                  </div>
                </div>

                <Row gutter={8}>
                  <Col span={8}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ 
                        fontSize: '24px', 
                        fontWeight: 'bold',
                        color: getScoreColor(record.score)
                      }}>
                        {record.score}
                      </div>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {getScoreLevel(record.score)}
                      </Text>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                        {record.questions}
                      </div>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        问题数
                      </Text>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                        {formatTime(record.duration)}
                      </div>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        时长
                      </Text>
                    </div>
                  </Col>
                </Row>

                <div style={{ marginTop: '12px' }}>
                  <Progress 
                    percent={record.score} 
                    size="small" 
                    strokeColor={getScoreColor(record.score)}
                    showInfo={false}
                  />
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Card style={{ borderRadius: '12px' }}>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="还没有面试记录"
          >
            <Button type="primary" onClick={handleStartNewInterview}>
              开始第一次面试
            </Button>
          </Empty>
        </Card>
      )}

      {/* 操作按钮 */}
      {interviewHistory.length > 0 && (
        <Card style={{ marginTop: '16px', borderRadius: '12px' }}>
          <div style={{ textAlign: 'center' }}>
            <Space>
              <Button 
                type="primary"
                onClick={handleStartNewInterview}
                style={{ borderRadius: '8px' }}
              >
                开始新面试
              </Button>
              <Button 
                danger
                icon={<DeleteOutlined />}
                onClick={handleDeleteHistory}
                style={{ borderRadius: '8px' }}
              >
                清空记录
              </Button>
            </Space>
          </div>
        </Card>
      )}

      {/* 详情模态框 */}
      <Modal
        title="面试详情"
        open={showDetailModal}
        onCancel={() => setShowDetailModal(false)}
        footer={[
          <Button key="close" onClick={() => setShowDetailModal(false)}>
            关闭
          </Button>
        ]}
        width={800}
      >
        {selectedRecord && (
          <div>
            <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
              <Col span={12}>
                <Statistic
                  title="面试岗位"
                  value={selectedRecord.position}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="面试类型"
                  value={selectedRecord.type === 'text' ? '文字面试' : '语音面试'}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="面试时长"
                  value={formatTime(selectedRecord.duration)}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="回答问题"
                  value={selectedRecord.questions}
                />
              </Col>
            </Row>

            <div style={{ textAlign: 'center', margin: '24px 0' }}>
              <div style={{ 
                fontSize: '48px', 
                fontWeight: 'bold',
                color: getScoreColor(selectedRecord.score),
                marginBottom: '8px'
              }}>
                {selectedRecord.score}
              </div>
              <Title level={3} style={{ color: getScoreColor(selectedRecord.score) }}>
                {getScoreLevel(selectedRecord.score)}
              </Title>
            </div>

            {selectedRecord.messages && (
              <div>
                <Title level={5}>对话记录</Title>
                <div style={{ 
                  maxHeight: '300px', 
                  overflowY: 'auto',
                  border: '1px solid #f0f0f0',
                  borderRadius: '8px',
                  padding: '12px'
                }}>
                  {selectedRecord.messages.map((message, index) => (
                    <div key={index} style={{ marginBottom: '8px' }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        marginBottom: '4px'
                      }}>
                        {message.type === 'ai' ? (
                          <SoundOutlined style={{ marginRight: '4px', color: '#1890ff' }} />
                        ) : (
                          <EditOutlined style={{ marginRight: '4px', color: '#52c41a' }} />
                        )}
                        <Text strong style={{ fontSize: '12px' }}>
                          {message.type === 'ai' ? 'AI面试官' : '您'}
                        </Text>
                      </div>
                      <Text style={{ fontSize: '14px' }}>
                        {message.content}
                      </Text>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default InterviewHistory;
