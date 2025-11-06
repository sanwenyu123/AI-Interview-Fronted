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
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../utils/i18n';
import SEOHead from '../components/SEOHead';

const { Title, Text } = Typography;

const InterviewHistory = () => {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const navigate = useNavigate();
  const { interviewHistory, clearInterviewHistory } = useStore();
  const { language } = useLanguage();

  const getScoreColor = (score) => {
    if (score >= 90) return '#52c41a';
    if (score >= 80) return '#1890ff';
    if (score >= 70) return '#fa8c16';
    return '#ff4d4f';
  };

  const getScoreLevel = (score) => {
    if (score >= 90) return language === 'en-US' ? 'Excellent' :
                            language === 'ja-JP' ? '優秀' :
                            language === 'ko-KR' ? '우수' :
                            '优秀';
    if (score >= 80) return language === 'en-US' ? 'Good' :
                            language === 'ja-JP' ? '良好' :
                            language === 'ko-KR' ? '양호' :
                            '良好';
    if (score >= 70) return language === 'en-US' ? 'Fair' :
                            language === 'ja-JP' ? '普通' :
                            language === 'ko-KR' ? '보통' :
                            '一般';
    return language === 'en-US' ? 'Needs Improvement' :
           language === 'ja-JP' ? '改善が必要' :
           language === 'ko-KR' ? '개선 필요' :
           '需要改进';
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (language === 'en-US') return `${mins}m ${secs}s`;
    if (language === 'ja-JP') return `${mins}分${secs}秒`;
    if (language === 'ko-KR') return `${mins}분 ${secs}초`;
    return `${mins}分${secs}秒`;
  };

  const formatDate = (dateString) => {
    const locale = language === 'en-US' ? 'en-US' :
                   language === 'ja-JP' ? 'ja-JP' :
                   language === 'ko-KR' ? 'ko-KR' :
                   'zh-CN';
    return new Date(dateString).toLocaleString(locale);
  };

  const handleViewDetail = (record) => {
    setSelectedRecord(record);
    setShowDetailModal(true);
  };

  const handleDeleteHistory = () => {
    Modal.confirm({
      title: language === 'en-US' ? 'Confirm Delete' :
             language === 'ja-JP' ? '削除確認' :
             language === 'ko-KR' ? '삭제 확인' :
             '确认删除',
      content: language === 'en-US' ? 'Are you sure you want to clear all interview records? This action cannot be undone.' :
               language === 'ja-JP' ? 'すべての面接記録を削除してもよろしいですか？この操作は元に戻せません。' :
               language === 'ko-KR' ? '모든 면접 기록을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.' :
               '确定要清空所有面试记录吗？此操作不可恢复。',
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
      <SEOHead 
        title={t('history.title', language)}
        description={language === 'en-US' ? 'View all your interview records and performance statistics' :
                     language === 'ja-JP' ? 'すべての面接記録とパフォーマンス統計を確認' :
                     language === 'ko-KR' ? '모든 면접 기록과 성과 통계 확인' :
                     '查看您的所有面试记录和表现统计'}
      />
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
          <HistoryOutlined style={{ marginRight: '8px' }} />
          {t('history.title', language)}
        </Title>
        <Text type="secondary">
          {language === 'en-US' ? 'View all your interview records and performance statistics' :
           language === 'ja-JP' ? 'すべての面接記録とパフォーマンス統計を確認' :
           language === 'ko-KR' ? '모든 면접 기록과 성과 통계 확인' :
           '查看您的所有面试记录和表现统计'}
        </Text>
      </div>

      {/* 统计信息 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={12} sm={6}>
          <Card style={{ borderRadius: '12px', textAlign: 'center' }}>
            <Statistic
              title={t('history.totalInterviews', language)}
              value={stats.total}
              prefix={<HistoryOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ borderRadius: '12px', textAlign: 'center' }}>
            <Statistic
              title={language === 'en-US' ? 'Completed' :
                     language === 'ja-JP' ? '完了回数' :
                     language === 'ko-KR' ? '완료 횟수' :
                     '完成次数'}
              value={stats.completed}
              prefix={<TrophyOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ borderRadius: '12px', textAlign: 'center' }}>
            <Statistic
              title={t('history.averageScore', language)}
              value={stats.averageScore}
              suffix="/ 100"
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ borderRadius: '12px', textAlign: 'center' }}>
            <Statistic
              title={language === 'en-US' ? 'Total Practice Time' :
                     language === 'ja-JP' ? '総練習時間' :
                     language === 'ko-KR' ? '총 연습 시간' :
                     '总练习时间'}
              value={Math.round(stats.totalTime / 60)}
              suffix={language === 'en-US' ? 'min' : language === 'ja-JP' ? '分' : language === 'ko-KR' ? '분' : '分钟'}
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
                    {t('history.viewDetails', language)}
                  </Button>
                ]}
              >
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <Title level={5} style={{ margin: 0 }}>
                      {record.position}
                    </Title>
                    <Tag color={'green'}>
                      {t('history.voiceInterview', language)}
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
                        {language === 'en-US' ? 'Questions' :
                         language === 'ja-JP' ? '質問数' :
                         language === 'ko-KR' ? '질문 수' :
                         '问题数'}
                      </Text>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                        {formatTime(record.duration)}
                      </div>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {t('history.duration', language)}
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
            description={t('history.noRecords', language)}
          >
            <Button type="primary" onClick={handleStartNewInterview}>
              {language === 'en-US' ? 'Start First Interview' :
               language === 'ja-JP' ? '最初の面接を開始' :
               language === 'ko-KR' ? '첫 번째 면접 시작' :
               '开始第一次面试'}
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
                {language === 'en-US' ? 'Start New Interview' :
                 language === 'ja-JP' ? '新しい面接を開始' :
                 language === 'ko-KR' ? '새 면접 시작' :
                 '开始新面试'}
              </Button>
              <Button 
                danger
                icon={<DeleteOutlined />}
                onClick={handleDeleteHistory}
                style={{ borderRadius: '8px' }}
              >
                {language === 'en-US' ? 'Clear Records' :
                 language === 'ja-JP' ? '記録をクリア' :
                 language === 'ko-KR' ? '기록 삭제' :
                 '清空记录'}
              </Button>
            </Space>
          </div>
        </Card>
      )}

      {/* 详情模态框 */}
      <Modal
        title={language === 'en-US' ? 'Interview Details' :
               language === 'ja-JP' ? '面接詳細' :
               language === 'ko-KR' ? '면접 세부사항' :
               '面试详情'}
        open={showDetailModal}
        onCancel={() => setShowDetailModal(false)}
        footer={[
          <Button key="close" onClick={() => setShowDetailModal(false)}>
            {language === 'en-US' ? 'Close' :
             language === 'ja-JP' ? '閉じる' :
             language === 'ko-KR' ? '닫기' :
             '关闭'}
          </Button>
        ]}
        width={800}
      >
        {selectedRecord && (
          <div>
            <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
              <Col span={12}>
                <Statistic
                  title={t('history.jobTitle', language)}
                  value={selectedRecord.position}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title={t('history.interviewType', language)}
                  value={t('history.voiceInterview', language)}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title={language === 'en-US' ? 'Interview Duration' :
                         language === 'ja-JP' ? '面接時間' :
                         language === 'ko-KR' ? '면접 시간' :
                         '面试时长'}
                  value={formatTime(selectedRecord.duration)}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title={language === 'en-US' ? 'Questions Answered' :
                         language === 'ja-JP' ? '回答した質問' :
                         language === 'ko-KR' ? '답변한 질문' :
                         '回答问题'}
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
