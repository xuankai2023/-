# React Admin JWT认证系统

## 概述
基于JWT(JSON Web Token)的完整认证解决方案，专为React Admin设计，提供安全的用户认证、权限管理和令牌刷新功能。

## 核心特性

### 🔐 安全认证
- JWT令牌生成与验证
- HMAC签名保护
- 安全的令牌存储
- 自动过期处理

### 🔄 智能刷新
- 访问令牌自动刷新
- 刷新令牌机制
- 过期前预刷新
- 失败重试策略

### 👥 权限管理
- 基于角色的权限控制
- 细粒度权限分配
- 路由级权限验证
- 用户身份管理

### 🎯 React集成
- React Admin认证提供者
- 自定义Hooks
- 状态管理集成
- 错误处理机制

## 快速开始

### 安装依赖
```bash
npm install
```

### 配置说明
编辑 `src/auth/config.ts` 文件：

```typescript
export const jwtConfig = {
  secret: 'your-secret-key',        // JWT签名密钥
  tokenExpiration: '1h',            // 访问令牌过期时间
  refreshExpiration: '7d',          // 刷新令牌过期时间
  tokenPrefix: 'Bearer',            // 令牌前缀
};
```

### 基本使用

#### 1. 登录认证
```typescript
import { useAuth } from './auth/hooks/useAuth';

const { login, isAuthenticated, user } = useAuth();

// 用户登录
const handleLogin = async () => {
  const success = await login({
    username: 'admin',
    password: 'admin123'
  });
  
  if (success) {
    // 登录成功处理
  }
};
```

#### 2. React Admin集成
```typescript
import { authProvider } from './auth/authProvider';

const App = () => (
  <Admin authProvider={authProvider}>
    {/* 你的应用组件 */}
  </Admin>
);
```

#### 3. 权限控制
```typescript
import { usePermission } from './auth/hooks/usePermission';

const { hasPermission } = usePermission();

// 检查权限
if (hasPermission('admin')) {
  // 显示管理员功能
}
```

## 核心API

### JWT工具类 (`jwtUtils`)
```typescript
// 创建令牌
const token = jwtUtils.createToken(user);

// 验证令牌
const result = jwtUtils.verifyToken(token);

// 解析令牌
const payload = jwtUtils.parseToken(token);
```

### 令牌存储 (`tokenStorage`)
```typescript
// 存储令牌
tokenStorage.setAccessToken(token);

// 获取令牌
const token = tokenStorage.getAccessToken();

// 清除所有令牌
tokenStorage.clear();
```

### 令牌刷新 (`refreshToken`)
```typescript
// 手动刷新
const result = await refreshToken();

// 自动刷新检查
const shouldRefresh = shouldRefreshToken(300); // 5分钟阈值

// 设置自动刷新定时器
const timer = setupTokenRefreshTimer(5, 300, onSuccess, onError);
```

## 配置选项

### JWT配置
| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| secret | string | - | JWT签名密钥 |
| tokenExpiration | string | '1h' | 访问令牌过期时间 |
| refreshExpiration | string | '7d' | 刷新令牌过期时间 |
| tokenPrefix | string | 'Bearer' | 令牌前缀 |

### 存储配置
| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| storageType | string | 'localStorage' | 存储类型 |
| accessTokenKey | string | 'auth_access_token' | 访问令牌键名 |
| refreshTokenKey | string | 'auth_refresh_token' | 刷新令牌键名 |

## 安全最佳实践

### 1. 生产环境配置
```typescript
// 使用环境变量
export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'fallback-secret',
  tokenExpiration: process.env.TOKEN_EXPIRATION || '1h',
};
```

### 2. HTTPS强制
```typescript
// 生产环境强制HTTPS
if (process.env.NODE_ENV === 'production') {
  if (window.location.protocol !== 'https:') {
    console.warn('在非HTTPS环境下存储令牌可能不安全');
  }
}
```

### 3. 令牌安全
- 访问令牌设置较短过期时间（1小时）
- 刷新令牌设置较长过期时间（7天）
- 实现安全的令牌存储和传输

## 错误处理

### 常见错误类型
```typescript
// 认证错误
{ error: '登录失败，请检查用户名和密码' }

// 令牌错误  
{ error: '令牌无效或已过期' }

// 权限错误
{ error: '您没有权限执行此操作' }
```

### 错误处理示例
```typescript
try {
  await login(credentials);
} catch (error) {
  if (error.status === 401) {
    // 处理未授权错误
  } else if (error.status === 403) {
    // 处理权限不足错误
  }
}
```

## 开发技巧

### 1. 调试模式
```typescript
// 启用调试日志
localStorage.setItem('debug', 'auth:*');

// 导出令牌数据（调试用）
const tokensData = tokenStorage.exportTokensData();
console.log('Tokens Data:', tokensData);
```

### 2. 自定义配置
```typescript
// 自定义存储键名
export const storageConfig = {
  accessTokenKey: 'myapp_access_token',
  refreshTokenKey: 'myapp_refresh_token',
};

// 自定义权限映射
export const permissionsConfig = {
  rolePermissions: {
    superAdmin: ['*'],
    contentManager: ['read', 'write'],
    viewer: ['read']
  }
};
```

### 3. 扩展功能
```typescript
// 添加多因素认证
const enable2FA = (user) => {
  // 实现2FA逻辑
};

// 添加会话管理
const sessionManager = {
  // 会话超时处理
  // 并发登录控制
};
```

## 故障排除

### 常见问题
1. **令牌验证失败**
   - 检查JWT密钥配置
   - 验证令牌格式和签名

2. **刷新令牌无效**
   - 检查刷新令牌是否过期
   - 验证用户状态是否正常

3. **权限验证失败**
   - 检查用户角色配置
   - 验证权限映射关系

### 日志调试
```typescript
// 启用详细日志
console.log('Auth State:', {
  isAuthenticated,
  user,
  token: tokenStorage.getAccessToken()
});
```

## 贡献指南
欢迎提交Issue和Pull Request来改进这个认证系统。

## 许可证
MIT License