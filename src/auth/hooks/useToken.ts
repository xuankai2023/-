import { useState, useEffect, useCallback } from 'react';
import { tokenStorage } from '../jwt/tokenStorage';
import { refreshToken } from '../jwt/refreshToken';
import { jwtUtils } from '../jwt/jwtUtils';

interface UseTokenResult {
  accessToken: string | null;
  refreshToken: string | null;
  isTokenValid: boolean;
  isLoading: boolean;
  error: string | null;
  refreshAccessToken: () => Promise<boolean>;
  clearTokens: () => void;
  hasTokens: () => boolean;
}

/**
 * 令牌管理Hook
 * 提供令牌获取、刷新、验证和清除功能
 */
export const useToken = (): UseTokenResult => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshTokenState, setRefreshTokenState] = useState<string | null>(null);
  const [isTokenValid, setIsTokenValid] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 加载存储的令牌
  useEffect(() => {
    const loadTokens = () => {
      try {
        const storedAccessToken = tokenStorage.getAccessToken();
        const storedRefreshToken = tokenStorage.getRefreshToken();
        
        setAccessToken(storedAccessToken);
        setRefreshTokenState(storedRefreshToken);
        
        // 验证访问令牌
        if (storedAccessToken) {
          const verifyResult = jwtUtils.verifyToken(storedAccessToken);
          setIsTokenValid(verifyResult.isValid);
        } else {
          setIsTokenValid(false);
        }
      } catch (err) {
        console.error('加载令牌失败:', err);
        setError('无法加载令牌');
      } finally {
        setIsLoading(false);
      }
    };

    loadTokens();
  }, []);

  // 刷新访问令牌
  const refreshAccessToken = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await refreshToken();
      
      if (result.success && result.accessToken) {
        setAccessToken(result.accessToken);
        setRefreshTokenState(result.refreshToken || refreshTokenState);
        setIsTokenValid(true);
        return true;
      } else {
        setError(result.error || '刷新令牌失败');
        setIsTokenValid(false);
        return false;
      }
    } catch (err) {
      console.error('刷新令牌过程中发生错误:', err);
      setError('刷新令牌时发生内部错误');
      setIsTokenValid(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [refreshTokenState]);

  // 清除所有令牌
  const clearTokens = useCallback(() => {
    try {
      tokenStorage.clear();
      setAccessToken(null);
      setRefreshTokenState(null);
      setIsTokenValid(false);
      setError(null);
    } catch (err) {
      console.error('清除令牌失败:', err);
      setError('无法清除令牌');
    }
  }, []);

  // 检查令牌是否存在
  const hasTokens = useCallback((): boolean => {
    return tokenStorage.hasTokens();
  }, []);

  return {
    accessToken,
    refreshToken: refreshTokenState,
    isTokenValid,
    isLoading,
    error,
    refreshAccessToken,
    clearTokens,
    hasTokens
  };
};

export default useToken;