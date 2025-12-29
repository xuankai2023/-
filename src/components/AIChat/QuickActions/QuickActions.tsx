import React from 'react';
import { Space, Tag } from 'antd';
import './QuickActions.css';

export interface QuickAction {
  id: string;
  label: string;
  prompt: string;
  icon?: React.ReactNode;
}

export interface QuickActionsProps {
  actions?: QuickAction[];
  onSelect?: (action: QuickAction) => void;
  visible?: boolean;
}

const defaultActions: QuickAction[] = [
  {
    id: 'pet-care',
    label: '宠物护理',
    prompt: '请给我一些关于宠物日常护理的建议',
  },
  {
    id: 'pet-health',
    label: '健康咨询',
    prompt: '我的宠物最近食欲不振，可能是什么原因？',
  },
  {
    id: 'pet-training',
    label: '训练技巧',
    prompt: '如何训练宠物养成良好的习惯？',
  },
  {
    id: 'pet-food',
    label: '饮食建议',
    prompt: '宠物应该吃什么食物？有什么需要注意的？',
  },
];

const QuickActions: React.FC<QuickActionsProps> = ({
  actions = defaultActions,
  onSelect,
  visible = true,
}) => {
  if (!visible || actions.length === 0) {
    return null;
  }

  return (
    <div className="quick-actions">
      <div className="quick-actions-label">快捷操作：</div>
      <Space wrap size={[8, 8]}>
        {actions.map((action) => (
          <Tag
            key={action.id}
            className="quick-action-tag"
            onClick={() => onSelect?.(action)}
          >
            {action.icon}
            {action.label}
          </Tag>
        ))}
      </Space>
    </div>
  );
};

export default QuickActions;

