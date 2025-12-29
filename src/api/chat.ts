// import { api } from '../utils/request';

export interface ChatSession {
  id: string;
  user_id: string;
  pet_id?: string;
  title: string;
  message_count: number;
  created_at: string;
  updated_at?: string;
}

export interface ChatSessionListResponse {
  data: ChatSession[];
  count: number;
}

export interface ChatSessionCreateData {
  pet_id?: string;
  title?: string;
}

export interface ChatSessionListParams {
  skip?: number;
  limit?: number;
  user_id?: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  model?: string;
  created_at?: string;
}

export interface ChatMessageListResponse {
  data: ChatMessage[];
  count: number;
}

export interface ChatMessageCreateData {
  session_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  model?: string;
}

// Mock 数据存储
let mockChatSessions: ChatSession[] = [
  {
    id: '1',
    user_id: '1',
    title: '关于宠物健康咨询',
    message_count: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    user_id: '1',
    pet_id: 'PET001',
    title: '疫苗相关问题',
    message_count: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

let mockChatMessages: ChatMessage[] = [
  {
    id: '1',
    session_id: '1',
    role: 'user',
    content: '我的宠物最近食欲不振，应该怎么办？',
    timestamp: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    session_id: '1',
    role: 'assistant',
    content: '宠物食欲不振可能有多种原因，建议您观察宠物的其他症状，如精神状态、体温等。如果持续超过24小时，建议尽快就医。',
    timestamp: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
];

// 模拟延迟
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

const API_PREFIX = '/v1';

export const chatApi = {
  // 使用 Mock 数据 - 已注释真实 API 调用
  getChatSessionList: async (params?: ChatSessionListParams): Promise<ChatSessionListResponse> => {
    await delay();
    // 真实 API 调用已注释
    // return api.get<ChatSessionListResponse>(`${API_PREFIX}/chat-sessions/`, { params });
    
    // Mock 数据
    let filteredData = [...mockChatSessions];
    
    // 根据 user_id 过滤
    if (params?.user_id) {
      filteredData = filteredData.filter(session => session.user_id === params.user_id);
    }
    
    // 分页
    const skip = params?.skip || 0;
    const limit = params?.limit || 10;
    const data = filteredData.slice(skip, skip + limit);
    
    return {
      data,
      count: filteredData.length,
    };
  },

  createChatSession: async (data: ChatSessionCreateData): Promise<ChatSession> => {
    await delay();
    // 真实 API 调用已注释
    // return api.post<ChatSession>(`${API_PREFIX}/chat-sessions/`, data);
    
    // Mock 数据
    const newSession: ChatSession = {
      id: `SESSION_${Date.now()}`,
      user_id: '1',
      pet_id: data.pet_id,
      title: data.title || '新对话',
      message_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockChatSessions.push(newSession);
    return newSession;
  },

  getChatSessionById: async (sessionId: string): Promise<ChatSession> => {
    await delay();
    // 真实 API 调用已注释
    // return api.get<ChatSession>(`${API_PREFIX}/chat-sessions/${sessionId}`);
    
    // Mock 数据
    const session = mockChatSessions.find(s => s.id === sessionId);
    if (!session) {
      throw new Error('会话不存在');
    }
    return session;
  },

  updateChatSession: async (sessionId: string, data: Partial<ChatSessionCreateData>): Promise<ChatSession> => {
    await delay();
    // 真实 API 调用已注释
    // return api.patch<ChatSession>(`${API_PREFIX}/chat-sessions/${sessionId}`, data);
    
    // Mock 数据
    const sessionIndex = mockChatSessions.findIndex(s => s.id === sessionId);
    if (sessionIndex === -1) {
      throw new Error('会话不存在');
    }
    mockChatSessions[sessionIndex] = {
      ...mockChatSessions[sessionIndex],
      title: data.title || mockChatSessions[sessionIndex].title,
      pet_id: data.pet_id || mockChatSessions[sessionIndex].pet_id,
      updated_at: new Date().toISOString(),
    };
    return mockChatSessions[sessionIndex];
  },

  deleteChatSession: async (sessionId: string): Promise<{ message: string }> => {
    await delay();
    // 真实 API 调用已注释
    // return api.delete<{ message: string }>(`${API_PREFIX}/chat-sessions/${sessionId}`);
    
    // Mock 数据
    const sessionIndex = mockChatSessions.findIndex(s => s.id === sessionId);
    if (sessionIndex === -1) {
      throw new Error('会话不存在');
    }
    mockChatSessions.splice(sessionIndex, 1);
    // 同时删除该会话的所有消息
    mockChatMessages = mockChatMessages.filter(m => m.session_id !== sessionId);
    return { message: '会话删除成功' };
  },

  updateMessageCount: async (sessionId: string): Promise<ChatSession> => {
    await delay();
    // 真实 API 调用已注释
    // return api.post<ChatSession>(`${API_PREFIX}/chat-sessions/${sessionId}/update-message-count`);
    
    // Mock 数据
    const sessionIndex = mockChatSessions.findIndex(s => s.id === sessionId);
    if (sessionIndex === -1) {
      throw new Error('会话不存在');
    }
    const messageCount = mockChatMessages.filter(m => m.session_id === sessionId).length;
    mockChatSessions[sessionIndex] = {
      ...mockChatSessions[sessionIndex],
      message_count: messageCount,
      updated_at: new Date().toISOString(),
    };
    return mockChatSessions[sessionIndex];
  },

  getChatMessageList: async (params: { session_id: string; skip?: number; limit?: number }): Promise<ChatMessageListResponse> => {
    await delay();
    // 真实 API 调用已注释
    // return api.get<ChatMessageListResponse>(`${API_PREFIX}/chat-messages/`, { params });
    
    // Mock 数据
    let filteredData = mockChatMessages.filter(m => m.session_id === params.session_id);
    
    // 分页
    const skip = params.skip || 0;
    const limit = params.limit || 10;
    const data = filteredData.slice(skip, skip + limit);
    
    return {
      data,
      count: filteredData.length,
    };
  },

  createChatMessage: async (data: ChatMessageCreateData): Promise<ChatMessage> => {
    await delay();
    // 真实 API 调用已注释
    // return api.post<ChatMessage>(`${API_PREFIX}/chat-messages/`, data);
    
    // Mock 数据
    const newMessage: ChatMessage = {
      id: `MESSAGE_${Date.now()}`,
      session_id: data.session_id,
      role: data.role,
      content: data.content,
      timestamp: new Date().toISOString(),
      model: data.model,
      created_at: new Date().toISOString(),
    };
    mockChatMessages.push(newMessage);
    
    // 更新会话的消息数量
    const sessionIndex = mockChatSessions.findIndex(s => s.id === data.session_id);
    if (sessionIndex !== -1) {
      mockChatSessions[sessionIndex].message_count = mockChatMessages.filter(m => m.session_id === data.session_id).length;
      mockChatSessions[sessionIndex].updated_at = new Date().toISOString();
    }
    
    return newMessage;
  },

  getChatMessageById: async (messageId: string): Promise<ChatMessage> => {
    await delay();
    // 真实 API 调用已注释
    // return api.get<ChatMessage>(`${API_PREFIX}/chat-messages/${messageId}`);
    
    // Mock 数据
    const message = mockChatMessages.find(m => m.id === messageId);
    if (!message) {
      throw new Error('消息不存在');
    }
    return message;
  },

  updateChatMessage: async (messageId: string, data: Partial<ChatMessageCreateData>): Promise<ChatMessage> => {
    await delay();
    // 真实 API 调用已注释
    // return api.patch<ChatMessage>(`${API_PREFIX}/chat-messages/${messageId}`, data);
    
    // Mock 数据
    const messageIndex = mockChatMessages.findIndex(m => m.id === messageId);
    if (messageIndex === -1) {
      throw new Error('消息不存在');
    }
    mockChatMessages[messageIndex] = {
      ...mockChatMessages[messageIndex],
      ...data,
    };
    return mockChatMessages[messageIndex];
  },

  deleteChatMessage: async (messageId: string): Promise<{ message: string }> => {
    await delay();
    // 真实 API 调用已注释
    // return api.delete<{ message: string }>(`${API_PREFIX}/chat-messages/${messageId}`);
    
    // Mock 数据
    const messageIndex = mockChatMessages.findIndex(m => m.id === messageId);
    if (messageIndex === -1) {
      throw new Error('消息不存在');
    }
    const deletedMessage = mockChatMessages[messageIndex];
    mockChatMessages.splice(messageIndex, 1);
    
    // 更新会话的消息数量
    const sessionIndex = mockChatSessions.findIndex(s => s.id === deletedMessage.session_id);
    if (sessionIndex !== -1) {
      mockChatSessions[sessionIndex].message_count = mockChatMessages.filter(m => m.session_id === deletedMessage.session_id).length;
      mockChatSessions[sessionIndex].updated_at = new Date().toISOString();
    }
    
    return { message: '消息删除成功' };
  },
};

