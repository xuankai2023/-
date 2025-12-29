import React from 'react';
import { Button, Dropdown, Space } from 'antd';
import { 
  CopyOutlined, 
  ReloadOutlined, 
  EditOutlined, 
  MoreOutlined,
  CheckOutlined,
  CloseOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import './MessageActions.css';

export interface MessageActionsProps {
  message: {
    id: string;
    content: string;
    sender: 'user' | 'ai';
  };
  onCopy?: (content: string) => void;
  onRegenerate?: (content: string) => void;
  onEdit?: (messageId: string, newContent: string) => void;
  onLike?: (messageId: string) => void;
  onDislike?: (messageId: string) => void;
  isStreaming?: boolean;
}

const MessageActions: React.FC<MessageActionsProps> = ({
  message,
  onCopy,
  onRegenerate,
  onEdit,
  onLike,
  onDislike,
  isStreaming = false,
}) => {
  const isUser = message.sender === 'user';
  
  // 提取纯文本内容（移除HTML标签）
  const getPlainText = (content: string): string => {
    return content
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .trim();
  };

  const plainContent = getPlainText(message.content);

  const menuItems: MenuProps['items'] = [];

  // 复制功能
  if (onCopy) {
    menuItems.push({
      key: 'copy',
      label: '复制',
      icon: <CopyOutlined />,
      onClick: () => onCopy(plainContent),
    });
  }

  // 用户消息：重新提问
  if (isUser && onRegenerate) {
    menuItems.push({
      key: 'regenerate',
      label: '重新提问',
      icon: <ReloadOutlined />,
      onClick: () => onRegenerate(plainContent),
    });
  }

  // 用户消息：编辑
  if (isUser && onEdit) {
    menuItems.push({
      key: 'edit',
      label: '编辑',
      icon: <EditOutlined />,
      onClick: () => {
        // 这里可以触发编辑模式
        const newContent = prompt('编辑消息:', plainContent);
        if (newContent && newContent.trim()) {
          onEdit(message.id, newContent.trim());
        }
      },
    });
  }

  // AI消息：反馈
  if (!isUser && (onLike || onDislike)) {
    menuItems.push({
      type: 'divider',
    });
    if (onLike) {
      menuItems.push({
        key: 'like',
        label: '有用',
        icon: <CheckOutlined />,
        onClick: () => onLike(message.id),
      });
    }
    if (onDislike) {
      menuItems.push({
        key: 'dislike',
        label: '无用',
        icon: <CloseOutlined />,
        onClick: () => onDislike(message.id),
      });
    }
  }

  if (menuItems.length === 0 || isStreaming) {
    return null;
  }

  return (
    <div className="message-actions">
      <Dropdown 
        menu={{ items: menuItems }} 
        trigger={['click', 'hover']} 
        placement="bottomRight"
      >
        <Button
          type="text"
          size="small"
          icon={<MoreOutlined />}
          className="message-action-btn"
          onClick={(e) => e.stopPropagation()}
        />
      </Dropdown>
    </div>
  );
};

export default MessageActions;

