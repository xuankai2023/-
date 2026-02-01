import { useState, useCallback, useRef } from 'react';
import { message } from 'antd';
import { aiService, ChatMessage } from '../services/aiService';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface UseStreamingMessageOptions {
  maxWords?: number;
  onComplete?: (message: Message) => void;
  onError?: (error: Error) => void;
}

const DEFAULT_MAX_WORDS = 300;
const UPDATE_INTERVAL = 8; // 约 120fps，更流畅的更新

export function useStreamingMessage(options: UseStreamingMessageOptions = {}) {
  const { maxWords = DEFAULT_MAX_WORDS, onComplete, onError } = options;
  const [isTyping, setIsTyping] = useState(false);
  const [currentAiMessage, setCurrentAiMessage] = useState<Message | null>(null);
  const [currentAiWordCount, setCurrentAiWordCount] = useState(0);
  const completedRef = useRef(false);
  const accumulatedContentRef = useRef('');
  const updateTimerRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef(0);

  // 使用 requestAnimationFrame 优化更新，确保流畅渲染
  const scheduleUpdate = useCallback((aiMessage: Message, content: string) => {
    const now = Date.now();
    
    // 如果距离上次更新时间太短，使用 requestAnimationFrame 批量更新
    if (now - lastUpdateTimeRef.current < UPDATE_INTERVAL) {
      if (updateTimerRef.current === null) {
        updateTimerRef.current = requestAnimationFrame(() => {
          setCurrentAiMessage({
            ...aiMessage,
            content: accumulatedContentRef.current
          });
          setCurrentAiWordCount(accumulatedContentRef.current.length);
          lastUpdateTimeRef.current = Date.now();
          updateTimerRef.current = null;
        });
      }
    } else {
      // 立即更新
      setCurrentAiMessage({
        ...aiMessage,
        content
      });
      setCurrentAiWordCount(content.length);
      lastUpdateTimeRef.current = now;
    }
  }, []);

  const processStreamingResponse = useCallback(
    (chatMessages: ChatMessage[], onMessageUpdate?: (message: Message) => void) => {
      // 重置状态
      completedRef.current = false;
      accumulatedContentRef.current = '';
      setIsTyping(true);
      lastUpdateTimeRef.current = 0;

      // 清理之前的更新定时器
      if (updateTimerRef.current !== null) {
        cancelAnimationFrame(updateTimerRef.current);
        updateTimerRef.current = null;
      }

      // 创建AI消息
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        content: '',
        sender: 'ai',
        timestamp: new Date()
      };

      setCurrentAiMessage(aiMessage);

      // 调用AI服务获取流式响应
      aiService.streamWithReadableStream(chatMessages, {
        onMessage: (content, isDone) => {
          // 如果已经完成，不再处理新的消息
          if (completedRef.current) {
            return;
          }

          if (isDone) {
            // 完成流式响应
            if (!completedRef.current && accumulatedContentRef.current) {
              completedRef.current = true;
              
              // 清理更新定时器
              if (updateTimerRef.current !== null) {
                cancelAnimationFrame(updateTimerRef.current);
                updateTimerRef.current = null;
              }
              
              setIsTyping(false);
              setCurrentAiWordCount(0);
              const finalMessage = { ...aiMessage, content: accumulatedContentRef.current };
              setCurrentAiMessage(null);
              onComplete?.(finalMessage);
              onMessageUpdate?.(finalMessage);
            }
          } else if (content) {
            // 累积内容
            accumulatedContentRef.current += content;
            const updatedWordCount = accumulatedContentRef.current.length;

            if (updatedWordCount <= maxWords) {
              // 使用优化的更新方法
              scheduleUpdate(aiMessage, accumulatedContentRef.current);
            } else {
              // 超过字数限制，截断内容并结束响应
              if (!completedRef.current) {
                completedRef.current = true;
                const remainingChars = maxWords;
                accumulatedContentRef.current = accumulatedContentRef.current.slice(0, remainingChars) + '...';
                
                // 清理更新定时器
                if (updateTimerRef.current !== null) {
                  cancelAnimationFrame(updateTimerRef.current);
                  updateTimerRef.current = null;
                }
                
                setCurrentAiMessage({
                  ...aiMessage,
                  content: accumulatedContentRef.current
                });
                setIsTyping(false);
                setCurrentAiWordCount(maxWords);
                const finalMessage = { ...aiMessage, content: accumulatedContentRef.current };
                setCurrentAiMessage(null);
                onComplete?.(finalMessage);
                onMessageUpdate?.(finalMessage);
                aiService.cancel();
              }
            }
          }
        },
        onError: (error) => {
          if (!completedRef.current) {
            completedRef.current = true;
            
            // 清理更新定时器
            if (updateTimerRef.current !== null) {
              cancelAnimationFrame(updateTimerRef.current);
              updateTimerRef.current = null;
            }
            
            message.error(`AI服务错误: ${error.message}`);
            setIsTyping(false);
            setCurrentAiMessage(null);
            onError?.(error);
          }
        },
        onComplete: () => {
          // 对话完成
        }
      });
    },
    [maxWords, onComplete, onError, scheduleUpdate]
  );

  const cancel = useCallback(() => {
    aiService.cancel();
    setIsTyping(false);
    setCurrentAiMessage(null);
    setCurrentAiWordCount(0);
  }, []);

  return {
    isTyping,
    currentAiMessage,
    currentAiWordCount,
    processStreamingResponse,
    cancel
  };
}

