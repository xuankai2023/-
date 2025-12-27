/**
 * 密钥管理工具类
 * 实现安全的本地密钥存储与读取机制
 */
export class KeyManager {
  private static readonly STORAGE_KEY = 'pet_system_ai_api_key';

  /**
   * 编码数据（使用Base64）
   * @param data 要编码的数据
   * @returns 编码后的字符串
   */
  private static encode(data: string): string {
    return btoa(data);
  }

  /**
   * 解码数据（使用Base64）
   * @param encodedData 编码后的字符串
   * @returns 解码后的数据
   */
  private static decode(encodedData: string): string {
    return atob(encodedData);
  }

  /**
   * 从环境变量获取API密钥
   * @returns 环境变量中的API密钥
   */
  private static getKeyFromEnv(): string | null {
    // @ts-ignore
    return import.meta.env.VITE_DEEPSEEK_API_KEY || null;
  }

  /**
   * 检查本地是否已存储密钥
   * @returns 是否已存储密钥
   */
  static hasKey(): boolean {
    try {
      const encodedKey = localStorage.getItem(this.STORAGE_KEY);
      // 如果本地没有存储密钥，检查环境变量中是否有
      if (!encodedKey) {
        return !!this.getKeyFromEnv();
      }
      return true;
    } catch (error) {
      console.error('检查密钥失败:', error);
      return false;
    }
  }

  /**
   * 存储API密钥
   * @param key API密钥
   * @returns 是否存储成功
   */
  static saveKey(key: string): boolean {
    try {
      // 验证密钥格式（简单验证，根据实际API密钥格式调整）
      if (!key || typeof key !== 'string') {
        throw new Error('无效的API密钥格式');
      }

      const encodedKey = this.encode(key);
      localStorage.setItem(this.STORAGE_KEY, encodedKey);
      return true;
    } catch (error) {
      console.error('存储密钥失败:', error);
      return false;
    }
  }

  /**
   * 读取API密钥
   * @returns API密钥，如果不存在则返回null
   */
  static getKey(): string | null {
    try {
      // 先从本地存储读取
      const encodedKey = localStorage.getItem(this.STORAGE_KEY);
      if (encodedKey) {
        const decodedKey = this.decode(encodedKey);
        return decodedKey;
      }
      // 如果本地没有，从环境变量读取
      return this.getKeyFromEnv();
    } catch (error) {
      console.error('读取密钥失败:', error);
      return null;
    }
  }

  /**
   * 删除API密钥
   * @returns 是否删除成功
   */
  static removeKey(): boolean {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('删除密钥失败:', error);
      return false;
    }
  }

  /**
   * 验证API密钥格式
   * @param key API密钥
   * @returns 是否有效
   */
  static validateKey(key: string): boolean {
    // 根据实际API密钥格式调整验证逻辑
    // 例如：OpenAI API密钥格式为 sk-...
    return /^sk-/.test(key);
  }

  /**
   * 获取密钥的安全显示格式（隐藏部分字符）
   * @returns 安全显示的密钥
   */
  static getMaskedKey(): string | null {
    const key = this.getKey();
    if (!key) {
      return null;
    }

    // 显示前4位和后4位，中间用*代替
    const front = key.substring(0, 4);
    const end = key.substring(key.length - 4);
    const middle = '*'.repeat(key.length - 8);
    return `${front}${middle}${end}`;
  }
}
