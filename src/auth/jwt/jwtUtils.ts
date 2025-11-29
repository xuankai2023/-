// JWT工具类 - 高级实现
import { jwtConfig, mockUsers } from '../config';

// JWT Payload接口定义
export interface JwtPayload {
  sub: string; // 用户ID
  username: string;
  role: string;
  permissions: string[];
  exp: number; // 过期时间戳
  iat: number; // 签发时间戳
  jti?: string; // 令牌唯一标识符
  iss?: string; // 签发者
  aud?: string; // 接收者
  nbf?: number; // 生效时间
}

// JWT工具类
class JwtUtils {
  private secretKey: string;
  private tokenExpiration: number;
  private refreshTokenExpiration: number;
  private tokenPrefix: string;

  constructor() {
    this.secretKey = String(jwtConfig.secret);
    // 处理tokenExpiration，将字符串如'1h'转换为毫秒数
    const tokenExpStr = jwtConfig.tokenExpiration;
    if (typeof tokenExpStr === 'string') {
      const match = tokenExpStr.match(/^(\d+)([smhd])$/);
      if (match) {
        const value = parseInt(match[1], 10);
        const unit = match[2];
        switch (unit) {
          case 's': this.tokenExpiration = value * 1000; break;
          case 'm': this.tokenExpiration = value * 60 * 1000; break;
          case 'h': this.tokenExpiration = value * 60 * 60 * 1000; break;
          case 'd': this.tokenExpiration = value * 24 * 60 * 60 * 1000; break;
          default: this.tokenExpiration = 3600000; // 默认1小时
        }
      } else {
        this.tokenExpiration = 3600000; // 默认1小时
      }
    } else {
      this.tokenExpiration = Number(tokenExpStr) || 3600000;
    }
    
    // 处理refreshTokenExpiration，将字符串如'7d'转换为毫秒数
    const refreshExpStr = jwtConfig.refreshExpiration;
    if (typeof refreshExpStr === 'string') {
      const match = refreshExpStr.match(/^(\d+)([smhd])$/);
      if (match) {
        const value = parseInt(match[1], 10);
        const unit = match[2];
        switch (unit) {
          case 's': this.refreshTokenExpiration = value * 1000; break;
          case 'm': this.refreshTokenExpiration = value * 60 * 1000; break;
          case 'h': this.refreshTokenExpiration = value * 60 * 60 * 1000; break;
          case 'd': this.refreshTokenExpiration = value * 24 * 60 * 60 * 1000; break;
          default: this.refreshTokenExpiration = 604800000; // 默认7天
        }
      } else {
        this.refreshTokenExpiration = 604800000; // 默认7天
      }
    } else {
      this.refreshTokenExpiration = Number(refreshExpStr) || 604800000;
    }
    
    this.tokenPrefix = jwtConfig.tokenPrefix || 'Bearer ';
  }

  /**
   * 生成唯一标识符
   */
  private generateUniqueId(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  /**
   * Base64编码（处理Unicode字符）
   */
  private base64Encode(str: string): string {
    return btoa(
      encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, 
        (_, p1) => String.fromCharCode(parseInt(p1, 16))
      )
    );
  }

  /**
   * Base64解码（处理Unicode字符）
   */
  private base64Decode(str: string): string {
    try {
      return decodeURIComponent(
        atob(str).split('').map(c => 
          '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        ).join('')
      );
    } catch (error) {
      throw new Error('无效的Base64编码');
    }
  }

  /**
   * 创建HMAC签名
   * 注意：这是一个简化的实现，生产环境应使用更安全的库如crypto-js或jose
   */
  private createHmacSignature(data: string): string {
    // 简化的HMAC实现 - 实际生产环境应使用专业的加密库
    // 这里使用简单的字符串操作模拟签名过程
    const combined = data + this.secretKey;
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 转换为32位整数
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * 创建JWT令牌
   */
  public createToken(user: { id: string; username: string; role: string; permissions: string[] }): string {
    const now = Math.floor(Date.now() / 1000);
    const expiration = now + Math.floor(this.tokenExpiration / 1000);

    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      role: user.role,
      permissions: user.permissions,
      exp: expiration,
      iat: now,
      jti: this.generateUniqueId(),
      iss: 'react-admin-local',
      aud: 'react-admin-client'
    };

    // JWT三部分：header.payload.signature
    const header = this.base64Encode(JSON.stringify({ typ: 'JWT', alg: 'HS256' }));
    const payloadEncoded = this.base64Encode(JSON.stringify(payload));
    const data = `${header}.${payloadEncoded}`;
    const signature = this.createHmacSignature(data);

    return `${this.tokenPrefix}${data}.${signature}`;
  }

  /**
   * 创建刷新令牌
   */
  public createRefreshToken(userId: string): string {
    const now = Math.floor(Date.now() / 1000);
    const expiration = now + Math.floor(this.refreshTokenExpiration / 1000);

    const payload = {
      sub: userId,
      exp: expiration,
      iat: now,
      jti: this.generateUniqueId(),
      type: 'refresh'
    };

    const header = this.base64Encode(JSON.stringify({ typ: 'JWT', alg: 'HS256' }));
    const payloadEncoded = this.base64Encode(JSON.stringify(payload));
    const data = `${header}.${payloadEncoded}`;
    const signature = this.createHmacSignature(data);

    return `${this.tokenPrefix}${data}.${signature}`;
  }

  /**
   * 验证JWT令牌
   */
  public verifyToken(token: string): { isValid: boolean; payload?: JwtPayload; error?: string } {
    try {
      // 移除Bearer前缀
      const tokenWithoutPrefix = token.startsWith(this.tokenPrefix) 
        ? token.slice(this.tokenPrefix.length) 
        : token;

      // 分割令牌
      const [headerEncoded, payloadEncoded, signature] = tokenWithoutPrefix.split('.');
      
      if (!headerEncoded || !payloadEncoded || !signature) {
        return { isValid: false, error: '无效的令牌格式' };
      }

      // 验证签名
      const data = `${headerEncoded}.${payloadEncoded}`;
      const expectedSignature = this.createHmacSignature(data);
      
      if (signature !== expectedSignature) {
        return { isValid: false, error: '签名验证失败' };
      }

      // 解析payload
      const payload: JwtPayload = JSON.parse(this.base64Decode(payloadEncoded));

      // 验证过期时间
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) {
        return { isValid: false, error: '令牌已过期' };
      }

      // 验证生效时间
      if (payload.nbf && payload.nbf > now) {
        return { isValid: false, error: '令牌尚未生效' };
      }

      return { isValid: true, payload };
    } catch (error) {
      return { 
        isValid: false, 
        error: error instanceof Error ? error.message : '令牌验证失败'
      };
    }
  }

  /**
   * 解析JWT令牌（不验证签名）
   */
  public parseToken(token: string): JwtPayload | null {
    try {
      const tokenWithoutPrefix = token.startsWith(this.tokenPrefix) 
        ? token.slice(this.tokenPrefix.length) 
        : token;
      
      const [, payloadEncoded] = tokenWithoutPrefix.split('.');
      if (!payloadEncoded) return null;

      return JSON.parse(this.base64Decode(payloadEncoded));
    } catch {
      return null;
    }
  }

  /**
   * 检查令牌是否过期
   */
  public isTokenExpired(token: string): boolean {
    const payload = this.parseToken(token);
    if (!payload || !payload.exp) return true;

    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  }

  /**
   * 获取令牌剩余有效期（秒）
   */
  public getTokenRemainingTime(token: string): number {
    const payload = this.parseToken(token);
    if (!payload || !payload.exp) return 0;

    const now = Math.floor(Date.now() / 1000);
    return Math.max(0, payload.exp - now);
  }

  /**
   * 从令牌中提取用户信息
   */
  public getUserFromToken(token: string): { id: string; username: string; role: string; permissions: string[] } | null {
    const result = this.verifyToken(token);
    if (!result.isValid || !result.payload) return null;

    const { sub, username, role, permissions } = result.payload;
    return { id: sub, username, role, permissions };
  }

  /**
   * 检查令牌是否包含特定权限
   */
  public hasPermission(token: string, permission: string): boolean {
    const user = this.getUserFromToken(token);
    if (!user) return false;

    return user.permissions.includes(permission) || 
           user.role === 'admin'; // 管理员拥有所有权限
  }

  /**
   * 刷新令牌
   */
  public refreshAccessToken(refreshToken: string): { accessToken?: string; error?: string } {
    try {
      // 验证刷新令牌
      const result = this.verifyToken(refreshToken);
      if (!result.isValid || !result.payload) {
        return { error: '无效的刷新令牌' };
      }

      // 检查是否为刷新令牌类型
      const decoded = this.parseToken(refreshToken);
      if ((decoded as any)?.type !== 'refresh') {
        return { error: '不是有效的刷新令牌' };
      }

      // 根据用户ID查找用户
      const userId = result.payload.sub;
      const user = mockUsers.find(u => u.id === userId);
      if (!user) {
        return { error: '用户不存在' };
      }

      // 创建新的访问令牌
      const newAccessToken = this.createToken(user);
      return { accessToken: newAccessToken };
    } catch (error) {
      return { 
        error: error instanceof Error ? error.message : '令牌刷新失败'
      };
    }
  }

  /**
   * 提取令牌中的角色信息
   */
  public getUserRole(token: string): string | null {
    const payload = this.parseToken(token);
    return payload?.role || null;
  }

  /**
   * 生成令牌指纹（用于令牌撤销检查）
   */
  public generateTokenFingerprint(token: string): string {
    const tokenWithoutPrefix = token.startsWith(this.tokenPrefix) 
      ? token.slice(this.tokenPrefix.length) 
      : token;
    
    // 简化的指纹生成 - 实际应用中可能需要更复杂的算法
    let hash = 0;
    for (let i = 0; i < tokenWithoutPrefix.length; i++) {
      const char = tokenWithoutPrefix.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }
}

// 导出单例实例
export const jwtUtils = new JwtUtils();

// 导出工具函数（方便直接调用）
export const {
  createToken,
  createRefreshToken,
  verifyToken,
  parseToken,
  isTokenExpired,
  getTokenRemainingTime,
  getUserFromToken,
  hasPermission,
  refreshAccessToken,
  getUserRole,
  generateTokenFingerprint
} = jwtUtils;

// 导出默认实例
export default jwtUtils;