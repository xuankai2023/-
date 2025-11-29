import { authApiService } from './services/authapi';
import { tokenStorage } from './jwt/tokenStorage';
import { jwtUtils } from './jwt/jwtUtils';
import { refreshToken } from './jwt/refreshToken';
import { permissionsConfig } from './config';

// React Admin认证提供者接口
export const authProvider = {
  /**
   * 用户登录
   * @param params 包含用户名和密码的对象
   * @returns Promise 解析为成功时包含{ redirectTo }的对象，失败时包含{ error }的对象
   */
  login: async (params: { username: string; password: string }) => {
    try {
      const response = await authApiService.login({
        username: params.username,
        password: params.password,
      });

      if (response.success && response.data) {
        // 登录成功，重定向到默认页面
        return { redirectTo: '/' };
      } else {
        // 登录失败
        return { error: response.error || '登录失败，请检查用户名和密码' };
      }
    } catch (error) {
      console.error('登录过程中发生错误:', error);
      return { error: '登录时发生内部错误，请稍后再试' };
    }
  },

  /**
   * 用户注销
   * @returns Promise 解析为成功时包含{ redirectTo }的对象
   */
  logout: async () => {
    try {
      // 调用API注销
      await authApiService.logout();
    } catch (error) {
      console.error('注销API调用失败:', error);
    } finally {
      // 无论API调用结果如何，都清除本地令牌
      tokenStorage.clear();
      // 重定向到登录页面
      return { redirectTo: '/login' };
    }
  },

  /**
   * 检查认证状态
   * @returns Promise 认证有效时解析，无效时拒绝
   */
  checkAuth: async () => {
    try {
      const accessToken = tokenStorage.getAccessToken();
      
      if (!accessToken) {
        return Promise.reject();
      }

      // 检查令牌是否有效
      const { isValid } = jwtUtils.verifyToken(accessToken);
      
      if (!isValid) {
        // 尝试刷新令牌
        const refreshSuccess = await refreshToken();
        
        if (!refreshSuccess.success) {
          // 刷新失败，清除令牌并拒绝
          tokenStorage.clear();
          return Promise.reject();
        }
      }

      // 令牌有效，认证通过
      return Promise.resolve();
    } catch (error) {
      console.error('认证检查失败:', error);
      tokenStorage.clear();
      return Promise.reject();
    }
  },

  /**
   * 检查API错误
   * @param error API错误对象
   * @returns Promise 处理401/403错误，其他错误保持不变
   */
  checkError: async (error: { status: number }) => {
    const status = error.status;
    
    if (status === 401) {
      // 未授权，清除令牌并重定向到登录
      tokenStorage.clear();
      return Promise.reject({ redirectTo: '/login', message: '登录已过期，请重新登录' });
    }
    
    if (status === 403) {
      // 禁止访问，返回权限错误
      return Promise.reject({ message: '您没有权限执行此操作' });
    }
    
    // 其他错误保持不变
    return Promise.resolve();
  },

  /**
   * 获取用户权限
   * @returns Promise 解析为权限数组或角色字符串
   */
  getPermissions: async () => {
    try {
      const user = tokenStorage.getUser();
      
      if (!user) {
        return Promise.reject();
      }

      // 优先返回用户权限数组
      if (Array.isArray(user.permissions) && user.permissions.length > 0) {
        return user.permissions;
      }

      // 返回用户角色
      if (user.role) {
        return user.role;
      }

      // 返回角色数组
      if (Array.isArray(user.roles) && user.roles.length > 0) {
        return user.roles;
      }

      // 默认返回访客权限
      return ['guest'];
    } catch (error) {
      console.error('获取权限失败:', error);
      return Promise.reject();
    }
  },

  /**
   * 获取用户身份信息
   * @returns Promise 解析为包含id, name, avatar等字段的对象
   */
  getIdentity: async () => {
    try {
      const user = tokenStorage.getUser();
      
      if (!user) {
        return Promise.reject();
      }

      // 构建身份信息对象
      const identity = {
        id: user.id || user._id || 'unknown',
        fullName: user.name || user.fullName || user.username || '用户',
        avatar: user.avatar || user.profilePicture,
        email: user.email,
        role: user.role,
      };

      return identity;
    } catch (error) {
      console.error('获取用户身份失败:', error);
      return Promise.reject();
    }
  },

  /**
   * 可选：刷新令牌
   * 一些版本的React Admin可能支持此方法
   */
  refreshTokens: async () => {
    try {
      const result = await refreshToken();
      
      if (result.success) {
        return Promise.resolve();
      } else {
        return Promise.reject(result.error);
      }
    } catch (error) {
      console.error('刷新令牌失败:', error);
      return Promise.reject(error);
    }
  },
};

export default authProvider;