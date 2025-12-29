// import { api } from '../utils/request';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  is_superuser: boolean;
  is_active: boolean;
  avatar?: string;
  phone?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserListResponse {
  data: User[];
  count: number;
}

export interface PasswordUpdate {
  current_password: string;
  new_password: string;
}

export interface SignupData {
  email: string;
  password: string;
  full_name: string;
}

// Mock 数据
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    full_name: '管理员',
    is_superuser: true,
    is_active: true,
    avatar: '/avatars/admin.svg',
    phone: '13800138000',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    email: 'user@example.com',
    full_name: '普通用户',
    is_superuser: false,
    is_active: true,
    avatar: '/avatars/user.svg',
    phone: '13800138001',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

// 模拟延迟
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

const API_PREFIX = '/v1';

export const authApi = {
  // 使用 Mock 数据 - 已注释真实 API 调用
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    await delay();
    // 真实 API 调用已注释
    // const formData = new FormData();
    // formData.append('username', credentials.username);
    // formData.append('password', credentials.password);
    // return api.post<LoginResponse>(`${API_PREFIX}/login/access-token`, formData, {
    //   headers: {
    //     'Content-Type': 'multipart/form-data',
    //   },
    // });
    
    // Mock 数据
    const user = MOCK_USERS.find(u => u.email === credentials.username || u.email === credentials.username);
    if (!user || credentials.password !== '123456') {
      throw new Error('用户名或密码错误');
    }
    return {
      access_token: `mock_token_${user.id}_${Date.now()}`,
      token_type: 'bearer',
    };
  },

  testToken: async (): Promise<User> => {
    await delay();
    // 真实 API 调用已注释
    // return api.post<User>(`${API_PREFIX}/login/test-token`);
    
    // Mock 数据 - 返回第一个用户
    return MOCK_USERS[0];
  },

  getCurrentUser: async (): Promise<User> => {
    await delay();
    // 真实 API 调用已注释
    // return api.get<User>(`${API_PREFIX}/users/me`);
    
    // Mock 数据 - 返回第一个用户
    return MOCK_USERS[0];
  },

  updateCurrentUser: async (data: Partial<User>): Promise<User> => {
    await delay();
    // 真实 API 调用已注释
    // return api.patch<User>(`${API_PREFIX}/users/me`, data);
    
    // Mock 数据
    const user = { ...MOCK_USERS[0], ...data };
    return user;
  },

  updatePassword: async (data: PasswordUpdate): Promise<{ message: string }> => {
    await delay();
    // 真实 API 调用已注释
    // return api.patch<{ message: string }>(`${API_PREFIX}/users/me/password`, data);
    
    // Mock 数据
    return { message: '密码更新成功' };
  },

  deleteCurrentUser: async (): Promise<{ message: string }> => {
    await delay();
    // 真实 API 调用已注释
    // return api.delete<{ message: string }>(`${API_PREFIX}/users/me`);
    
    // Mock 数据
    return { message: '用户删除成功' };
  },

  signup: async (data: SignupData): Promise<User> => {
    await delay();
    // 真实 API 调用已注释
    // return api.post<User>(`${API_PREFIX}/users/signup`, data);
    
    // Mock 数据
    const newUser: User = {
      id: String(MOCK_USERS.length + 1),
      email: data.email,
      full_name: data.full_name,
      is_superuser: false,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    MOCK_USERS.push(newUser);
    return newUser;
  },

  getUserList: async (params?: { skip?: number; limit?: number }): Promise<UserListResponse> => {
    await delay();
    // 真实 API 调用已注释
    // return api.get<UserListResponse>(`${API_PREFIX}/users/`, { params });
    
    // Mock 数据
    const skip = params?.skip || 0;
    const limit = params?.limit || 10;
    const data = MOCK_USERS.slice(skip, skip + limit);
    return {
      data,
      count: MOCK_USERS.length,
    };
  },

  getUserById: async (userId: string): Promise<User> => {
    await delay();
    // 真实 API 调用已注释
    // return api.get<User>(`${API_PREFIX}/users/${userId}`);
    
    // Mock 数据
    const user = MOCK_USERS.find(u => u.id === userId);
    if (!user) {
      throw new Error('用户不存在');
    }
    return user;
  },

  updateUser: async (userId: string, data: Partial<User>): Promise<User> => {
    await delay();
    // 真实 API 调用已注释
    // return api.patch<User>(`${API_PREFIX}/users/${userId}`, data);
    
    // Mock 数据
    const userIndex = MOCK_USERS.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('用户不存在');
    }
    MOCK_USERS[userIndex] = { ...MOCK_USERS[userIndex], ...data };
    return MOCK_USERS[userIndex];
  },

  deleteUser: async (userId: string): Promise<{ message: string }> => {
    await delay();
    // 真实 API 调用已注释
    // return api.delete<{ message: string }>(`${API_PREFIX}/users/${userId}`);
    
    // Mock 数据
    const userIndex = MOCK_USERS.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('用户不存在');
    }
    MOCK_USERS.splice(userIndex, 1);
    return { message: '用户删除成功' };
  },

  passwordRecovery: async (email: string): Promise<{ message: string }> => {
    await delay();
    // 真实 API 调用已注释
    // return api.post<{ message: string }>(`${API_PREFIX}/password-recovery/${email}`);
    
    // Mock 数据
    return { message: '密码重置邮件已发送' };
  },

  resetPassword: async (data: { token: string; new_password: string }): Promise<{ message: string }> => {
    await delay();
    // 真实 API 调用已注释
    // return api.post<{ message: string }>(`${API_PREFIX}/reset-password/`, data);
    
    // Mock 数据
    return { message: '密码重置成功' };
  },
};

