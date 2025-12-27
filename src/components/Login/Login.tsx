// src/components/Login/Login.tsx

import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import './Login.css';
import { useAuthContext } from '../../auth/AuthContext';

interface LoginProps {
  visible?: boolean;
  onClose?: () => void;
  onLoginSuccess?: () => void;
}

const Login: React.FC<LoginProps> = ({ visible = true, onClose, onLoginSuccess }) => {
  const navigate = useNavigate();
  const { login, isLoading: authLoading } = useAuthContext();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();

  // 检查是否是独立页面模式（通过路由访问）
  const isStandalonePage = !onClose;

  // 移除焦点，收起软键盘（移动端友好）
  const handleInputBlur = () => {
    (document.activeElement as HTMLElement)?.blur();
  };

  const handleLogin = async () => {
    if (!username.trim()) {
      setError('用户名不能为空');
      return;
    }
    if (!password.trim()) {
      setError('密码不能为空');
      return;
    }

    setError('');
    handleInputBlur();

    try {
      // 执行登录
      console.log('正在调用login方法，用户名:', username, '密码:', password);
      const success = await login({ username, password });
      console.log('login方法返回结果:', success);

      if (success) {
        console.log('登录成功，准备处理跳转');
        // 登录成功：先关闭模态框
        if (onClose) {
          onClose();
        }
        // 如果有登录成功回调，调用它
        if (onLoginSuccess) {
          console.log('调用登录成功回调');
          onLoginSuccess();
        }
        // 无论是否有回调，都执行跳转（双重保障）
        setTimeout(() => {
          const targetPath = '/admin';
          console.log('强制跳转到:', targetPath);
          navigate(targetPath, { replace: true });
        }, 300);
      } else {
        setError('用户名或密码错误');
      }
    } catch (err) {
      const errorMessage = err instanceof Error
        ? err.message
        : '登录失败，请检查您的凭据';
      setError(errorMessage);
      console.error('登录失败:', err);
    }
  };

  // 独立页面模式渲染
  if (isStandalonePage) {
    return (
      <div className="login-page-container">
        <div className="login-page-content">
          <div className="login-page-header">
            <h1 className="login-page-title">管理员登录</h1>
            <p className="login-page-subtitle">请输入您的用户名和密码</p>
          </div>
          <div className="login-content">
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                className="form-input"
                placeholder="请输入用户名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={authLoading}
                autoComplete="username"
                autoFocus
                aria-label="Username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                className="form-input"
                placeholder="请输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={authLoading}
                autoComplete="current-password"
                aria-label="Password"
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
                disabled={authLoading}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            <button
              type="button"
              className="forgot-password"
              onClick={() => alert('忘记密码? 请联系管理员')}
              disabled={authLoading}
            >
              忘记密码?
            </button>

            <div className="login-page-actions">
              <Button
                type="primary"
                onClick={() => {
                  console.log('登录按钮被点击，调用handleLogin函数');
                  handleLogin();
                }}
                loading={authLoading}
                disabled={authLoading}
                className="login-button"
              >
                登录
              </Button>
              <Button
                onClick={() => navigate('/')}
                disabled={authLoading}
                className="cancel-button"
              >
                取消
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 模态框模式渲染
  return (
    <Modal
      visible={visible}
      onCancel={() => {
        if (onClose) {
          onClose();
        } else {
          navigate(-1);
        }
      }}
      title="管理员登录"
      okText={authLoading ? "登录中..." : "登录"}
      cancelText="关闭"
      onOk={authLoading ? undefined : handleLogin}
      className="tiktok-login-modal"
      maskClosable={false}
      confirmLoading={authLoading}
    >
      <div className="login-content">
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            className="form-input"
            placeholder="请输入用户名"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={authLoading}
            autoComplete="username"
            autoFocus
            aria-label="Username"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            className="form-input"
            placeholder="请输入密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={authLoading}
            autoComplete="current-password"
            aria-label="Password"
          />
          <button
            type="button"
            className="toggle-password-btn"
            onClick={() => setShowPassword(!showPassword)}
            disabled={authLoading}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        <button
          type="button"
          className="forgot-password"
          onClick={() => alert('忘记密码? 请联系管理员')}
          disabled={authLoading}
        >
          忘记密码?
        </button>

        {/* 登录按钮 */}
        <div className="login-modal-actions" style={{ marginTop: 24 }}>
          <Button
            type="primary"
            onClick={handleLogin}
            loading={authLoading}
            disabled={authLoading}
            style={{ width: '100%' }}
          >
            登录
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default Login;