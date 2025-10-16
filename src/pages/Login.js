import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Space, Modal } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import authService from '../services/authService';

const { Title, Text } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorDetails, setErrorDetails] = useState('');
  const navigate = useNavigate();
  const { setUser } = useStore();

  const onFinish = async (values) => {
    setLoading(true);

    try {
      // 调用登录 API
      const response = await authService.login({
        username: values.username,
        password: values.password,
      });

      // 设置用户信息到全局状态
      setUser(response.user);

      setLoading(false);
      message.success('登录成功！');
      navigate('/');
    } catch (error) {

      // 获取错误信息
      let errorMsg = '登录失败，请重试';
      let details = '';

      if (error.response?.data?.detail) {
        errorMsg = error.response.data.detail;
      } else if (error.response?.status === 401) {
        errorMsg = '用户名或密码错误';
      } else if (error.response?.status === 404) {
        errorMsg = '服务器连接失败，请检查后端服务是否启动';
      } else if (error.message) {
        errorMsg = error.message;
      }

      // 设置错误信息并显示 Modal
      setErrorMessage(errorMsg);
      setLoading(false);
      setErrorModalVisible(true);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
    }}>
      <Card
        style={{
          width: '100%',
          maxWidth: 400,
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        }}
        styles={{ body: { padding: '40px' } }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <LoginOutlined style={{ fontSize: '32px', color: 'white' }} />
          </div>
          <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
            AI面试助手
          </Title>
          <Text type="secondary">
            智能面试，助力职场成功
          </Text>
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="new-password"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: '请输入用户名!' },
              { min: 3, message: '用户名至少3个字符!' }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名"
              style={{ borderRadius: '8px' }}
              autoComplete="off"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码!' },
              { min: 6, message: '密码至少6个字符!' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              style={{ borderRadius: '8px' }}
              autoComplete="new-password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{
                height: '48px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                fontSize: '16px',
                fontWeight: 'bold',
              }}
            >
              {loading ? '登录中...' : '登录'}
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Space>
            <Text type="secondary">还没有账号？</Text>
            <Link to="/register" style={{ color: '#1890ff', fontWeight: 'bold' }}>
              立即注册
            </Link>
          </Space>
        </div>

      </Card>

      {/* 错误提示 Modal */}
      <Modal
        title={
          <span style={{ color: '#ff4d4f' }}>
            <ExclamationCircleOutlined style={{ marginRight: 8 }} />
            登录失败
          </span>
        }
        open={errorModalVisible}
        onOk={() => {
          setErrorModalVisible(false);
          setLoading(false);
        }}
        onCancel={() => {
          setErrorModalVisible(false);
          setLoading(false);
        }}
        okText="我知道了"
        cancelButtonProps={{ style: { display: 'none' } }}
        maskClosable={false}
        keyboard={false}
        centered
        width={500}
        zIndex={99999}
      >
        <div style={{ padding: '20px 0' }}>
          <p style={{
            fontSize: '18px',
            marginBottom: '16px',
            color: '#ff4d4f',
            fontWeight: 500
          }}>
            {errorMessage}
          </p>
          {errorDetails && (
            <div style={{
              marginTop: '16px',
              padding: '12px',
              background: '#f5f5f5',
              borderRadius: '6px',
              fontSize: '13px',
              color: '#666'
            }}>
              <div style={{ whiteSpace: 'pre-line', marginBottom: '8px' }}>
                {errorDetails}
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Login;
