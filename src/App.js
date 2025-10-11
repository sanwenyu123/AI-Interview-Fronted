import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import useStore from './store/useStore';

// 页面组件
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import JobSetup from './pages/JobSetup';
import TextInterview from './pages/TextInterview';
import VoiceInterview from './pages/VoiceInterview';
import InterviewResult from './pages/InterviewResult';
import InterviewHistory from './pages/InterviewHistory';

// 布局组件
import Layout from './components/Layout';

// 受保护的路由组件
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <div className="App">
          <Routes>
            {/* 公开路由 */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* 受保护的路由 */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/settings" element={
              <ProtectedRoute>
                <Layout>
                  <Settings />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/job-setup" element={
              <ProtectedRoute>
                <Layout>
                  <JobSetup />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/text-interview" element={
              <ProtectedRoute>
                <Layout>
                  <TextInterview />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/voice-interview" element={
              <ProtectedRoute>
                <Layout>
                  <VoiceInterview />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/interview-result" element={
              <ProtectedRoute>
                <Layout>
                  <InterviewResult />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/interview-history" element={
              <ProtectedRoute>
                <Layout>
                  <InterviewHistory />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* 默认重定向 */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </ConfigProvider>
  );
}

export default App;
