import { mockUsers } from '../auth/config';
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
  is_superuser?: boolean;
}

// Convert config users to API user format
const INITIAL_MOCK_USERS: User[] = mockUsers.map(u => ({
  id: u.id,
  email: u.email,
  full_name: u.name,
  is_superuser: u.role === 'admin',
  is_active: true,
  avatar: u.role === 'admin' ? '/avatars/admin.svg' : '/avatars/user.svg',
  phone: '13800138000',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}));

// Mutable state for mock users
const MOCK_USERS: User[] = [...INITIAL_MOCK_USERS];

// 模拟延迟
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

const API_PREFIX = '/api/v1';

export const authApi = {
  // 使用 Mock 数据 - 已注释真实 API 调用
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    await delay();
    // 真实 API 调用已注释 - 支持 JSON 格式（推荐）
    // return api.post<LoginResponse>('/login/access-token', {
    //   username: credentials.username,
    //   password: credentials.password,
    // });

    // Mock 数据验证
    // First, try to find in the config users (primary source for auth in dev)
    const configUser = mockUsers.find(
      u => (u.username === credentials.username || u.email === credentials.username) &&
        u.password === credentials.password
    );

    if (configUser) {
      return {
        access_token: `mock_token_${configUser.id}_${Date.now()}`,
        token_type: 'bearer',
      };
    }

    // Fallback: check dynamic MOCK_USERS (for users created via signup)
    // Note: MOCK_USERS here doesn't store passwords, so this is a limitation of the current mock
    // For newly signed up users, we might accept any password or need a separate creds store.
    // Assuming simple behavior: if not in config, check if email exists in MOCK_USERS
    const dynamicUser = MOCK_USERS.find(u => u.email === credentials.username);
    if (dynamicUser && !mockUsers.find(mu => mu.id === dynamicUser.id)) {
      // Allow login for dynamically created users with a default password for testing
      if (credentials.password === '123456') {
        return {
          access_token: `mock_token_${dynamicUser.id}_${Date.now()}`,
          token_type: 'bearer',
        };
      }
    }

    throw new Error('用户名或密码错误');
  },

  testToken: async (): Promise<User> => {
    await delay();
    // 真实 API 调用已注释
    // return api.post<User>('/login/test-token');

    // Mock 数据 - 返回第一个用户
    return MOCK_USERS[0];
  },

  getCurrentUser: async (): Promise<User> => {
    await delay();
    // 真实 API 调用已注释
    // return api.get<User>('/users/me');

    // Mock 数据 - 返回第一个用户
    return MOCK_USERS[0];
  },

  updateCurrentUser: async (data: Partial<User>): Promise<User> => {
    await delay();
    // 真实 API 调用已注释
    // return api.patch<User>('/users/me', data);

    // Mock 数据
    const user = { ...MOCK_USERS[0], ...data };
    return user;
  },

  updatePassword: async (data: PasswordUpdate): Promise<{ message: string }> => {
    await delay();
    // 真实 API 调用已注释
    // return api.patch<{ message: string }>('/users/me/password', data);

    // Mock 数据
    return { message: '密码更新成功' };
  },

  deleteCurrentUser: async (): Promise<{ message: string }> => {
    await delay();
    // 真实 API 调用已注释
    // return api.delete<{ message: string }>('/users/me');

    // Mock 数据
    return { message: '用户删除成功' };
  },

  signup: async (data: SignupData): Promise<User> => {
    await delay();
    // 真实 API 调用已注释
    // return api.post<User>('/users/signup', data);

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
    // return api.get<UserListResponse>('/users/', { params });

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
    // return api.get<User>(`/users/${userId}`);

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
    // return api.patch<User>(`/users/${userId}`, data);

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
    // return api.delete<{ message: string }>(`/users/${userId}`);

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
    // return api.post<{ message: string }>(`/password-recovery/${email}`);

    // Mock 数据
    return { message: '密码重置邮件已发送' };
  },

  resetPassword: async (data: { token: string; new_password: string }): Promise<{ message: string }> => {
    await delay();
    // 真实 API 调用已注释
    // return api.post<{ message: string }>('/reset-password/', data);

    // Mock 数据
    return { message: '密码重置成功' };
  },
};

