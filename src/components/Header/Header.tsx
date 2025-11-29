import React, { useState } from 'react';
import { Button } from 'react-vant';
import { useNavigate } from 'react-router';
import './LoginModal.css';
import Login from '../Login/Login';
const Header: React.FC = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);

  const openLoginModal = () => {
    setShowLoginModal(true);
  };
const navigate = useNavigate();
  const closeLoginModal = () => {
    setShowLoginModal(false);
  };
//使用 react-router 进行页面导航
  const navigateToAbout = () =>{
    navigate('/about');
  }
  const navigateToNewsroom = () =>{
    navigate('/newsroom');
  }
  const navigateToCareers = () =>{
    navigate('/careers');
  }
  const navigateToContact = () =>{
    navigate('/contact');
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
           <Button type="primary" onClick={openLoginModal} className="watch-tiktok-btn">
              Watch TikTok →
            </Button>
          </div>
        </div>
      </header>
      {showLoginModal && <Login onClose={closeLoginModal} />}
    </>
  );
};

export default Header;
