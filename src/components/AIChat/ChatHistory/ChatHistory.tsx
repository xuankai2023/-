import React, { useState, useEffect, useMemo } from 'react';
import { Input, Button, Empty, Popconfirm, message as antMessage } from 'antd';
import { SearchOutlined, DeleteOutlined, ClockCircleOutlined } from '@ant-design/icons';
import './ChatHistory.css';
import {
  getAllChatHistory,
  deleteChatHistory,
  clearAllChatHistory,
  ChatHistoryItem
} from '../../../utils/chatHistoryManager';

interface ChatHistoryProps {
  onSelectHistory: (historyId: string) => void;
  currentHistoryId?: string;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ onSelectHistory, currentHistoryId }) => {
  const [histories, setHistories] = useState<ChatHistoryItem[]>([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);

  // 加载历史记录
  const loadHistories = () => {
    setLoading(true);
    try {
      const allHistories = getAllChatHistory();
      setHistories(allHistories);
    } catch (error) {
      antMessage.error('加载历史记录失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistories();

    // 监听存储变化（用于跨标签页同步）
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'ai_chat_history') {
        loadHistories();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // 过滤历史记录
  const filteredHistories = useMemo(() => {
    if (!searchText.trim()) {
      return histories;
    }

    const lowerSearchText = searchText.toLowerCase();
    return histories.filter(history =>
      history.title.toLowerCase().includes(lowerSearchText) ||
      history.messages.some(msg =>
        msg.content.toLowerCase().includes(lowerSearchText)
      )
    );
  }, [histories, searchText]);

  // 删除单条历史记录
  const handleDelete = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    const success = deleteChatHistory(id);
    if (success) {
      antMessage.success('删除成功');
      loadHistories();
      // 如果删除的是当前选中的记录，清空选择
      if (id === currentHistoryId) {
        onSelectHistory('');
      }
    } else {
      antMessage.error('删除失败');
    }
  };

  // 清空所有历史记录
  const handleClearAll = () => {
    const success = clearAllChatHistory();
    if (success) {
      antMessage.success('已清空所有历史记录');
      loadHistories();
      onSelectHistory('');
    } else {
      antMessage.error('清空失败');
    }
  };

  // 格式化时间
  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return '昨天';
    } else if (days < 7) {
      return `${days}天前`;
    } else {
      return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="chat-history-container">
      <div className="chat-history-header">
        <h3>提问记录</h3>
        {histories.length > 0 && (
          <Popconfirm
            title="确定要清空所有历史记录吗？"
            onConfirm={handleClearAll}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined />}
            >
              清空
            </Button>
          </Popconfirm>
        )}
      </div>

      <div className="chat-history-search">
        <Input
          placeholder="搜索历史记录..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
        />
      </div>

      <div className="chat-history-list">
        {loading ? (
          <div className="chat-history-loading">加载中...</div>
        ) : filteredHistories.length === 0 ? (
          <Empty
            description={searchText ? '没有找到相关记录' : '暂无提问记录'}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <div className="chat-history-list-items">
            {filteredHistories.map((item) => (
              <div
                key={item.id}
                className={`chat-history-item ${currentHistoryId === item.id ? 'active' : ''}`}
                onClick={() => onSelectHistory(item.id)}
              >
                <div className="chat-history-item-content">
                  <div className="chat-history-item-title">{item.title}</div>
                  <div className="chat-history-item-meta">
                    <span className="chat-history-item-time">
                      <ClockCircleOutlined /> {formatTime(item.updatedAt)}
                    </span>
                    <span className="chat-history-item-count">
                      {item.messageCount} 条消息
                    </span>
                  </div>
                </div>
                <Popconfirm
                  title="确定要删除这条记录吗？"
                  onConfirm={(e) => handleDelete(item.id, e)}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button
                    type="text"
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={(e) => e.stopPropagation()}
                    className="chat-history-item-delete"
                  />
                </Popconfirm>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHistory;

