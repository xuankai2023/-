import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../auth/AuthContext';
import './LoginModal.css';
import Login from '../Login/Login';

const Header: React.FC = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuthContext();

  // 当登录状态变为已登录时，自动关闭登录弹窗并跳转到 admin 页面
  useEffect(() => {
    if (isAuthenticated && showLoginModal) {
      console.log('登录成功，准备跳转到 admin 页面');
      setShowLoginModal(false);
      setTimeout(() => {
        const currentPath = location.pathname;
        if (currentPath !== '/admin' && currentPath !== '/admin/dashboard') {
          console.log('跳转到 /admin 页面');
          navigate('/admin', { replace: true });
        }
      }, 200);
    }
  }, [isAuthenticated, showLoginModal, navigate, location.pathname]);

  const openLoginModal = () => {
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
    setTimeout(() => {
      console.log('从 loginHeader 组件跳转到 /admin');
      navigate('/admin', { replace: true });
    }, 100);
  };
  //使用 react-router 进行页面导航
  const navigateToAbout = () => {
    navigate('/about');
  }
  const navigateToNewsroom = () => {
    navigate('/newsroom');
  }
  const navigateToCareers = () => {
    navigate('/careers');
  }
  const navigateToContact = () => {
    navigate('/contact');
  }

  if (location.pathname === '/admin') {
    return null;
  }
  return (
    <>
      <header className="tiktok-header">
        <div className="header-container">
          <div className="logo-container">
            <svg viewBox="0 0 100 24" className="tiktok-logo">

            </svg>
          </div>
          <nav className="header-nav">
            <Button onClick={navigateToAbout} className="nav-button">About</Button>
            <Button onClick={navigateToNewsroom} className="nav-button">Newsroom</Button>
            <Button onClick={navigateToCareers} className="nav-button">Careers</Button>
            <Button onClick={navigateToContact} className="nav-button">Contact</Button>
          </nav>
          <div className="header-actions">
            {/* 如果未登录，显示登录按钮 */}
            {!isAuthenticated && (
              <Button type="primary" onClick={openLoginModal} className="watch-tiktok-btn">
                登录
              </Button>
            )}
          </div>
        </div>
      </header>
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
