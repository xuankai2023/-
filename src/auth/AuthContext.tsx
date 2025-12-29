import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { authApiService, LoginCredentials } from './services/authapi';
import { tokenStorage } from './jwt/tokenStorage';
import { jwtUtils } from './jwt/jwtUtils';

interface User {
    id: string;
    username: string;
    fullName: string;
    email?: string;
    avatar?: string;
    roles: string[];
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    isLoading: boolean;
    error: string | null;
    login: (credentials: LoginCredentials) => Promise<boolean>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isInitialized, setIsInitialized] = useState<boolean>(false);

    // 应用启动时检查本地令牌（只执行一次）
    useEffect(() => {
        let isMounted = true;

        const initAuth = async () => {
            try {
                setIsLoading(true);

                // 首先检查localStorage中是否有令牌和用户信息
                const accessToken = tokenStorage.getAccessToken();
                const refreshToken = tokenStorage.getRefreshToken();
                const storedUser = tokenStorage.getUser();

                // 优先使用本地存储的用户信息（快速恢复认证状态）
                if (storedUser && accessToken) {
                    // 验证 token 是否有效（本地验证，不调用API）
                    const tokenResult = jwtUtils.verifyToken(accessToken);
                    
                    if (tokenResult.isValid && isMounted) {
                        // Token 有效，直接使用本地存储的用户信息恢复认证状态
                        setUser(storedUser);
                        setIsAuthenticated(true);
                        setIsLoading(false);
                        setIsInitialized(true);
                        return; // 快速返回，避免不必要的 API 调用
                    }
                }

                // 如果没有本地用户信息或 token 无效，尝试从 token 中恢复
                if (accessToken) {
                    const tokenResult = jwtUtils.verifyToken(accessToken);

                    if (tokenResult.isValid) {
                        // 令牌有效，尝试从 token 中解析用户信息
                        const userFromToken = jwtUtils.getUserFromToken(accessToken);
                        if (userFromToken && isMounted) {
                            // 从模拟用户中查找完整信息
                            const mockUsers = [
                                {
                                    id: '1',
                                    username: 'admin',
                                    fullName: '管理员',
                                    email: 'admin@example.com',
                                    avatar: '/images/png/admin.png',
                                    roles: ['admin', 'user']
                                },
                                {
                                    id: '2',
                                    username: 'user',
                                    fullName: '普通用户',
                                    email: 'user@example.com',
                                    avatar: '/images/png/admin.png',
                                    roles: ['user']
                                }
                            ];

                            const foundUser = mockUsers.find(u => u.id === userFromToken.id);
                            if (foundUser && isMounted) {
                                setUser(foundUser);
                                setIsAuthenticated(true);
                                tokenStorage.setUser(foundUser); // 保存用户信息到本地存储
                                setIsLoading(false);
                                setIsInitialized(true);
                                return;
                            }
                        }

                        // 如果无法从 token 解析，尝试调用 API（可选，不阻塞）
                        try {
                            const userInfo = await authApiService.getCurrentUser();
                            if (userInfo && isMounted) {
                                setUser(userInfo);
                                setIsAuthenticated(true);
                                tokenStorage.setUser(userInfo); // 保存用户信息到本地存储
                                return;
                            }
                        } catch (error) {
                            // API调用失败，但不影响已恢复的认证状态
                            console.warn('获取用户信息失败，使用本地存储:', error);
                        }
                    } else if (refreshToken) {
                        // 访问令牌过期，尝试使用刷新令牌
                        try {
                            const refreshResult = await authApiService.refreshToken();
                            if (refreshResult.success && isMounted) {
                                const userInfo = await authApiService.getCurrentUser();
                                if (userInfo) {
                                    setUser(userInfo);
                                    setIsAuthenticated(true);
                                    tokenStorage.setUser(userInfo);
                                }
                            }
                        } catch (error) {
                            // 刷新失败，清除无效的令牌
                            if (isMounted) {
                                tokenStorage.clear();
                            }
                        }
                    } else {
                        // 令牌无效且无刷新令牌，清除
                        if (isMounted) {
                            tokenStorage.clear();
                        }
                    }
                }
            } catch (err) {
                console.error('初始化认证失败:', err);
                // 只有在明确错误时才清除 token，避免误清除
                // 不清除 token，保持用户已登录状态
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                    setIsInitialized(true);
                }
            }
        };

        initAuth();

        return () => {
            isMounted = false;
        };
    }, []);

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
            const errorMsg = err instanceof Error ? err.message : '登录失败';
            setError(errorMsg);
            setIsAuthenticated(false);
            setUser(null);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(async (): Promise<void> => {
        try {
            setIsLoading(true);
            setError(null);

            await authApiService.logout();
            // 确保清除 localStorage 中的所有令牌和用户信息
            tokenStorage.clear();

            setIsAuthenticated(false);
            setUser(null);
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : '注销失败';
            setError(errorMsg);
        } finally {
            setIsLoading(false);
        }
    }, []);

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
            const errorMsg = err instanceof Error ? err.message : '检查认证状态失败';
            setError(errorMsg);
            setIsAuthenticated(false);
            setUser(null);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 在应用初始化期间显示加载状态，防止路由闪烁和重复登录提示
    if (!isInitialized) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontSize: '16px',
                color: '#666'
            }}>
                初始化中...
            </div>
        );
    }

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                user,
                isLoading,
                error,
                login,
                logout,
                checkAuth,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within AuthProvider');
    }
    return context;
};

export default AuthContext;
