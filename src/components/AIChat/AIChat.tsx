import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef, useCallback } from 'react';
import { message } from 'antd';
import './AIChat.css';
import { ChatMessage } from '../../services/aiService';
import { KeyManager } from '../../utils/keyManager';
import { saveChatHistory, getChatHistoryById, updateChatHistory, Message as HistoryMessage } from '../../utils/chatHistoryManager';
import { formatAiOutput } from '../../utils/messageFormatter';
import { useStreamingMessage, Message } from '../../hooks/useStreamingMessage';

// 导入新组件
import ChatHeader from './ChatHeader/ChatHeader';
import MessageItem from './MessageItem/MessageItem';
import TypingIndicator from './TypingIndicator/TypingIndicator';
import ChatInput from './ChatInput/ChatInput';
import QuickActions, { QuickAction } from './QuickActions/QuickActions';
import ApiKeyModal from './ApiKeyModal/ApiKeyModal';

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
  const [showQuickActions, setShowQuickActions] = useState(true);
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
      setShowQuickActions(false);
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
    setShowQuickActions(true);
    cancel();
    onHistoryChange?.(null);
    message.success('对话已清空');
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
      setShowQuickActions(historyMessages.length === 0);
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
      setShowQuickActions(false);
    });
  }, [processStreamingResponse]);

  // 检查是否已存储API密钥（仅在组件挂载时执行一次）
  useEffect(() => {
    const hasKey = KeyManager.hasKey();
    if (hasKey) {
      sendWelcomeMessage();
    } else {
      setShowKeyModal(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      setShowQuickActions(false);

      // 转换为AI服务所需的消息格式
      const chatMessages: ChatMessage[] = [
        { role: 'system', content: '你是一个专业的宠物行业智能助手，提供友好、准确的回答。' },
        ...newMessages.map(msg => ({
          role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
          content: msg.content
        }))
      ];

      // 异步调用AI服务
      processStreamingResponse(chatMessages);

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
  }, [inputValue, currentHistoryId, onHistoryChange, processStreamingResponse]);

  // 处理停止生成
  const handleStop = useCallback(() => {
    cancel();
    message.info('已停止生成');
  }, [cancel]);

  // 复制消息内容
  const handleCopyMessage = useCallback(async (content: string) => {
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

  // 重新提问
  const handleRegenerate = useCallback((content: string) => {
    if (!KeyManager.hasKey()) {
      message.error('请先设置API密钥');
      setShowKeyModal(true);
      return;
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: content.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => {
      const newMessages = [...prev, userMessage];

      const chatMessages: ChatMessage[] = [
        { role: 'system', content: '你是一个专业的宠物行业智能助手，提供友好、准确的回答。' },
        ...newMessages.map(msg => ({
          role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
          content: msg.content
        }))
      ];

      processStreamingResponse(chatMessages);
      return newMessages;
    });
  }, [processStreamingResponse]);

  // 编辑消息
  const handleEditMessage = useCallback((messageId: string, newContent: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, content: newContent } : msg
    ));
    message.success('消息已更新');
  }, []);

  // 处理快捷操作
  const handleQuickAction = useCallback((action: QuickAction) => {
    setInputValue(action.prompt);
    // 自动发送
    setTimeout(() => {
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        content: action.prompt,
        sender: 'user',
        timestamp: new Date()
      };

      setMessages(prev => {
        const newMessages = [...prev, userMessage];
        setShowQuickActions(false);

        const chatMessages: ChatMessage[] = [
          { role: 'system', content: '你是一个专业的宠物行业智能助手，提供友好、准确的回答。' },
          ...newMessages.map(msg => ({
            role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
            content: msg.content
          }))
        ];

        processStreamingResponse(chatMessages);

        if (!currentHistoryId && newMessages.length === 1) {
          const newHistoryId = saveChatHistory(newMessages as HistoryMessage[]);
          if (newHistoryId) {
            setCurrentHistoryId(newHistoryId);
            onHistoryChange?.(newHistoryId);
          }
        }
        return newMessages;
      });
    }, 100);
  }, [currentHistoryId, onHistoryChange, processStreamingResponse]);

  // 消息反馈（点赞/点踩）
  const handleLike = useCallback((messageId: string) => {
    message.success('感谢您的反馈！');
    // 这里可以发送反馈到后端
  }, []);

  const handleDislike = useCallback((messageId: string) => {
    message.info('我们会改进回答质量');
    // 这里可以发送反馈到后端
  }, []);

  return (
    <div className="ai-chat-container">
      <ChatHeader
        onClear={clearChat}
        onNewChat={clearChat}
        showActions={messages.length > 0}
      />

      {showQuickActions && messages.length === 0 && (
        <QuickActions
          onSelect={handleQuickAction}
          visible={showQuickActions}
        />
      )}

      <div className="ai-chat-messages">
        {messages.map((msg) => (
          <MessageItem
            key={msg.id}
            message={msg}
            formatAiOutput={formatAiOutput}
            onCopy={handleCopyMessage}
            onRegenerate={handleRegenerate}
            onEdit={handleEditMessage}
            onLike={handleLike}
            onDislike={handleDislike}
          />
        ))}

        {currentAiMessage && (
          <MessageItem
            message={currentAiMessage}
            formatAiOutput={formatAiOutput}
            onCopy={handleCopyMessage}
            isStreaming={true}
          />
        )}

        {isTyping && !currentAiMessage && (
          <TypingIndicator />
        )}

        <div ref={messagesEndRef} />
      </div>

      <ChatInput
        value={inputValue}
        onChange={setInputValue}
        onSend={handleSendMessage}
        onStop={handleStop}
        disabled={false}
        isStreaming={isTyping}
        showStopButton={true}
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
