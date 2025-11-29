// 令牌存储工具 - 高级实现
import { storageConfig } from '../config';

// 存储键名常量
const STORAGE_KEYS = {
  ACCESS_TOKEN: storageConfig?.accessTokenKey || 'auth_access_token',
  REFRESH_TOKEN: storageConfig?.refreshTokenKey || 'auth_refresh_token',
  TOKEN_EXPIRY: 'auth_token_expiry',
  USER_INFO: storageConfig?.userInfoKey || 'auth_user_info',
};

// 令牌存储接口
export interface TokenStorage {
  // 存储访问令牌
  setAccessToken(token: string): void;
  // 获取访问令牌
  getAccessToken(): string | null;
  // 存储刷新令牌
  setRefreshToken(token: string): void;
  // 获取刷新令牌
  getRefreshToken(): string | null;
  // 存储令牌过期时间
  setTokenExpiry(expiryTime: number): void;
  // 获取令牌过期时间
  getTokenExpiry(): number | null;
  // 存储用户信息
  setUserInfo(userInfo: any): void;
  // 获取用户信息
  getUserInfo(): any | null;
  // 清除所有令牌和用户信息
  clear(): void;
  // 检查令牌是否存在
  hasTokens(): boolean;
  // 安全检查 - 验证存储环境是否安全
  isStorageSafe(): boolean;
  // 导出所有令牌数据（用于调试）
  exportTokensData(): Record<string, any>;
}

/**
 * 令牌存储工具类
 * 实现安全的令牌存储、获取和管理功能
 */
class TokenStorageImpl implements TokenStorage {
  private storage: Storage;
  private encryptionEnabled: boolean;
  private keyPrefix: string;

  constructor() {
    // 根据配置选择存储类型
    const storageType = storageConfig?.storageType || 'localStorage';
    this.storage = storageType === 'sessionStorage' ? sessionStorage : localStorage;
    // 默认关闭加密
    this.encryptionEnabled = false;
    this.keyPrefix = 'react_admin_';
  }

  /**
   * 安全检查 - 验证存储环境是否安全
   */
  public isStorageSafe(): boolean {
    try {
      // 检查是否支持localStorage
      const testKey = `${this.keyPrefix}_test`;
      this.storage.setItem(testKey, 'test');
      this.storage.removeItem(testKey);
      
      // 检查是否在HTTPS环境下（生产环境建议）
      if (process.env.NODE_ENV === 'production' && window.location.protocol !== 'https:') {
        console.warn('警告: 在非HTTPS环境下存储令牌可能不安全');
      }
      
      return true;
    } catch (error) {
      console.error('存储环境检查失败:', error);
      return false;
    }
  }

  /**
   * 简单的加密函数（仅用于基本保护）
   * 注意：生产环境应考虑使用更强大的加密库
   */
  private encrypt(data: string): string {
    if (!this.encryptionEnabled) return data;
    
    try {
      // 简单的Base64编码作为基本保护
      return btoa(encodeURIComponent(data));
    } catch (error) {
      console.error('加密失败:', error);
      return data; // 加密失败时返回原始数据
    }
  }

  /**
   * 简单的解密函数
   */
  private decrypt(encryptedData: string): string {
    if (!this.encryptionEnabled) return encryptedData;
    
    try {
      return decodeURIComponent(atob(encryptedData));
    } catch (error) {
      console.error('解密失败:', error);
      return encryptedData; // 解密失败时返回原始数据
    }
  }

  /**
   * 获取带前缀的完整键名
   */
  private getFullKey(key: string): string {
    return `${this.keyPrefix}${key}`;
  }

  /**
   * 安全地存储数据到localStorage
   */
  private safeSetItem(key: string, value: string): boolean {
    try {
      if (!this.isStorageSafe()) {
        console.error('存储环境不安全，无法存储令牌');
        return false;
      }
      
      const fullKey = this.getFullKey(key);
      this.storage.setItem(fullKey, this.encrypt(value));
      return true;
    } catch (error) {
      console.error('存储令牌失败:', error);
      return false;
    }
  }

  /**
   * 安全地从localStorage获取数据
   */
  private safeGetItem(key: string): string | null {
    try {
      if (!this.isStorageSafe()) {
        console.error('存储环境不安全，无法获取令牌');
        return null;
      }
      
      const fullKey = this.getFullKey(key);
      const encryptedValue = this.storage.getItem(fullKey);
      
      if (encryptedValue === null) return null;
      return this.decrypt(encryptedValue);
    } catch (error) {
      console.error('获取令牌失败:', error);
      return null;
    }
  }

  /**
   * 存储访问令牌
   */
  public setAccessToken(token: string): void {
    this.safeSetItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  }

  /**
   * 获取访问令牌
   */
  public getAccessToken(): string | null {
    return this.safeGetItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  /**
   * 存储刷新令牌
   */
  public setRefreshToken(token: string): void {
    this.safeSetItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  }

  /**
   * 获取刷新令牌
   */
  public getRefreshToken(): string | null {
    return this.safeGetItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  /**
   * 存储令牌过期时间
   */
  public setTokenExpiry(expiryTime: number): void {
    this.safeSetItem(STORAGE_KEYS.TOKEN_EXPIRY, expiryTime.toString());
  }

  /**
   * 获取令牌过期时间
   */
  public getTokenExpiry(): number | null {
    const expiryStr = this.safeGetItem(STORAGE_KEYS.TOKEN_EXPIRY);
    return expiryStr ? parseInt(expiryStr, 10) : null;
  }

  /**
   * 存储用户信息
   */
  public setUser(userInfo: any): void {
    const userInfoStr = JSON.stringify(userInfo);
    this.safeSetItem(STORAGE_KEYS.USER_INFO, userInfoStr);
  }

  /**
   * 获取用户信息
   */
  public getUser(): any | null {
    const userInfoStr = this.safeGetItem(STORAGE_KEYS.USER_INFO);
    if (!userInfoStr) return null;
    
    try {
      return JSON.parse(userInfoStr);
    } catch (error) {
      console.error('解析用户信息失败:', error);
      return null;
    }
  }
  
  /**
   * 兼容旧版API - 存储用户信息
   */
  public setUserInfo(userInfo: any): void {
    this.setUser(userInfo);
  }

  /**
   * 兼容旧版API - 获取用户信息
   */
  public getUserInfo(): any | null {
    return this.getUser();
  }

  /**
   * 清除所有令牌和用户信息
   */
  public clear(): void {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        const fullKey = this.getFullKey(key);
        this.storage.removeItem(fullKey);
      });
    } catch (error) {
      console.error('清除令牌失败:', error);
    }
  }

  /**
   * 检查令牌是否存在
   */
  public hasTokens(): boolean {
    return !!(this.getAccessToken() && this.getRefreshToken());
  }

  /**
   * 导出所有令牌数据（用于调试）
   * 注意：仅在开发环境使用，不要在生产环境暴露令牌信息
   */
  public exportTokensData(): Record<string, any> {
    if (process.env.NODE_ENV === 'production') {
      console.warn('警告: 生产环境不建议导出令牌数据');
      return { error: 'production_environment' };
    }
    
    return {
      accessToken: this.getAccessToken() ? '[已隐藏]' : null,
      refreshToken: this.getRefreshToken() ? '[已隐藏]' : null,
      tokenExpiry: this.getTokenExpiry(),
      hasTokens: this.hasTokens(),
      storageSafe: this.isStorageSafe(),
      userInfo: this.getUserInfo(),
    };
  }
}

// 导出单例实例
export const tokenStorage = new TokenStorageImpl();

// 导出默认实例
export default tokenStorage;

// 导出工具函数（方便直接调用）
export const {
  setAccessToken,
  getAccessToken,
  setRefreshToken,
  getRefreshToken,
  setTokenExpiry,
  getTokenExpiry,
  setUserInfo,
  getUserInfo,
  clear,
  hasTokens,
  isStorageSafe,
  exportTokensData
} = tokenStorage;