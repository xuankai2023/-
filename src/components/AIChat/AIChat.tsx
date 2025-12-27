import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef, useCallback } from 'react';
import { message, List, Avatar, Button, Dropdown } from 'antd';
import { RobotOutlined, CopyOutlined, MoreOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import './AIChat.css';
import { ChatMessage } from '../../services/aiService';
import { KeyManager } from '../../utils/keyManager';
import { saveChatHistory, getChatHistoryById, updateChatHistory, Message as HistoryMessage } from '../../utils/chatHistoryManager';
import ConversationHistory from './ConversationHistory/ConversationHistory';
import ApiKeyModal from './ApiKeyModal/ApiKeyModal';
import ChatInput from './ChatInput/ChatInput';
import { useStreamingMessage, Message } from '../../hooks/useStreamingMessage';
import { formatAiOutput } from '../../utils/messageFormatter';

export interface AIChatRef {
  loadHistory: (historyId: string) => void;
  clearChat: () => void;
  getCurrentHistoryId: () => string | null;
}

interface AIChatProps {
  onHistoryChange?: (historyId: string | null) => void;
}

const AIChat = forwardRef<AIChatRef, AIChatProps>(({ onHistoryChange }, ref) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [currentHistoryId, setCurrentHistoryId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    isTyping,
    currentAiMessage,
    processStreamingResponse,
    cancel
  } = useStreamingMessage({
    maxWords: 300,
    onComplete: (aiMessage) => {
      setMessages(prev => [...prev, aiMessage]);
    },
    onError: (error) => {
      message.error(`AI服务错误: ${error.message}`);
    }
  });

  // 滚动到最新消息
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentAiMessage, scrollToBottom]);

  // 保存历史记录
  const saveHistory = useCallback(() => {
    if (messages.length === 0) {
      return;
    }

    if (currentHistoryId) {
      updateChatHistory(currentHistoryId, messages as HistoryMessage[]);
    } else {
      const newHistoryId = saveChatHistory(messages as HistoryMessage[]);
      if (newHistoryId) {
        setCurrentHistoryId(newHistoryId);
        onHistoryChange?.(newHistoryId);
      }
    }
  }, [messages, currentHistoryId, onHistoryChange]);

  // 清空对话
  const clearChat = useCallback(() => {
    setMessages([]);
    setInputValue('');
    setCurrentHistoryId(null);
    cancel();
    onHistoryChange?.(null);
  }, [cancel, onHistoryChange]);

  // 加载历史记录
  const loadHistory = useCallback((historyId: string) => {
    if (!historyId) {
      clearChat();
      return;
    }

    const history = getChatHistoryById(historyId);
    if (history) {
      const historyMessages = history.messages as Message[];
      setMessages(historyMessages);
      setCurrentHistoryId(historyId);
      onHistoryChange?.(historyId);
      message.success('已加载历史对话');
    } else {
      message.error('加载历史记录失败');
    }
  }, [clearChat, onHistoryChange]);

  // 暴露方法给父组件
  useImperativeHandle(ref, () => ({
    loadHistory,
    clearChat,
    getCurrentHistoryId: () => currentHistoryId
  }), [loadHistory, clearChat, currentHistoryId]);

  // 当消息变化时自动保存
  useEffect(() => {
    if (messages.length > 0 && !isTyping) {
      const timer = setTimeout(() => {
        saveHistory();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [messages, isTyping, saveHistory]);

  // 发送欢迎消息
  const sendWelcomeMessage = useCallback(() => {
    const chatMessages: ChatMessage[] = [
      { role: 'system', content: '你是一个专业的宠物行业智能助手，提供友好、准确的回答。' },
      { role: 'user', content: '你好，我是一个宠物爱好者，想了解一些关于宠物护理的知识。' }
    ];

    processStreamingResponse(chatMessages, (aiMessage) => {
      setMessages([aiMessage]);
    });
  }, [processStreamingResponse]);

  // 检查是否已存储API密钥
  useEffect(() => {
    const hasKey = KeyManager.hasKey();
    if (hasKey) {
      sendWelcomeMessage();
    } else {
      setShowKeyModal(true);
    }
  }, [sendWelcomeMessage]);

  // 处理发送消息
  const handleSendMessage = useCallback(() => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput) {
      message.warning('请输入消息内容');
      return;
    }

    if (!KeyManager.hasKey()) {
      message.error('请先设置API密钥');
      setShowKeyModal(true);
      return;
    }

    // 创建用户消息
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: trimmedInput,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => {
      const newMessages = [...prev, userMessage];
      if (!currentHistoryId && newMessages.length === 1) {
        const newHistoryId = saveChatHistory(newMessages as HistoryMessage[]);
        if (newHistoryId) {
          setCurrentHistoryId(newHistoryId);
          onHistoryChange?.(newHistoryId);
        }
      }
      return newMessages;
    });
    setInputValue('');

    // 转换为AI服务所需的消息格式
    const chatMessages: ChatMessage[] = [
      { role: 'system', content: '你是一个专业的宠物行业智能助手，提供友好、准确的回答。' },
      ...messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content
      })),
      { role: 'user', content: trimmedInput }
    ];

    processStreamingResponse(chatMessages);
  }, [inputValue, messages, currentHistoryId, onHistoryChange, processStreamingResponse]);

  // 复制消息内容
  const handleCopyMessage = useCallback(async (content: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }

    try {
      const textContent = content.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
      await navigator.clipboard.writeText(textContent);
      message.success('已复制到剪贴板');
    } catch (error) {
      const textarea = document.createElement('textarea');
      const textContent = content.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
      textarea.value = textContent;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        message.success('已复制到剪贴板');
      } catch (err) {
        message.error('复制失败');
      }
      document.body.removeChild(textarea);
    }
  }, []);

  // 重新提问（立即发送）
  const handleRegenerateAndSend = useCallback((messageContent: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }

    if (!KeyManager.hasKey()) {
      message.error('请先设置API密钥');
      setShowKeyModal(true);
      return;
    }

    const trimmedContent = messageContent.trim();
    if (!trimmedContent) {
      return;
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: trimmedContent,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => {
      const newMessages = [...prev, userMessage];
      if (!currentHistoryId && newMessages.length === 1) {
        const newHistoryId = saveChatHistory(newMessages as HistoryMessage[]);
        if (newHistoryId) {
          setCurrentHistoryId(newHistoryId);
          onHistoryChange?.(newHistoryId);
        }
      }
      return newMessages;
    });

    const chatMessages: ChatMessage[] = [
      { role: 'system', content: '你是一个专业的宠物行业智能助手，提供友好、准确的回答。' },
      ...messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content
      })),
      { role: 'user', content: trimmedContent }
    ];

    processStreamingResponse(chatMessages);
  }, [messages, currentHistoryId, onHistoryChange, processStreamingResponse]);

  // 渲染消息操作菜单（用于当前流式消息）
  const renderMessageActions = (item: Message) => {
    const content = item.content.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim();

    const menuItems: MenuProps['items'] = [
      {
        key: 'copy',
        label: '复制',
        icon: <CopyOutlined />,
        onClick: () => handleCopyMessage(content)
      }
    ];

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

  // 渲染当前AI消息（流式输出）
  const renderCurrentAiMessage = () => {
    if (!currentAiMessage) return null;

    return (
      <List.Item className="message-item ai" key={currentAiMessage.id}>
        <List.Item.Meta
          avatar={<Avatar icon={<RobotOutlined />} />}
          title={
            <div className="message-header">
              <span className="message-sender">
                AI助手
                <span className="message-time">
                  {currentAiMessage.timestamp.toLocaleTimeString()}
                </span>
              </span>
              {renderMessageActions(currentAiMessage)}
            </div>
          }
          description={
            <div
              className="message-content"
              dangerouslySetInnerHTML={{ __html: formatAiOutput(currentAiMessage.content) }}
            />
          }
        />
      </List.Item>
    );
  };

  return (
    <div className="ai-chat-container">
      <div className="ai-chat-header">
        <div>
          <h2>AI对话助手</h2>
          <p>有什么可以帮助您的？</p>
        </div>
      </div>

      <div className="ai-chat-messages">
        {messages.length > 0 && (
          <ConversationHistory
            messages={messages}
            formatAiOutput={formatAiOutput}
            onCopyMessage={handleCopyMessage}
            onRegenerate={handleRegenerateAndSend}
          />
        )}

        {renderCurrentAiMessage()}

        {isTyping && !currentAiMessage && (
          <div className="typing-indicator">
            <Avatar icon={<RobotOutlined />} />
            <span>AI助手正在输入...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <ChatInput
        value={inputValue}
        onChange={setInputValue}
        onSend={handleSendMessage}
        disabled={isTyping}
      />

      <ApiKeyModal
        open={showKeyModal}
        onClose={() => setShowKeyModal(false)}
        onSuccess={() => {
          sendWelcomeMessage();
        }}
      />
    </div>
  );
});

AIChat.displayName = 'AIChat';

export default AIChat;
