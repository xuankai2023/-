import { useState, useCallback } from 'react';
import { message } from 'antd';
import { aiService, ChatMessage } from '../services/aiService';
import { messageInterceptor } from '../utils/messageInterceptor';

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

export function useStreamingMessage(options: UseStreamingMessageOptions = {}) {
  const { maxWords = DEFAULT_MAX_WORDS, onComplete, onError } = options;
  const [isTyping, setIsTyping] = useState(false);
  const [currentAiMessage, setCurrentAiMessage] = useState<Message | null>(null);
  const [currentAiWordCount, setCurrentAiWordCount] = useState(0);

  const processStreamingResponse = useCallback(
    (chatMessages: ChatMessage[], onMessageUpdate?: (message: Message) => void) => {
      setIsTyping(true);

      // 创建AI消息
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        content: '',
        sender: 'ai',
        timestamp: new Date()
      };

      setCurrentAiMessage(aiMessage);

      let accumulatedContent = '';

      // 调用AI服务获取流式响应
      aiService.streamWithReadableStream(chatMessages, {
        onMessage: (content, isDone) => {
          // 使用消息拦截器处理AI消息
          const processedContent = messageInterceptor.intercept(content, isDone);

          if (isDone) {
            // 完成流式响应
            setIsTyping(false);
            setCurrentAiWordCount(0);
            setCurrentAiMessage(prev => {
              if (prev && accumulatedContent) {
                const finalMessage = { ...prev, content: accumulatedContent };
                onComplete?.(finalMessage);
                onMessageUpdate?.(finalMessage);
              }
              return null;
            });
          } else if (processedContent) {
            // 检查当前字数是否超过限制
            accumulatedContent += processedContent;
            const updatedWordCount = accumulatedContent.length;

            if (updatedWordCount <= maxWords) {
              // 更新当前AI消息（仅当有有效内容且未超过限制时）
              setCurrentAiMessage(prev => ({
                ...(prev || aiMessage),
                content: accumulatedContent
              }));
              setCurrentAiWordCount(updatedWordCount);
            } else {
              // 超过字数限制，截断内容并结束响应
              const previousLength = accumulatedContent.length - processedContent.length;
              const remainingChars = maxWords - previousLength;
              if (remainingChars > 0) {
                accumulatedContent = accumulatedContent.slice(0, previousLength + remainingChars) + '...';
              } else {
                accumulatedContent = accumulatedContent.slice(0, maxWords) + '...';
              }
              setCurrentAiMessage(prev => ({
                ...(prev || aiMessage),
                content: accumulatedContent
              }));
              setIsTyping(false);
              setCurrentAiWordCount(maxWords);
              const finalMessage = { ...aiMessage, content: accumulatedContent };
              setCurrentAiMessage(null);
              onComplete?.(finalMessage);
              onMessageUpdate?.(finalMessage);
              aiService.cancel();
            }
          }
        },
        onError: (error) => {
          message.error(`AI服务错误: ${error.message}`);
          setIsTyping(false);
          setCurrentAiMessage(null);
          onError?.(error);
        },
        onComplete: () => {
          // 对话完成
        }
      });
    },
    [maxWords, onComplete, onError]
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

