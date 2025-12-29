import React from 'react';
import { Avatar } from 'antd';
import { RobotOutlined } from '@ant-design/icons';
import './TypingIndicator.css';

const TypingIndicator: React.FC = () => {
  return (
    <div className="typing-indicator">
      <Avatar 
        icon={<RobotOutlined />} 
        className="typing-avatar"
      />
      <div className="typing-content">
        <span className="typing-text">AI助手正在思考</span>
        <div className="typing-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;

