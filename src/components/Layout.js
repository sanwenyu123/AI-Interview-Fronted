import React, { useState } from 'react';
import { Layout as AntLayout, Menu, Avatar, Dropdown, Button, Space, Select } from 'antd';
import { 
  HomeOutlined, 
  SettingOutlined, 
  UserOutlined, 
  LogoutOutlined,
  MenuOutlined,
  HistoryOutlined,
  SoundOutlined,
  EditOutlined,
  GlobalOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import useStore from '../store/useStore';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../utils/i18n';

const { Header, Sider, Content } = AntLayout;

const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useStore();
  const { language, changeLanguage } = useLanguage();

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: t('nav.dashboard', language),
    },
    {
      key: '/job-setup',
      icon: <EditOutlined />,
      label: t('nav.jobSetup', language),
    },
    // 已禁用文字面试入口
    {
      key: '/voice-interview',
      icon: <SoundOutlined />,
      label: t('nav.voiceInterview', language),
    },
    {
      key: '/interview-history',
      icon: <HistoryOutlined />,
      label: t('nav.interviewHistory', language),
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: t('nav.settings', language),
    },
  ];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: () => {
        logout();
        navigate('/login');
      },
    },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        style={{
          background: '#fff',
          boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ 
          height: 64, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <h2 style={{ 
            color: '#1890ff', 
            margin: 0,
            fontSize: collapsed ? '16px' : '20px',
            transition: 'all 0.2s'
          }}>
            {collapsed ? t('app.shortTitle', language) : t('app.title', language)}
          </h2>
        </div>
        
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ border: 'none' }}
        />
      </Sider>
      
      <AntLayout>
        <Header style={{ 
          padding: '0 24px', 
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px' }}
          />
          
          <Space>
            {/* 语言切换器 */}
            <Select
              value={language}
              onChange={changeLanguage}
              style={{ width: 120 }}
              size="small"
              suffixIcon={<GlobalOutlined />}
              options={[
                { value: 'zh-CN', label: t('language.zh-CN', language) },
                { value: 'en-US', label: t('language.en-US', language) },
                { value: 'ja-JP', label: t('language.ja-JP', language) },
                { value: 'ko-KR', label: t('language.ko-KR', language) },
              ]}
            />
            <span style={{ color: '#666' }}>
              {language === 'en-US' ? `Welcome, ${user?.username || 'User'}` :
               language === 'ja-JP' ? `ようこそ、${user?.username || 'ユーザー'}さん` :
               language === 'ko-KR' ? `환영합니다, ${user?.username || '사용자'}님` :
               `欢迎，${user?.username || '用户'}`}
            </span>
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              arrow
            >
              <Avatar 
                style={{ 
                  backgroundColor: '#1890ff',
                  cursor: 'pointer'
                }}
                icon={<UserOutlined />}
              />
            </Dropdown>
          </Space>
        </Header>
        
        <Content style={{ 
          margin: '24px',
          padding: '24px',
          background: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          minHeight: 'calc(100vh - 112px)',
        }}>
          {children}
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;
