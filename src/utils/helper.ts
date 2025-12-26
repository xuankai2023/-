// 日期时间格式化工具

/**
 * 格式化日期为中文格式：YYYY-MM-DD
 */
export const formatDate = (date: Date | string | number): string => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * 格式化日期时间为中文格式：YYYY-MM-DD HH:mm:ss
 */
export const formatDateTime = (date: Date | string | number): string => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

/**
 * 格式化日期时间为中文友好格式，如：2025年12月23日 14:30
 */
export const formatCNDateTime = (date: Date | string | number): string => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${year}年${month}月${day}日 ${hours}:${minutes}`;
};

/**
 * 获取相对时间描述，如：3分钟前、2小时前、1天前
 */
export const getRelativeTime = (date: Date | string | number): string => {
  const now = Date.now();
  const target = new Date(date).getTime();
  const diff = now - target;
  
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;
  
  if (diff < minute) {
    return '刚刚';
  } else if (diff < hour) {
    return `${Math.floor(diff / minute)}分钟前`;
  } else if (diff < day) {
    return `${Math.floor(diff / hour)}小时前`;
  } else if (diff < week) {
    return `${Math.floor(diff / day)}天前`;
  } else if (diff < month) {
    return `${Math.floor(diff / week)}周前`;
  } else if (diff < year) {
    return `${Math.floor(diff / month)}个月前`;
  } else {
    return `${Math.floor(diff / year)}年前`;
  }
};

// 字符串处理工具

/**
 * 截断字符串，超出部分用省略号代替
 */
export const truncateString = (str: string, maxLength: number, suffix: string = '...'): string => {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - suffix.length) + suffix;
};

/**
 * 格式化手机号，如：138****8888
 */
export const formatPhoneNumber = (phone: string): string => {
  if (!phone || phone.length !== 11) return phone;
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
};

/**
 * 去除字符串首尾空格
 */
export const trimString = (str: string): string => str.trim();

/**
 * 将字符串首字母大写
 */
export const capitalizeFirstLetter = (str: string): string => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * 将字符串转换为驼峰命名
 */
export const toCamelCase = (str: string): string => {
  return str.replace(/[-_]([a-z])/g, (g) => g[1].toUpperCase());
};

/**
 * 将字符串转换为连字符命名
 */
export const toKebabCase = (str: string): string => {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
};

// 数字格式化工具

/**
 * 格式化金额，保留两位小数，添加千分位分隔符
 */
export const formatCurrency = (amount: number, currency: string = '¥'): string => {
  const formatted = amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${currency}${formatted}`;
};

/**
 * 格式化数字，添加千分位分隔符
 */
export const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * 将数字转换为百分比格式
 */
export const formatPercentage = (value: number, decimals: number = 2): string => {
  return `${(value * 100).toFixed(decimals)}%`;
};

/**
 * 限制数字在指定范围内
 */
export const clamp = (num: number, min: number, max: number): number => {
  return Math.min(Math.max(num, min), max);
};

// 数组/对象工具

/**
 * 深克隆对象或数组
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as unknown as T;
  if (typeof obj === 'object') {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
};

/**
 * 检查数组是否为空
 */
export const isEmptyArray = (arr: any[]): boolean => {
  return Array.isArray(arr) && arr.length === 0;
};

/**
 * 检查对象是否为空
 */
export const isEmptyObject = (obj: any): boolean => {
  return typeof obj === 'object' && obj !== null && Object.keys(obj).length === 0;
};

/**
 * 从数组中删除指定元素
 */
export const removeFromArray = <T>(arr: T[], item: T): T[] => {
  return arr.filter(i => i !== item);
};

/**
 * 从数组中删除指定索引的元素
 */
export const removeFromArrayByIndex = <T>(arr: T[], index: number): T[] => {
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
};

/**
 * 数组去重
 */
export const uniqueArray = <T>(arr: T[]): T[] => {
  return arr.filter((item, index, self) => self.indexOf(item) === index);
};

/**
 * 数组排序
 */
export const sortArray = <T>(arr: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] => {
  return [...arr].sort((a, b) => {
    if (a[key] < b[key]) return order === 'asc' ? -1 : 1;
    if (a[key] > b[key]) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * 数组分组
 */
export const groupArrayBy = <T, K extends keyof T>(arr: T[], key: K): Record<string, T[]> => {
  return arr.reduce((groups, item) => {
    const groupKey = String(item[key]);
    return {
      ...groups,
      [groupKey]: [...(groups[groupKey] || []), item]
    };
  }, {} as Record<string, T[]>);
};

// 验证工具

/**
 * 验证手机号格式
 */
export const validatePhoneNumber = (phone: string): boolean => {
  return /^1[3-9]\d{9}$/.test(phone);
};

/**
 * 验证邮箱格式
 */
export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * 验证身份证号格式（18位）
 */
export const validateIdCard = (idCard: string): boolean => {
  return /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/.test(idCard);
};

/**
 * 验证是否为数字
 */
export const isNumber = (value: any): boolean => {
  return typeof value === 'number' && !isNaN(value);
};

/**
 * 验证是否为整数
 */
export const isInteger = (value: any): boolean => {
  return Number.isInteger(value);
};

/**
 * 验证密码强度
 * @param password 密码字符串
 * @returns 密码强度：0-弱，1-中，2-强
 */
export const checkPasswordStrength = (password: string): 0 | 1 | 2 => {
  if (password.length < 6) return 0;
  if (password.length < 8) return 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password) && /[^a-zA-Z0-9]/.test(password)) {
    return 2;
  }
  return 1;
};

// 节流防抖工具

/**
 * 节流函数
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
};

/**
 * 防抖函数
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = null;
    }, delay);
  };
};

// 本地存储工具

/**
 * 设置本地存储
 */
export const setLocalStorage = (key: string, value: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error setting localStorage:', error);
  }
};

/**
 * 获取本地存储
 */
export const getLocalStorage = <T>(key: string, defaultValue: T | null = null): T | null => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) as T : defaultValue;
  } catch (error) {
    console.error('Error getting localStorage:', error);
    return defaultValue;
  }
};

/**
 * 删除本地存储
 */
export const removeLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing localStorage:', error);
  }
};

/**
 * 清空本地存储
 */
export const clearLocalStorage = (): void => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

// URL处理工具

/**
 * 解析URL查询参数
 */
export const parseQueryParams = (url: string = window.location.href): Record<string, string> => {
  const params: Record<string, string> = {};
  const queryString = url.split('?')[1];
  if (!queryString) return params;
  
  queryString.split('&').forEach(param => {
    const [key, value] = param.split('=');
    if (key) {
      params[key] = decodeURIComponent(value || '');
    }
  });
  
  return params;
};

/**
 * 构建URL查询参数
 */
export const buildQueryParams = (params: Record<string, any>): string => {
  const queryString = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
  
  return queryString ? `?${queryString}` : '';
};

/**
 * 生成唯一ID
 */
export const generateUniqueId = (prefix: string = ''): string => {
  return `${prefix}${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
};

// 文件处理工具

/**
 * 获取文件扩展名
 */
export const getFileExtension = (filename: string): string => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

/**
 * 格式化文件大小
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 颜色工具

/**
 * 生成随机颜色
 */
export const getRandomColor = (): string => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

/**
 * 验证是否为有效的十六进制颜色
 */
export const isValidHexColor = (color: string): boolean => {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
};

// DOM工具

/**
 * 滚动到页面顶部
 */
export const scrollToTop = (behavior: ScrollBehavior = 'smooth'): void => {
  window.scrollTo({ top: 0, behavior });
};

/**
 * 滚动到指定元素
 */
export const scrollToElement = (element: HTMLElement | string, behavior: ScrollBehavior = 'smooth'): void => {
  const target = typeof element === 'string' ? document.querySelector(element) : element;
  if (target) {
    target.scrollIntoView({ behavior });
  }
};

/**
 * 获取元素的滚动位置
 */
export const getScrollPosition = (): { x: number; y: number } => {
  return {
    x: window.pageXOffset || document.documentElement.scrollLeft,
    y: window.pageYOffset || document.documentElement.scrollTop
  };
};

/**
 * 检查元素是否在视口中
 */
export const isElementInViewport = (element: HTMLElement): boolean => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

// 类型检查工具

/**
 * 检查是否为字符串
 */
export const isString = (value: any): value is string => {
  return typeof value === 'string';
};

/**
 * 检查是否为布尔值
 */
export const isBoolean = (value: any): value is boolean => {
  return typeof value === 'boolean';
};

/**
 * 检查是否为函数
 */
export const isFunction = (value: any): value is Function => {
  return typeof value === 'function';
};

/**
 * 检查是否为数组
 */
export const isArray = (value: any): value is any[] => {
  return Array.isArray(value);
};

/**
 * 检查是否为对象
 */
export const isObject = (value: any): value is Record<string, any> => {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
};

/**
 * 检查是否为空值（null或undefined）
 */
export const isNullish = (value: any): value is null | undefined => {
  return value === null || value === undefined;
};

/**
 * 检查是否为有效数值（非NaN）
 */
export const isFiniteNumber = (value: any): boolean => {
  return typeof value === 'number' && isFinite(value);
};
