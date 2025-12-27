import React, { useState, useEffect } from 'react';
import { Input, message, Space, Badge, Button } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../auth/AuthContext';
import Login from '../Login/Login';
import './Header.css';

const { Search } = Input;

interface User {
  fullName?: string;
  roles?: string[];
  avatar?: string;
}

interface HeaderProps {
  user?: User;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  const [value, setValue] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user: authUser } = useAuthContext();

  // 调试：打印登录状态
  useEffect(() => {
    console.log('Header - 当前登录状态:', isAuthenticated);
    console.log('Header - 当前用户:', authUser);
  }, [isAuthenticated, authUser]);

  // 当登录状态变为已登录时，自动关闭登录弹窗并跳转到 admin 页面
  useEffect(() => {
    if (isAuthenticated && showLoginModal) {
      console.log('登录成功，准备跳转到 admin 页面');
      setShowLoginModal(false);
      // 延迟跳转，确保状态更新完成
      setTimeout(() => {
        const currentPath = location.pathname;
        if (currentPath !== '/admin' && currentPath !== '/admin/dashboard') {
          console.log('跳转到 /admin 页面');
          navigate('/admin', { replace: true });
        }
      }, 200);
    }
  }, [isAuthenticated, showLoginModal, navigate, location.pathname]);

  const handleAvatarClick = () => {
    navigate('/setting');
  };

  // 处理登录按钮点击
  const handleLoginClick = () => {
    console.log('登录按钮被点击，当前登录状态:', isAuthenticated);
    // 如果已经登录，直接跳转到 admin 页面
    if (isAuthenticated) {
      console.log('已登录，跳转到 admin 页面');
      navigate('/admin', { replace: true });
      return;
    }
    // 未登录时打开登录弹窗
    console.log('未登录，打开登录弹窗');
    setShowLoginModal(true);
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
  };

  // 处理登录成功回调
  const handleLoginSuccess = () => {
    console.log('登录成功回调被调用');
    setShowLoginModal(false);
    // 延迟跳转，确保状态更新完成
    setTimeout(() => {
      console.log('从 Header 组件跳转到 /admin');
      navigate('/admin', { replace: true });
    }, 100);
  };

  // // ✨ 在 admin 页面隐藏 Header
  // if (location.pathname.startsWith('/admin')) {
  //   return null;
  // }

  return (
    <>
      <header className="header">
        <div className='header-left'>
          <img src="/images/png/petSystem.png" alt="petSystem" />
          <h1 className="header-title">宠物行业管理系统</h1>
        </div>
        <div className='header-right'>
          <Search
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="请输入搜索关键词"
            onSearch={(val) => {
              message.info(val);
              setValue(val);
            }}
            allowClear
            onPressEnter={() => {
              message.info(value);
            }}
          />
          <Space className='demo-icon' size={20}>
            <Badge dot>
              <MessageOutlined />
            </Badge>
          </Space>
          {/* 如果未登录，显示登录按钮 */}
          {!isAuthenticated && (
            <Button
              type="primary"
              onClick={handleLoginClick}
              className="header-login-btn"
            >
              登录
            </Button>
          )}
          {/* 如果已登录，显示用户头像 */}
          {isAuthenticated && (
            <img
              src="/images/png/admin.png"
              alt="管理员头像"
              className="header-avatar"
              onClick={handleAvatarClick}
              style={{ cursor: 'pointer' }}
            />
          )}
        </div>
      </header>
      {/* 登录弹窗 */}
      {showLoginModal && (
        <Login
          visible={showLoginModal}
          onClose={closeLoginModal}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </>
  );
};

export default Header;