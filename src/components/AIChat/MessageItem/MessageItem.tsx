import React from 'react';
import { Avatar } from 'antd';
import { UserOutlined, RobotOutlined } from '@ant-design/icons';
import MessageActions from '../MessageActions/MessageActions';
import './MessageItem.css';

export interface MessageItemProps {
  message: {
    id: string;
    content: string;
    sender: 'user' | 'ai';
    timestamp: Date;
  };
  formatAiOutput?: (content: string) => string;
  onCopy?: (content: string) => void;
  onRegenerate?: (content: string) => void;
  onEdit?: (messageId: string, newContent: string) => void;
  onLike?: (messageId: string) => void;
  onDislike?: (messageId: string) => void;
  isStreaming?: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  formatAiOutput,
  onCopy,
  onRegenerate,
  onEdit,
  onLike,
  onDislike,
  isStreaming = false,
}) => {
  const isUser = message.sender === 'user';
  const formattedContent = isUser 
    ? message.content 
    : (formatAiOutput ? formatAiOutput(message.content) : message.content);

  return (
    <div className={`message-item ${message.sender} ${isStreaming ? 'streaming' : ''}`}>
      <div className="message-item-meta">
        <Avatar 
          icon={isUser ? <UserOutlined /> : <RobotOutlined />}
          className={`message-avatar ${message.sender}`}
        />
        <div className="message-item-content">
          <div className="message-header">
            <span className="message-sender">
              {isUser ? '我' : 'AI助手'}
              <span className="message-time">
                {message.timestamp.toLocaleTimeString('zh-CN', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </span>
            <MessageActions
              message={message}
              onCopy={onCopy}
              onRegenerate={onRegenerate}
              onEdit={onEdit}
              onLike={onLike}
              onDislike={onDislike}
              isStreaming={isStreaming}
            />
          </div>
          <div className="message-content-wrapper">
            {isUser ? (
              <div className={`message-content ${isUser ? 'user-message' : 'ai-message'}`}>
                {message.content}
              </div>
            ) : (
              <div 
                className={`message-content ${isUser ? 'user-message' : 'ai-message'}`}
                dangerouslySetInnerHTML={{ __html: formattedContent }}
              />
            )}
            {isStreaming && (
              <div className="streaming-cursor">▊</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;

