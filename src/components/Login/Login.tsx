// src/components/Login/Login.tsx

import React, { useState, useEffect } from 'react';
import { Dialog as Modal, Button } from 'react-vant';
import './Login.css';

// 假设你有 authApiService，这里提供一个 mock 接口
interface LoginCredentials {
  username: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: { id: string; username: string };
}

// 如果你没有真实服务，可以用下面这个 mock 替代
// const authApiService = {
//   login: async ({ username, password }: LoginCredentials): Promise<AuthResponse> => {
//     if (username === 'test' && password === '123456') {
//       return { token: 'fake-jwt-token', user: { id: '1', username } };
//     }
//     throw new Error('Invalid username or password');
//   }
// };

// 如果你有自己的 authApiService，请保留导入
// import { authApiService } from '../../auth';

// 为演示，我们定义一个 mock 服务（实际项目中替换为真实导入）
const authApiService = {
  login: async ({ username, password }: LoginCredentials): Promise<AuthResponse> => {
    // 模拟网络延迟
    await new Promise((resolve) => setTimeout(resolve, 800));
    if (username.trim() && password.trim()) {
      return { token: 'mock-token', user: { id: '1', username } };
    }
    throw new Error('Username and password are required');
  }
};

interface LoginProps {
  onClose: () => void;
  onLoginSuccess?: () => void;
}

const Login: React.FC<LoginProps> = ({ onClose, onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // ESC 键关闭
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleLogin = async () => {
    if (!username.trim()) {
      setError('Username is required');
      return;
    }
    if (!password.trim()) {
      setError('Password is required');
      return;
    }

    setLoading(true);
    setError('');

    // 移除焦点，收起软键盘（移动端友好）
    (document.activeElement as HTMLElement)?.blur();

    try {
      const response = await authApiService.login({ username, password });
      console.log('Login successful:', response);

      if (onLoginSuccess) onLoginSuccess();
      
      // 短暂延迟后关闭，让用户看到成功状态（可选）
      setTimeout(onClose, 500);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Login failed. Please check your credentials.';
      setError(errorMessage);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={true}
      onClose={onClose}
      title="Sign in to TikTok"
      showCancelButton
      confirmButtonText={loading ? "Signing in..." : "Sign in"}
      cancelButtonText="Close"
      onCancel={onClose}
      onConfirm={loading ? undefined : handleLogin}
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
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
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
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            autoComplete="current-password"
            aria-label="Password"
          />
          <button
            type="button"
            className="toggle-password-btn"
            onClick={() => setShowPassword(!showPassword)}
            disabled={loading}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        <button
          type="button"
          className="forgot-password"
          onClick={() => alert('Forgot password? Contact support.')}
          disabled={loading}
        >
          Forgot password?
        </button>
      </div>
    </Modal>
  );
};

export default Login;