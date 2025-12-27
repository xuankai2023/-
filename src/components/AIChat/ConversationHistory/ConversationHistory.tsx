import React from 'react';
import { List, Avatar, Button, Dropdown } from 'antd';
import { UserOutlined, RobotOutlined, CopyOutlined, ReloadOutlined, MoreOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import './ConversationHistory.css';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ConversationHistoryProps {
  messages: Message[];
  formatAiOutput?: (content: string) => string;
  onCopyMessage?: (content: string) => void;
  onRegenerate?: (content: string) => void;
}

const ConversationHistory: React.FC<ConversationHistoryProps> = ({ 
  messages, 
  formatAiOutput,
  onCopyMessage,
  onRegenerate
}) => {
  // 默认格式化函数
  const defaultFormatAiOutput = (content: string): string => {
    let formatted = content;
    
    // 处理标题格式
    formatted = formatted.replace(/^# (.*$)/gm, '<strong>$1</strong><br><br>');
    formatted = formatted.replace(/^## (.*$)/gm, '<strong>$1</strong><br>');
    
    // 处理列表格式
    formatted = formatted.replace(/^- (.*$)/gm, '• $1<br>');
    formatted = formatted.replace(/^\d+\. (.*$)/gm, '• $1<br>');
    
    // 处理换行和段落
    formatted = formatted.replace(/\n\n/g, '<br><br>');
    formatted = formatted.replace(/\n/g, '<br>');
    
    // 处理代码块
    formatted = formatted.replace(/```([\s\S]*?)```/g, '<code style="background-color: #f5f5f5; padding: 2px 4px; border-radius: 3px; font-family: monospace;">$1</code>');
    
    // 处理加粗
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // 处理斜体
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    return formatted;
  };

  const formatContent = formatAiOutput || defaultFormatAiOutput;

  // 渲染消息操作菜单
  const renderMessageActions = (item: Message) => {
    if (!onCopyMessage && !onRegenerate) return null;

    const isUserMessage = item.sender === 'user';
    // 对于AI消息，需要从HTML中提取纯文本
    let content = item.content;
    if (!isUserMessage) {
      // 移除HTML标签，获取纯文本用于复制
      content = content.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim();
    }

    const menuItems: MenuProps['items'] = [];
    
    if (onCopyMessage) {
      menuItems.push({
        key: 'copy',
        label: '复制',
        icon: <CopyOutlined />,
        onClick: () => onCopyMessage(content)
      });
    }

    // 用户消息可以重新提问
    if (isUserMessage && onRegenerate) {
      menuItems.push({
        key: 'regenerate',
        label: '重新提问',
        icon: <ReloadOutlined />,
        onClick: () => onRegenerate(content)
      });
    }

    if (menuItems.length === 0) return null;

    return (
      <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
        <Button
          type="text"
          size="small"
          icon={<MoreOutlined />}
          className="message-action-btn"
          onClick={(e) => e.stopPropagation()}
        />
      </Dropdown>
    );
  };

  return (
    <div className="conversation-history">
      <List
        dataSource={messages}
        renderItem={(item) => (
          <List.Item
            className={`message-item ${item.sender}`}
            key={item.id}
          >
            <List.Item.Meta
              avatar={
                <Avatar icon={item.sender === 'user' ? <UserOutlined /> : <RobotOutlined />} />
              }
              title={
                <div className="message-header">
                  <span className="message-sender">
                    {item.sender === 'user' ? '我' : 'AI助手'}
                    <span className="message-time">
                      {item.timestamp.toLocaleTimeString()}
                    </span>
                  </span>
                  {renderMessageActions(item)}
                </div>
              }
              description={
                <div className="message-content">
                  {item.sender === 'ai' ? (
                    <div dangerouslySetInnerHTML={{ __html: formatContent(item.content) }} />
                  ) : (
                    item.content
                  )}
                </div>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default ConversationHistory;

