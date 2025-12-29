//认证配置文件 - 本地开发
//JWT 相关配置
export const jwtConfig = {
  //用于本地签名/验证 JWT的密钥（开发环境）
  secret: 'love you 20070803',
  //令牌过期时间：2天 (格式: '2d' = 2天, '1h' = 1小时, '30m' = 30分钟)
  tokenExpiration: '2d',
  //刷新令牌过期时间：7天
  refreshExpiration: '7d',
  //令牌前缀
  tokenPrefix: 'Bearer',
};

export const storageConfig = {
  //访问令牌存储名
  accessTokenKey: 'auth_access_token',
  //刷新令牌存储名
  refreshTokenKey: 'auth_refresh_token',
  //用户信息存储名
  userInfoKey: 'auth_user_info',
  //使用 localStorange还是 sessionStorage 
  storageType: 'localStorage',
};

//模拟 API 端点配置（本地开发）
export const apiConfig = {
  baseUrl: '/api',
  //认证相关端点
  auth: {
    login: '/login',
    logout: '/logout',
    refresh: '/refresh',
    useInfo: '/user-info',
  },
  //本地开发环境
  isLocalDev: true,
  //API 请求超时时间
  timeout: 10000,
};

//模拟用户数据
export const mockUsers = [
  {
    id: '1',
    username: 'admin',
    password: '123456', // 实际环境应使用加密存储
    email: 'admin@example.com',
    name: '管理员',
    role: 'admin',
    permissions: ['read', 'write', 'delete', 'admin'],
  },
  {
    id: '2',
    username: 'user',
    password: 'user123',
    email: 'user@example.com',
    name: '普通用户',
    role: 'user',
    permissions: ['read', 'write'],
  },
];

// 权限配置
export const permissionsConfig = {
  // 角色权限映射
  rolePermissions: {
    admin: ['read', 'write', 'delete', 'admin'],
    user: ['read', 'write'],
    guest: ['read'],
  },
  // 公共路由（不需要认证）
  publicRoutes: ['/', '/login', '/register'],
  // 管理员专用路由
  adminRoutes: ['/admin', '/users/manage'],
};

//认证 uI 配置
export const authUiConfig = {
  //是否显示记住我的登入选项
  showRememberMe: true,
  //默认时长
  rememberMeDuration: 7 * 24 * 60 * 60 * 1000, // 7天
  //登入成功重定向
  defaultRedirect: '/',
  // 登录失败重试次数限制
  maxLoginAttempts: 5,
  // 登录失败锁定时间（分钟）
  lockoutMinutes: 15,
}
export default {
  jwt: jwtConfig,
  storage: storageConfig,
  api: apiConfig,
  mockUsers,
  permissions: permissionsConfig,
  ui: authUiConfig,
}