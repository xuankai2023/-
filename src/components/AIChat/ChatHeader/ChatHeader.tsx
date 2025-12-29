import React from 'react';
import { Button, Space, Dropdown } from 'antd';
import { 
  DeleteOutlined, 
  SettingOutlined, 
  MoreOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import './ChatHeader.css';

export interface ChatHeaderProps {
  title?: string;
  subtitle?: string;
  onClear?: () => void;
  onNewChat?: () => void;
  onSettings?: () => void;
  showActions?: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  title = 'AI对话助手',
  subtitle = '有什么可以帮助您的？',
  onClear,
  onNewChat,
  onSettings,
  showActions = true,
}) => {
  const menuItems: MenuProps['items'] = [];

  if (onNewChat) {
    menuItems.push({
      key: 'new',
      label: '新建对话',
      icon: <ReloadOutlined />,
      onClick: onNewChat,
    });
  }

  if (onClear) {
    menuItems.push({
      key: 'clear',
      label: '清空对话',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: onClear,
    });
  }

  if (onSettings) {
    menuItems.push({
      type: 'divider',
    });
    menuItems.push({
      key: 'settings',
      label: '设置',
      icon: <SettingOutlined />,
      onClick: onSettings,
    });
  }

  return (
    <div className="chat-header">
      <div className="chat-header-content">
        <div>
          <h2 className="chat-header-title">{title}</h2>
          <p className="chat-header-subtitle">{subtitle}</p>
        </div>
        {showActions && menuItems.length > 0 && (
          <Dropdown 
            menu={{ items: menuItems }} 
            trigger={['click']}
            placement="bottomRight"
          >
            <Button
              type="text"
              icon={<MoreOutlined />}
              className="chat-header-action"
            />
          </Dropdown>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;

