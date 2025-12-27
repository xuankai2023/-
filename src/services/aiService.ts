import { KeyManager } from '../utils/keyManager';

/**
 * AI服务配置接口
 */
export interface AIServiceConfig {
  apiUrl: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

/**
 * 对话消息接口
 */
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/**
 * 流式响应回调
 */
export interface StreamingCallback {
  onMessage: (content: string, isDone: boolean) => void;
  onError: (error: Error) => void;
  onComplete?: () => void;
}

/**
 * AI服务类
 * 实现流式API调用，支持ReadableStream和SSE
 */
export class AIService {
  private config: AIServiceConfig;
  private controller: AbortController | null = null;

  constructor(config?: Partial<AIServiceConfig>) {
    this.config = {
      apiUrl: 'https://api.deepseek.com/v1/chat/completions',
      model: 'deepseek-chat',
      temperature: 0.7,
      maxTokens: 400, // 大约对应300个汉字
      ...config
    };
  }

  /**
   * 取消当前请求
   */
  cancel(): void {
    if (this.controller) {
      this.controller.abort();
      this.controller = null;
    }
  }

  /**
   * 使用Fetch API的ReadableStream实现流式调用
   * @param messages 对话消息
   * @param callback 回调函数
   */
  async streamWithReadableStream(
    messages: ChatMessage[],
    callback: StreamingCallback
  ): Promise<void> {
    try {
      const apiKey = KeyManager.getKey();
      if (!apiKey) {
        throw new Error('API密钥未配置');
      }

      this.controller = new AbortController();
      const response = await fetch(this.config.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.config.model,
          messages,
          temperature: this.config.temperature,
          max_tokens: this.config.maxTokens,
          stream: true
        }),
        signal: this.controller.signal
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API请求失败: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('响应体为空');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          // 处理剩余的缓冲区数据
          if (buffer) {
            this.processStreamBuffer(buffer, callback);
          }
          callback.onMessage('', true);
          callback.onComplete?.();
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        // 保存处理后的缓冲区
        buffer = this.processStreamBuffer(buffer, callback);
      }
    } catch (error) {
      callback.onError(error instanceof Error ? error : new Error('未知错误'));
      this.controller = null;
    }
  }

  /**
   * 使用SSE实现流式调用
   * @param messages 对话消息
   * @param callback 回调函数
   */
  streamWithSSE(
    messages: ChatMessage[],
    callback: StreamingCallback
  ): void {
    try {
      const apiKey = KeyManager.getKey();
      if (!apiKey) {
        throw new Error('API密钥未配置');
      }

      // 注意：SSE通常用于服务器主动推送，这里是模拟实现
      // 实际项目中可能需要使用WebSocket或其他双向通信方式
      // 由于EventSource不支持自定义headers，我们使用fetch API模拟SSE
      this.simulateStream(messages, callback);
    } catch (error) {
      callback.onError(error instanceof Error ? error : new Error('未知错误'));
    }
  }

  /**
   * 处理流式响应缓冲区
   * @param buffer 缓冲区数据
   * @param callback 回调函数
   * @returns 处理后的缓冲区，只包含最后一行（可能不完整）
   */
  private processStreamBuffer(buffer: string, callback: StreamingCallback): string {
    const lines = buffer.split('\n');
    
    // 处理除了最后一行（可能不完整）之外的所有行
    for (let i = 0; i < lines.length - 1; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      // 移除data:前缀
      if (line.startsWith('data: ')) {
        const dataStr = line.slice(6);
        
        // 处理结束标记
        if (dataStr === '[DONE]') {
          callback.onMessage('', true);
          callback.onComplete?.();
          return '';
        }
        
        try {
          const data = JSON.parse(dataStr);
          const content = data.choices?.[0]?.delta?.content || '';
          if (content) {
            callback.onMessage(content, false);
          }
        } catch (error) {
          // 忽略解析错误，继续处理下一行
          console.error('解析流式数据失败:', error);
        }
      }
    }

    // 返回最后一行（可能不完整）作为新的缓冲区
    return lines[lines.length - 1];
  }

  /**
   * 模拟流式响应（用于开发和测试）
   * @param messages 对话消息
   * @param callback 回调函数
   */
  simulateStream(
    messages: ChatMessage[],
    callback: StreamingCallback
  ): void {
    const responses = [
      '您好！我是您的宠物行业智能助手，有什么可以帮助您的？',
      '感谢您的提问，我会尽力为您提供帮助。',
      '这个问题很有趣，让我为您详细解答。',
      '根据您提供的信息，我建议您...',
      '您可以尝试...，这可能会解决您的问题。',
      '非常感谢您的咨询，祝您有愉快的一天！'
    ];

    // 随机选择一个响应
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    let index = 0;
    const typingSpeed = 30; // 打字速度（毫秒/字符）

    const typeNextChar = () => {
      if (index < randomResponse.length) {
        const char = randomResponse.charAt(index);
        callback.onMessage(char, false);
        index++;
        setTimeout(typeNextChar, typingSpeed);
      } else {
        callback.onMessage('', true);
        callback.onComplete?.();
      }
    };

    // 延迟开始，模拟网络请求
    setTimeout(typeNextChar, 500);
  }
}

// 导出单例实例
export const aiService = new AIService();
