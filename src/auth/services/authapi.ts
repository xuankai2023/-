import { jwtUtils } from '../jwt/jwtUtils';
import { tokenStorage } from '../jwt/tokenStorage';
import { jwtConfig } from '../config';
import { authApi, type User as ApiUser } from '../../api/auth';

// 定义API响应类型
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// 定义认证相关的类型
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    username: string;
    fullName: string;
    email?: string;
    avatar?: string;
    roles: string[];
  };
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken?: string;
}

// 模拟API延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 模拟用户数据库（本地环境使用）
const MOCK_USERS = [
  {
    id: '1',
    username: 'admin',
    password: '123456', // 实际项目中应该使用哈希密码
    fullName: '管理员',
    email: 'admin@example.com',
    avatar: '/avatars/admin.svg',
    roles: ['admin', 'user']
  },
  {
    id: '2',
    username: 'user',
    password: 'user123',
    fullName: '普通用户',
    email: 'user@example.com',
    avatar: '/avatars/user.svg',
    roles: ['user']
  }
];

// 认证API服务类
class AuthApiService {
  private jwtUtils: typeof jwtUtils;
  
  constructor() {
    this.jwtUtils = jwtUtils;
  }

  /**
   * 用户登录
   * @param credentials 登录凭证
   * @returns 认证响应
   */
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await authApi.login(credentials);
      
      if (!response.access_token) {
        return {
          success: false,
          error: '登录失败，未获取到访问令牌'
        };
      }

      localStorage.setItem('token', response.access_token);
      
      const userInfo = await authApi.getCurrentUser();
      
      if (!userInfo) {
        return {
          success: false,
          error: '获取用户信息失败'
        };
      }

      const user = {
        id: userInfo.id,
        username: userInfo.email,
        fullName: userInfo.full_name,
        email: userInfo.email,
        avatar: userInfo.avatar,
        roles: userInfo.is_superuser ? ['admin', 'user'] : ['user']
      };

      // 保存 token 和用户信息到本地存储
      tokenStorage.setAccessToken(response.access_token);
      tokenStorage.setRefreshToken(response.access_token); // 使用相同的 token 作为 refresh token（Mock 数据）
      tokenStorage.setUser(user);
      
      // 同时保存到 localStorage（兼容旧代码）
      localStorage.setItem('token', response.access_token);
      
      return {
        success: true,
        data: {
          accessToken: response.access_token,
          refreshToken: response.access_token,
          user
        }
      };
    } catch (error: any) {
      console.error('登录失败:', error);
      return {
        success: false,
        error: error?.message || '登录过程中发生错误'
      };
    }
  }

  /**
   * 用户注销
   * @returns 操作结果
   */
  async logout(): Promise<ApiResponse<void>> {
    try {
      // 清除存储的令牌和用户信息
      tokenStorage.clear();
      
      return {
        success: true
      };
    } catch (error) {
      console.error('注销失败:', error);
      return {
        success: false,
        error: '注销过程中发生错误'
      };
    }
  }

  /**
   * 刷新访问令牌
   * @returns 新的令牌
   */
  async refreshToken(): Promise<ApiResponse<RefreshTokenResponse>> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return {
          success: false,
          error: '没有可用的访问令牌'
        };
      }

      const userInfo = await authApi.testToken();
      if (!userInfo) {
        tokenStorage.clear();
        return {
          success: false,
          error: '令牌验证失败'
        };
      }

      return {
        success: true,
        data: {
          accessToken: token,
          refreshToken: token
        }
      };
    } catch (error: any) {
      console.error('刷新令牌失败:', error);
      tokenStorage.clear();
      return {
        success: false,
        error: error?.message || '刷新令牌过程中发生错误'
      };
    }
  }

  /**
   * 验证当前用户是否已认证
   * @returns 认证状态
   */
  async checkAuth(): Promise<boolean> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return false;
      }
      
      // 使用 Mock 数据时，直接验证 token 是否存在
      // 避免每次路由切换都调用 API
      try {
        await authApi.testToken();
        return true;
      } catch (error: any) {
        // 如果是后端服务器未运行，检查本地 token 是否有效
        if (error?.isBackendUnavailable || error?.code === 'ECONNREFUSED' || error?.message) {
          // 使用 Mock 数据时，如果 token 存在就认为已认证
          // 这样可以避免每次路由切换都弹出登录框
          const tokenStorage = require('../jwt/tokenStorage').tokenStorage;
          const user = tokenStorage.getUser();
          return !!user;
        }
        throw error;
      }
    } catch (error: any) {
      console.error('验证认证状态失败:', error);
      // 只有在明确错误时才清除 token
      if (error?.message && !error.message.includes('用户名或密码错误')) {
        localStorage.removeItem('token');
      }
      return false;
    }
  }

  /**
   * 获取当前用户信息
   * @returns 用户信息
   */
  async getCurrentUser() {
    try {
      const userInfo = await authApi.getCurrentUser();
      
      if (!userInfo) {
        return null;
      }

      const user = {
        id: userInfo.id,
        username: userInfo.email,
        fullName: userInfo.full_name,
        email: userInfo.email,
        avatar: userInfo.avatar,
        roles: userInfo.is_superuser ? ['admin', 'user'] : ['user']
      };

      tokenStorage.setUser(user);
      return user;
    } catch (error: any) {
      // 如果是后端服务器未运行，静默处理，不显示错误
      if (error?.isBackendUnavailable || error?.code === 'ECONNREFUSED') {
        console.warn('后端服务器未运行，无法获取用户信息');
        return null;
      }
      console.error('获取用户信息失败:', error);
      return null;
    }
  }

  /**
   * 获取用户权限
   * @returns 用户权限列表
   */
  async getPermissions(): Promise<string[]> {
    try {
      const user = await this.getCurrentUser();
      return user?.roles || [];
    } catch (error) {
      console.error('获取权限失败:', error);
      return [];
    }
  }
}

// 导出单例
export const authApiService = new AuthApiService();

// 导出工具函数
export const login = (credentials: LoginCredentials) => authApiService.login(credentials);
export const logout = () => authApiService.logout();
export const refreshToken = () => authApiService.refreshToken();
export const checkAuth = () => authApiService.checkAuth();
export const getCurrentUser = () => authApiService.getCurrentUser();
export const getPermissions = () => authApiService.getPermissions();