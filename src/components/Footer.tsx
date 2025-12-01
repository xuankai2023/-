import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      padding: '20px 0',
      marginTop: '40px',
      borderTop: '1px solid #f0f0f0',
      textAlign: 'center'
    }}>
      <p style={{
        margin: 0,
        color: '#666',
        fontSize: '14px'
      }}>
        © {currentYear} 宠物行业管理系统 版权所有
      </p>
    </footer>
  );
};

export default Footer;