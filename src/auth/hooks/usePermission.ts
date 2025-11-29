import { useMemo } from 'react';
import { useAuth } from './useAuth';
import { permissionsConfig } from '../config';

interface UsePermissionResult {
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  getRoles: () => string[];
  getPermissions: () => string[];
  isAdmin: boolean;
  isUser: boolean;
  isGuest: boolean;
}

/**
 * 权限管理Hook
 * 提供权限检查、角色检查等功能
 */
export const usePermission = (): UsePermissionResult => {
  const { user, isAuthenticated } = useAuth();

  // 获取用户角色
  const getRoles = useMemo(() => {
    return (): string[] => {
      if (!user) return [];
      
      // 优先从user.roles获取
      if (Array.isArray(user.roles) && user.roles.length > 0) {
        return user.roles;
      }
      
      // 从user.role获取单个角色
      if (user.role) {
        return [user.role];
      }
      
      return [];
    };
  }, [user]);

  // 获取用户权限
  const getPermissions = useMemo(() => {
    return (): string[] => {
      if (!user) return [];
      
      // 优先从user.permissions获取
      if (Array.isArray(user.permissions) && user.permissions.length > 0) {
        return user.permissions;
      }
      
      // 从角色映射获取权限
      const roles = getRoles();
      if (roles.length > 0 && permissionsConfig.rolePermissions) {
        return roles.flatMap(role => {
          return (permissionsConfig.rolePermissions as Record<string, string[]>)[role] || [];
        });
      }
      
      // 如果没有认证，返回访客权限
      if (!isAuthenticated && permissionsConfig.rolePermissions?.guest) {
        return permissionsConfig.rolePermissions.guest;
      }
      
      return [];
    };
  }, [user, isAuthenticated, getRoles]);

  // 检查用户是否有特定权限
  const hasPermission = useMemo(() => {
    return (permission: string): boolean => {
      if (!permission) return false;
      
      // 获取所有权限
      const permissions = getPermissions();
      
      // 检查是否包含特定权限或管理员权限
      return permissions.includes(permission) || permissions.includes('admin');
    };
  }, [getPermissions]);

  // 检查用户是否有特定角色
  const hasRole = useMemo(() => {
    return (role: string): boolean => {
      if (!role) return false;
      
      const roles = getRoles();
      return roles.includes(role);
    };
  }, [getRoles]);

  // 常用角色检查
  const isAdmin = useMemo(() => {
    return hasRole('admin');
  }, [hasRole]);

  const isUser = useMemo(() => {
    return hasRole('user');
  }, [hasRole]);

  const isGuest = useMemo(() => {
    return !isAuthenticated;
  }, [isAuthenticated]);

  return {
    hasPermission,
    hasRole,
    getRoles,
    getPermissions,
    isAdmin,
    isUser,
    isGuest
  };
};

export default usePermission;