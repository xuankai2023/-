import { useState, useCallback } from 'react';
import { authApiService, LoginCredentials } from '../services/authapi';

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

  // 登录功能
  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authApiService.login(credentials);
      
      if (response.success && response.data?.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return true;
      } else {
        setError(response.error || '登录失败');
        setIsAuthenticated(false);
        setUser(null);
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败');
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
      await authApiService.logout();
      
      // 清除状态
      setIsAuthenticated(false);
      setUser(null);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : '注销失败');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 检查认证状态
  const checkAuth = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const isAuth = await authApiService.checkAuth();
      
      if (isAuth) {
        const userInfo = await authApiService.getCurrentUser();
        setUser(userInfo);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      
      return isAuth;
    } catch (err) {
      setError(err instanceof Error ? err.message : '检查认证状态失败');
      setIsAuthenticated(false);
      setUser(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

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