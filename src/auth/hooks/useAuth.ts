import { useState, useCallback } from 'react';
import { authApiService, LoginCredentials } from '../services/authapi';
import { tokenStorage } from '../jwt/tokenStorage';
import { useToken } from './useToken';

interface UseAuthResult {
  isAuthenticated: boolean;
  user: any | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => Promise<boolean>;
  checkAuth: () => Promise<boolean>;
}

/**
 * 身份验证Hook
 * 提供登录、注销、检查认证状态等功能
 */
export const useAuth = (): UseAuthResult => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const { isTokenValid, clearTokens } = useToken();

  // 登录功能
  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authApiService.login(credentials);
      
      if (response.success && response.data) {
        setIsAuthenticated(true);
        setUser(response.data.user);
        return true;
      } else {
        setError(response.error || '登录失败');
        setIsAuthenticated(false);
        setUser(null);
        return false;
      }
    } catch (err) {
      console.error('登录过程中发生错误:', err);
      setError('登录时发生内部错误');
      setIsAuthenticated(false);
      setUser(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 注销功能
  const logout = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // 调用API注销
      const response = await authApiService.logout();
      
      // 无论API调用结果如何，都清除本地令牌和状态
      clearTokens();
      setIsAuthenticated(false);
      setUser(null);
      
      return response.success;
    } catch (err) {
      console.error('注销过程中发生错误:', err);
      // 即使出错，也强制清除本地状态
      clearTokens();
      setIsAuthenticated(false);
      setUser(null);
      return true; // 返回true表示状态已清除
    } finally {
      setIsLoading(false);
    }
  }, [clearTokens]);

  // 检查认证状态
  const checkAuth = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // 首先检查令牌是否有效
      if (!isTokenValid) {
        setIsAuthenticated(false);
        setUser(null);
        return false;
      }
      
      // 调用API检查认证状态
      const isAuth = await authApiService.checkAuth();
      
      if (isAuth) {
        // 获取用户信息
        const userInfo = tokenStorage.getUser();
        setUser(userInfo);
        setIsAuthenticated(true);
      } else {
        clearTokens();
        setUser(null);
        setIsAuthenticated(false);
      }
      
      return isAuth;
    } catch (err) {
      console.error('检查认证状态失败:', err);
      setError('无法验证认证状态');
      setIsAuthenticated(false);
      setUser(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isTokenValid, clearTokens]);

  return {
    isAuthenticated,
    user,
    isLoading,
    error,
    login,
    logout,
    checkAuth
  };
};

export default useAuth;