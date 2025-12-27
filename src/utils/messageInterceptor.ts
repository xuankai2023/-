/**
 * AI消息拦截器
 * 用于对AI发送的消息进行去重、优化和格式化处理
 */

export interface MessageInterceptorOptions {
  /** 去重窗口大小，单位：字符 */
  dedupWindowSize?: number;
  /** 相似度阈值，0-1之间 */
  similarityThreshold?: number;
}

/**
 * 消息拦截器类
 */
export class MessageInterceptor {
  private options: Required<MessageInterceptorOptions>;
  private messageHistory: string[] = [];
  private currentBuffer: string = '';
  private completeMessages: Set<string> = new Set(); // 存储完整消息的哈希值，用于快速去重
  
  constructor(options?: MessageInterceptorOptions) {
    this.options = {
      dedupWindowSize: 500, // 增加去重窗口大小
      similarityThreshold: 0.9, // 提高相似度阈值，减少误判
      ...options
    };
  }
  
  /**
   * 重置拦截器状态
   */
  reset(): void {
    this.messageHistory = [];
    this.currentBuffer = '';
    this.completeMessages.clear();
  }
  
  /**
   * 计算两个字符串的相似度（基于余弦相似度）
   */
  private calculateSimilarity(str1: string, str2: string): number {
    const charMap1 = new Map<string, number>();
    const charMap2 = new Map<string, number>();
    
    // 统计字符频率
    for (const char of str1) {
      charMap1.set(char, (charMap1.get(char) || 0) + 1);
    }
    
    for (const char of str2) {
      charMap2.set(char, (charMap2.get(char) || 0) + 1);
    }
    
    // 创建字符集合
    const allChars = new Set<string>();
    charMap1.forEach((_, key) => allChars.add(key));
    charMap2.forEach((_, key) => allChars.add(key));
    
    // 计算向量点积
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;
    
    for (const char of Array.from(allChars)) {
      const count1 = charMap1.get(char) || 0;
      const count2 = charMap2.get(char) || 0;
      
      dotProduct += count1 * count2;
      norm1 += count1 * count1;
      norm2 += count2 * count2;
    }
    
    // 计算余弦相似度
    if (norm1 === 0 || norm2 === 0) return 0;
    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
  }
  
  /**
   * 检查字符串是否与历史消息重复
   */
  private isDuplicate(content: string): boolean {
    if (!content || content.length < 3) return false;
    
    // 检查当前buffer中是否有重复（精确匹配）
    if (this.currentBuffer.includes(content)) {
      return true;
    }
    
    // 对于较长的内容，使用更严格的检查
    if (content.length > 20) {
      // 检查当前buffer是否包含在content中（防止重复的长段落）
      if (content.includes(this.currentBuffer) && this.currentBuffer.length > 10) {
        return true;
      }
      
      // 对于长内容，检查是否与历史消息高度相似
      for (const historyMsg of this.messageHistory) {
        // 计算整体相似度
        const similarity = this.calculateSimilarity(content, historyMsg);
        if (similarity >= this.options.similarityThreshold) {
          return true;
        }
      }
    } else {
      // 对于短内容，检查历史消息中是否有高相似度内容
      for (const historyMsg of this.messageHistory) {
        if (historyMsg.length < content.length) continue;
        
        // 滑动窗口检查相似度
        for (let i = 0; i <= historyMsg.length - content.length; i++) {
          const window = historyMsg.slice(i, i + content.length);
          const similarity = this.calculateSimilarity(content, window);
          
          if (similarity >= this.options.similarityThreshold) {
            return true;
          }
        }
      }
    }
    
    return false;
  }
  
  /**
   * 优化消息内容
   */
  private optimizeContent(content: string): string {
    let optimized = content;
    
    // 1. 去除多余空格
    optimized = optimized.replace(/\s+/g, ' ');
    
    // 2. 修复常见标点符号问题
    optimized = optimized.replace(/\s+([.,!?;:])/g, '$1');
    optimized = optimized.replace(/([.,!?;:])\s+/g, '$1 ');
    
    // 3. 确保句子开头大写
    optimized = optimized.replace(/(^|[.!?]\s+)([a-z])/g, (match, p1, p2) => p1 + p2.toUpperCase());
    
    // 4. 去除重复的标点符号
    optimized = optimized.replace(/([.,!?;:])\1+/g, '$1');
    
    return optimized;
  }
  
  /**
   * 拦截并处理AI消息
   * @param content AI发送的原始消息内容
   * @param isDone 是否为最终消息
   * @returns 处理后的消息内容
   */
  intercept(content: string, isDone: boolean): string {
    if (!content) return '';
    
    // 1. 初步优化内容
    let processedContent = this.optimizeContent(content);
    
    // 2. 去重处理
    if (this.isDuplicate(processedContent)) {
      return '';
    }
    
    // 3. 更新buffer
    this.currentBuffer += processedContent;
    
    // 4. 如果是最终消息，更新历史记录和完整消息集合
    if (isDone) {
      // 计算消息哈希值，用于快速去重
      const messageHash = this.currentBuffer;
      
      // 检查完整消息是否已存在
      if (this.completeMessages.has(messageHash)) {
        // 如果已存在，返回空字符串
        this.currentBuffer = '';
        return '';
      }
      
      // 添加到完整消息集合
      this.completeMessages.add(messageHash);
      
      // 保留最近的几条消息用于去重
      this.messageHistory.push(this.currentBuffer);
      if (this.messageHistory.length > 5) {
        this.messageHistory.shift();
      }
      
      // 清空buffer
      this.currentBuffer = '';
    }
    
    // 5. 限制buffer大小
    if (this.currentBuffer.length > this.options.dedupWindowSize) {
      this.currentBuffer = this.currentBuffer.slice(-this.options.dedupWindowSize);
    }
    
    return processedContent;
  }
  
  /**
   * 批量处理消息数组
   * @param messages 消息数组
   * @returns 处理后的消息数组
   */
  batchIntercept(messages: string[]): string[] {
    return messages.map(msg => this.intercept(msg, true));
  }
}

// 导出单例实例
export const messageInterceptor = new MessageInterceptor();
