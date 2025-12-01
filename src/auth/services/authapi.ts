import { jwtUtils } from '../jwt/jwtUtils';
import { tokenStorage } from '../jwt/tokenStorage';
import { jwtConfig } from '../config';

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
      // 模拟API请求延迟
      await delay(500);
      
      // 在本地环境中验证用户
      const user = MOCK_USERS.find(
        u => u.username === credentials.username && u.password === credentials.password
      );
      
      if (!user) {
        return {
          success: false,
          error: '用户名或密码错误'
        };
      }
      
      // 生成JWT令牌
      // 注意：根据jwtUtils的实现，我们需要传递包含role和permissions的用户对象
      const accessToken = this.jwtUtils.createToken({
        id: user.id,
        username: user.username,
        role: user.roles && user.roles.length > 0 ? user.roles[0] : 'user',
        permissions: user.roles || []
      });
      
      const refreshToken = this.jwtUtils.createRefreshToken(user.id);
      
      // 存储令牌和用户信息
      tokenStorage.setAccessToken(accessToken);
      tokenStorage.setRefreshToken(refreshToken);
      tokenStorage.setUser(user);
      
      return {
        success: true,
        data: {
          accessToken,
          refreshToken,
          user
        }
      };
    } catch (error) {
      console.error('登录失败:', error);
      return {
        success: false,
        error: '登录过程中发生错误'
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
      const refreshToken = tokenStorage.getRefreshToken();
      
      if (!refreshToken) {
        return {
          success: false,
          error: '没有可用的刷新令牌'
        };
      }
      
      // 验证刷新令牌
      const result = this.jwtUtils.verifyToken(refreshToken);
      
      if (!result.isValid) {
        tokenStorage.clear();
        localStorage.removeItem('currentUser');
        return {
          success: false,
          error: '刷新令牌无效'
        };
      }
      
      // 获取用户ID
      const payload = this.jwtUtils.parseToken(refreshToken);
      const userId = payload?.sub;
      
      if (!userId) {
        return {
          success: false,
          error: '无法从刷新令牌中获取用户信息'
        };
      }
      
      // 查找用户
      const user = MOCK_USERS.find(u => u.id === userId);
      
      if (!user) {
        return {
          success: false,
          error: '用户不存在'
        };
      }
      
      // 生成新的访问令牌
      // 注意：根据jwtUtils的实现，我们需要传递包含role和permissions的用户对象
      const newAccessToken = this.jwtUtils.createToken({
        id: user.id,
        username: user.username,
        role: user.roles && user.roles.length > 0 ? user.roles[0] : 'user',
        permissions: user.roles || []
      });
      
      // 可选：生成新的刷新令牌
      const newRefreshToken = this.jwtUtils.createRefreshToken(user.id);
      
      // 更新存储
      tokenStorage.setAccessToken(newAccessToken);
      tokenStorage.setRefreshToken(newRefreshToken);
      
      return {
        success: true,
        data: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken
        }
      };
    } catch (error) {
      console.error('刷新令牌失败:', error);
      return {
        success: false,
        error: '刷新令牌过程中发生错误'
      };
    }
  }

  /**
   * 验证当前用户是否已认证
   * @returns 认证状态
   */
  async checkAuth(): Promise<boolean> {
    try {
      const accessToken = tokenStorage.getAccessToken();
      
      if (!accessToken) {
        return false;
      }
      
      // 验证访问令牌（verifyToken返回对象，我们需要检查isValid属性）
      const result = this.jwtUtils.verifyToken(accessToken);
      return result.isValid;
    } catch (error) {
      console.error('验证认证状态失败:', error);
      return false;
    }
  }

  /**
   * 获取当前用户信息
   * @returns 用户信息
   */
  async getCurrentUser() {
    try {
      console.log('正在获取当前用户信息');
      
      // 从tokenStorage中获取用户信息
      let user = tokenStorage.getUser();
      console.log('从tokenStorage获取的用户:', user);
      
      if (!user) {
        // 如果存储中没有，尝试从localStorage直接获取
        const localStorageUser = localStorage.getItem('currentUser');
        if (localStorageUser) {
          try {
            user = JSON.parse(localStorageUser);
            console.log('从localStorage直接获取的用户:', user);
            tokenStorage.setUser(user);
            return user;
          } catch (parseError) {
            console.warn('解析localStorage中的用户信息失败:', parseError);
          }
        }
        
        // 如果localStorage中也没有，尝试从令牌中解析
        const accessToken = tokenStorage.getAccessToken();
        console.log('尝试从令牌解析用户信息，令牌存在:', !!accessToken);
        
        if (accessToken) {
          // 首先验证令牌是否有效
          const tokenResult = this.jwtUtils.verifyToken(accessToken);
          console.log('令牌验证结果:', tokenResult);
          
          if (tokenResult.isValid) {
            const payload = this.jwtUtils.parseToken(accessToken);
            console.log('令牌解析结果:', payload);
            
            if (payload?.sub) {
              const foundUser = MOCK_USERS.find(u => u.id === payload.sub);
              if (foundUser) {
                console.log('找到匹配的用户:', foundUser);
                // 将用户信息存入tokenStorage
                tokenStorage.setUser(foundUser);
                return foundUser;
              }
            }
          }
        }
        
        console.log('无法获取用户信息');
        return null;
      }
      
      return user;
    } catch (error) {
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