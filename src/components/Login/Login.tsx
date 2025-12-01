// src/components/Login/Login.tsx

import React, { useState, useEffect } from 'react';
import { Dialog as Modal, Button } from 'react-vant';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { useAuthContext } from '../../auth/AuthContext';

interface LoginProps {
  visible?: boolean;
  onClose?: () => void;
}

const Login: React.FC<LoginProps> = ({ visible = true, onClose }) => {
  const navigate = useNavigate();
  const { login, isLoading: authLoading } = useAuthContext();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // ESC 键关闭
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (onClose) {
          onClose();
        } else {
          // 如果没有onClose，返回到上一页
          navigate(-1);
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, navigate]);

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

    // 移除焦点，收起软键盘（移动端友好）
    (document.activeElement as HTMLElement)?.blur();

    try {
      // 执行登录
      const success = await login({ username, password });

      if (success) {
        // 登录成功：先关闭模态框，再跳转到 admin 页面
        if (onClose) {
          onClose();
        }
        // 延迟跳转，确保模态框先关闭
        setTimeout(() => {
          navigate('/admin', { replace: true });
        }, 100);
      } else {
        setError('用户名或密码错误');
      }
    } catch (err) {
      const errorMessage = err instanceof Error
        ? err.message
        : '登录失败，请检查您的凭据';
      setError(errorMessage);
    }
  }; return (
    <Modal
      visible={visible}
      onClose={() => {
        if (onClose) {
          onClose();
        } else {
          navigate(-1);
        }
      }}
      title="管理员登录"
      showCancelButton
      confirmButtonText={authLoading ? "登录中..." : "登录"}
      cancelButtonText="关闭"
      onCancel={() => {
        if (onClose) {
          onClose();
        } else {
          navigate(-1);
        }
      }}
      onConfirm={authLoading ? undefined : handleLogin}
      className="tiktok-login-modal"
      closeOnClickOverlay={false}
      // 禁用默认确认按钮颜色逻辑，由 CSS 控制
      confirmButtonColor=""
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
      </div>
    </Modal>
  );
};

export default Login;