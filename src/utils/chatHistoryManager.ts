// 聊天历史记录管理工具

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export interface ChatHistoryItem {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  messageCount: number;
}

const STORAGE_KEY = 'ai_chat_history';
const MAX_HISTORY_COUNT = 100; // 最多保存100条历史记录

// 生成对话标题（基于第一条用户消息）
const generateTitle = (messages: Message[]): string => {
  const firstUserMessage = messages.find(msg => msg.sender === 'user');
  if (!firstUserMessage) {
    return '新对话';
  }
  
  const content = firstUserMessage.content.trim();
  // 如果内容超过30个字符，截断并添加省略号
  if (content.length > 30) {
    return content.substring(0, 30) + '...';
  }
  return content;
};

// 保存历史记录
export const saveChatHistory = (messages: Message[]): string | null => {
  if (messages.length === 0) {
    return null;
  }

  try {
    const historyId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const title = generateTitle(messages);
    const now = Date.now();

    const historyItem: ChatHistoryItem = {
      id: historyId,
      title,
      messages: messages.map(msg => ({
        ...msg,
        timestamp: msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp)
      })),
      createdAt: now,
      updatedAt: now,
      messageCount: messages.length
    };

    // 获取所有历史记录
    const allHistory = getAllChatHistory();
    
    // 检查是否已存在相同的对话（基于第一条消息）
    const existingIndex = allHistory.findIndex(
      item => item.messages.length > 0 && 
      item.messages[0].content === messages[0]?.content &&
      item.messages[0].sender === messages[0]?.sender
    );

    if (existingIndex !== -1) {
      // 更新现有记录
      const existing = allHistory[existingIndex];
      existing.messages = historyItem.messages;
      existing.updatedAt = now;
      existing.messageCount = messages.length;
      existing.title = title;
      allHistory[existingIndex] = existing;
    } else {
      // 添加新记录
      allHistory.unshift(historyItem);
      
      // 限制历史记录数量
      if (allHistory.length > MAX_HISTORY_COUNT) {
        allHistory.splice(MAX_HISTORY_COUNT);
      }
    }

    // 保存到 localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allHistory));
    
    return existingIndex !== -1 ? allHistory[existingIndex].id : historyId;
  } catch (error) {
    console.error('保存聊天历史失败:', error);
    return null;
  }
};

// 获取所有历史记录
export const getAllChatHistory = (): ChatHistoryItem[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }

    const history = JSON.parse(stored) as ChatHistoryItem[];
    
    // 转换 timestamp 为 Date 对象
    return history.map(item => ({
      ...item,
      messages: item.messages.map(msg => ({
        ...msg,
        timestamp: msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp)
      }))
    }));
  } catch (error) {
    console.error('获取聊天历史失败:', error);
    return [];
  }
};

// 根据ID获取历史记录
export const getChatHistoryById = (id: string): ChatHistoryItem | null => {
  try {
    const allHistory = getAllChatHistory();
    const item = allHistory.find(h => h.id === id);
    return item || null;
  } catch (error) {
    console.error('获取聊天历史失败:', error);
    return null;
  }
};

// 删除历史记录
export const deleteChatHistory = (id: string): boolean => {
  try {
    const allHistory = getAllChatHistory();
    const filtered = allHistory.filter(h => h.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('删除聊天历史失败:', error);
    return false;
  }
};

// 清空所有历史记录
export const clearAllChatHistory = (): boolean => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('清空聊天历史失败:', error);
    return false;
  }
};

// 更新历史记录
export const updateChatHistory = (id: string, messages: Message[]): boolean => {
  try {
    const allHistory = getAllChatHistory();
    const index = allHistory.findIndex(h => h.id === id);
    
    if (index === -1) {
      return false;
    }

    const title = generateTitle(messages);
    allHistory[index] = {
      ...allHistory[index],
      messages: messages.map(msg => ({
        ...msg,
        timestamp: msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp)
      })),
      updatedAt: Date.now(),
      messageCount: messages.length,
      title
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(allHistory));
    return true;
  } catch (error) {
    console.error('更新聊天历史失败:', error);
    return false;
  }
};

