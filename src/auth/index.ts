// 认证系统主入口文件
// 导出所有认证相关的功能模块

// 认证提供者 - React Admin 认证接口实现
export { default as authProvider } from './authProvider';

// 认证相关配置
export * from './config';

// 认证相关钩子
export * from './hooks/useAuth';
export * from './hooks/usePermission';
export * from './hooks/useToken';

// JWT 相关工具
export { jwtUtils } from './jwt/jwtUtils';
export type { JwtPayload } from './jwt/jwtUtils';
export { default as refreshToken, shouldRefreshToken, autoRefreshToken, setupTokenRefreshTimer } from './jwt/refreshToken';
export type { RefreshTokenResult } from './jwt/refreshToken';
export { tokenStorage } from './jwt/tokenStorage';

// 认证 API 服务
export { authApiService } from './services/authapi';

// 导出类型定义
export { default as UseAuthResult } from './hooks/useAuth';
export { usePermission } from './hooks/usePermission';
export { default as UseTokenResult } from './hooks/useToken';
