import { jwtConfig, mockUsers } from "../config";
import { jwtUtils } from "./jwtUtils";
import { tokenStorage } from "./tokenStorage";

// 定义刷新令牌响应类型
export interface RefreshTokenResult {
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
  error?: string;
}

/**
 * 刷新访问令牌的核心函数
 * 使用存储的刷新令牌获取新的访问令牌
 * @returns 刷新结果，包含新的访问令牌和刷新令牌
 */
export const refreshToken = async (): Promise<RefreshTokenResult> => {
  try {
    // 1. 从存储中获取刷新令牌
    const storedRefreshToken = tokenStorage.getRefreshToken();
    
    if (!storedRefreshToken) {
      return {
        success: false,
        error: '没有可用的刷新令牌'
      };
    }

    // 2. 验证刷新令牌
    const verifyResult = jwtUtils.verifyToken(storedRefreshToken);
    
    if (!verifyResult.isValid) {
      // 清除无效的令牌
      tokenStorage.clear();
      return {
        success: false,
        error: verifyResult.error || '刷新令牌无效或已过期'
      };
    }

    // 3. 解析令牌获取用户信息
    const tokenPayload = verifyResult.payload;
    
    if (!tokenPayload || !tokenPayload.sub) {
      return {
        success: false,
        error: '无法从令牌中获取用户信息'
      };
    }

    // 4. 查找用户
    const userId = tokenPayload.sub;
    const user = mockUsers.find(u => u.id === userId);
    
    if (!user) {
      return {
        success: false,
        error: '用户不存在'
      };
    }

    // 5. 生成新的访问令牌
    const newAccessToken = jwtUtils.createToken({
      id: user.id,
      username: user.username,
      role: user.role,
      permissions: user.permissions
    });

    // 6. 生成新的刷新令牌
    const newRefreshToken = jwtUtils.createRefreshToken(user.id);

    // 7. 更新存储
    tokenStorage.setAccessToken(newAccessToken);
    tokenStorage.setRefreshToken(newRefreshToken);

    return {
      success: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    };
  } catch (error) {
    console.error('刷新令牌过程中发生错误:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '刷新令牌失败'
    };
  }
};

/**
 * 检查令牌是否需要刷新
 * @param thresholdSeconds 提前刷新的阈值（秒）
 * @returns 是否需要刷新
 */
export const shouldRefreshToken = (thresholdSeconds: number = 300): boolean => {
  try {
    const accessToken = tokenStorage.getAccessToken();
    
    if (!accessToken) {
      return true; // 没有访问令牌，需要刷新
    }

    // 获取令牌剩余有效期
    const remainingTime = jwtUtils.getTokenRemainingTime(accessToken);
    
    // 如果剩余时间小于阈值，则需要刷新
    return remainingTime > 0 && remainingTime < thresholdSeconds;
  } catch (error) {
    console.error('检查令牌刷新状态失败:', error);
    return true; // 出错时默认需要刷新
  }
};

/**
 * 自动刷新令牌（如果需要）
 * @param thresholdSeconds 提前刷新的阈值（秒）
 * @returns 刷新结果
 */
export const autoRefreshToken = async (thresholdSeconds: number = 300): Promise<RefreshTokenResult> => {
  if (shouldRefreshToken(thresholdSeconds)) {
    return await refreshToken();
  }
  
  // 如果不需要刷新，返回当前令牌
  const currentAccessToken = tokenStorage.getAccessToken();
  const currentRefreshToken = tokenStorage.getRefreshToken();
  
  if (currentAccessToken) {
    return {
      success: true,
      accessToken: currentAccessToken,
      refreshToken: currentRefreshToken || undefined
    };
  }
  
  return {
    success: false,
    error: '没有有效的访问令牌'
  };
};

/**
 * 设置令牌自动刷新定时器
 * @param intervalMinutes 检查间隔（分钟）
 * @param thresholdSeconds 提前刷新的阈值（秒）
 * @param onRefreshSuccess 刷新成功回调
 * @param onRefreshError 刷新失败回调
 * @returns 定时器ID
 */
export const setupTokenRefreshTimer = (
  intervalMinutes: number = 5,
  thresholdSeconds: number = 300,
  onRefreshSuccess?: (result: RefreshTokenResult) => void,
  onRefreshError?: (error: string) => void
): NodeJS.Timeout => {
  const intervalMs = intervalMinutes * 60 * 1000;
  
  const timer = setInterval(async () => {
    const result = await autoRefreshToken(thresholdSeconds);
    
    if (result.success) {
      onRefreshSuccess?.(result);
    } else {
      onRefreshError?.(result.error || '自动刷新令牌失败');
      // 清除定时器，避免持续失败
      clearInterval(timer);
    }
  }, intervalMs);
  
  return timer;
};

// 导出默认函数
export default refreshToken;