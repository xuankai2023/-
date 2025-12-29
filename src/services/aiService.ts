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
    // 使用 Mock 数据 - 已注释真实 API 调用
    // try {
    //   const apiKey = KeyManager.getKey();
    //   if (!apiKey) {
    //     throw new Error('API密钥未配置');
    //   }

    //   this.controller = new AbortController();
    //   const response = await fetch(this.config.apiUrl, {
    //     method: 'POST',
    //     headers: {
    //       'Authorization': `Bearer ${apiKey}`,
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({
    //       model: this.config.model,
    //       messages,
    //       temperature: this.config.temperature,
    //       max_tokens: this.config.maxTokens,
    //       stream: true
    //     }),
    //     signal: this.controller.signal
    //   });

    //   if (!response.ok) {
    //     const errorData = await response.json().catch(() => ({}));
    //     throw new Error(errorData.error?.message || `API请求失败: ${response.status}`);
    //   }

    //   if (!response.body) {
    //     throw new Error('响应体为空');
    //   }

    //   const reader = response.body.getReader();
    //   const decoder = new TextDecoder('utf-8');
    //   let buffer = '';

    //   while (true) {
    //     const { done, value } = await reader.read();
    //     if (done) {
    //       // 处理剩余的缓冲区数据
    //       if (buffer) {
    //         this.processStreamBuffer(buffer, callback);
    //       }
    //       callback.onMessage('', true);
    //       callback.onComplete?.();
    //       break;
    //     }

    //     buffer += decoder.decode(value, { stream: true });
    //     // 保存处理后的缓冲区
    //     buffer = this.processStreamBuffer(buffer, callback);
    //   }
    // } catch (error) {
    //   callback.onError(error instanceof Error ? error : new Error('未知错误'));
    //   this.controller = null;
    // }

    // 使用 Mock 数据模拟流式响应
    this.simulateStream(messages, callback);
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
    // 根据用户消息生成更智能的回复
    const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content || '';
    
    let response = '';
    
    // 根据用户消息内容生成相应的回复
    if (lastUserMessage.includes('你好') || lastUserMessage.includes('您好')) {
      response = '您好！我是您的宠物行业智能助手，专门为您提供宠物相关的咨询和服务。我可以帮助您解答关于宠物健康、护理、训练、营养等方面的问题。有什么我可以帮助您的吗？';
    } else if (lastUserMessage.includes('健康') || lastUserMessage.includes('生病')) {
      response = '关于宠物健康问题，我建议您：\n\n1. 观察宠物的症状，包括食欲、精神状态、体温等\n2. 如果症状持续超过24小时，建议尽快带宠物就医\n3. 保持宠物的生活环境清洁卫生\n4. 定期为宠物进行健康检查\n\n如果您的宠物出现紧急情况，请立即联系附近的宠物医院。';
    } else if (lastUserMessage.includes('疫苗') || lastUserMessage.includes('接种')) {
      response = '宠物疫苗接种是非常重要的健康保护措施：\n\n1. 幼犬/幼猫需要在6-8周龄开始接种第一针疫苗\n2. 之后每隔3-4周接种一次，直到16周龄\n3. 成年后每年需要接种加强针\n4. 常见的疫苗包括：狂犬病疫苗、犬瘟热疫苗、猫瘟疫苗等\n\n建议您咨询专业的宠物医生，制定适合您宠物的疫苗接种计划。';
    } else if (lastUserMessage.includes('训练') || lastUserMessage.includes('教育')) {
      response = '宠物训练需要耐心和正确的方法：\n\n1. 使用正向强化训练法，奖励好的行为\n2. 保持训练时间短而频繁，每次10-15分钟\n3. 使用一致的口令和手势\n4. 避免惩罚，这可能导致宠物恐惧\n5. 从小开始训练效果更好\n\n记住，每只宠物都有自己的个性，需要根据它们的特点调整训练方法。';
    } else if (lastUserMessage.includes('饮食') || lastUserMessage.includes('食物') || lastUserMessage.includes('喂食')) {
      response = '宠物的饮食管理很重要：\n\n1. 选择高质量的宠物食品，确保营养均衡\n2. 根据宠物的年龄、体重和活动量确定喂食量\n3. 定时定量喂食，避免随意喂食\n4. 确保宠物随时有清洁的饮用水\n5. 避免给宠物喂食人类食物，特别是巧克力、洋葱等有毒食物\n\n如果您不确定哪种食物适合您的宠物，建议咨询宠物营养师。';
    } else {
      // 默认回复
      const defaultResponses = [
        '感谢您的提问！作为宠物行业智能助手，我很乐意为您提供帮助。关于您提到的问题，我建议您可以：\n\n1. 详细观察宠物的行为和症状\n2. 记录相关信息，包括时间、频率等\n3. 咨询专业的宠物医生或相关专家\n4. 参考可靠的宠物护理资料\n\n如果您需要更具体的建议，请提供更多详细信息，我会尽力为您解答。',
        '这是一个很好的问题！根据我的了解，在宠物护理方面，有几个重要的原则：\n\n1. 定期健康检查很重要\n2. 保持宠物的生活环境清洁\n3. 提供适当的运动和社交\n4. 关注宠物的心理健康\n\n如果您能提供更多具体信息，我可以给出更针对性的建议。',
        '我理解您的关注。对于宠物相关问题，我建议：\n\n1. 首先评估情况的紧急程度\n2. 如果是紧急情况，立即联系宠物医院\n3. 如果是日常问题，可以咨询专业兽医\n4. 保持冷静，不要慌张\n\n请告诉我更多细节，我会尽力帮助您。'
      ];
      response = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }
    
    let index = 0;
    const typingSpeed = 30; // 打字速度（毫秒/字符）

    const typeNextChar = () => {
      if (index < response.length) {
        const char = response.charAt(index);
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
