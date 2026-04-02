'use client';

import userbase from 'userbase-js';

const USERBASE_APP_ID = '0b2844f0-e722-4251-a270-35200be9756a';

// 认证状态缓存
let authCache: { isAuthenticated: boolean; user?: any; timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5分钟缓存

// 初始化 Userbase
export const initUserbase = async () => {
  try {
    await userbase.init({ appId: USERBASE_APP_ID });
    return true;
  } catch (error) {
    console.error('Userbase 初始化失败:', error);
    return false;
  }
};

// 检查用户是否已登录
export const checkAuthStatus = async (): Promise<{ isAuthenticated: boolean; user?: any }> => {
  // 检查缓存是否有效
  if (authCache && (Date.now() - authCache.timestamp) < CACHE_DURATION) {
    console.log('使用认证缓存');
    return { isAuthenticated: authCache.isAuthenticated, user: authCache.user };
  }

  try {
    const initSuccess = await initUserbase();
    if (!initSuccess) {
      console.warn('Userbase 初始化失败，认为用户未登录');
      authCache = { isAuthenticated: false, timestamp: Date.now() };
      return { isAuthenticated: false };
    }
    
    // 尝试打开一个数据库来验证用户是否已登录
    // 如果用户未登录，这个操作会失败
    try {
      await userbase.openDatabase({
        databaseName: 'auth-test',
        changeHandler: () => {}
      });
      
      // 如果能成功打开数据库，说明用户已登录
      const result = { isAuthenticated: true, user: { username: 'admin@luca.com' } };
      authCache = { ...result, timestamp: Date.now() };
      return result;
    } catch (dbError: any) {
      // 如果打开数据库失败，检查是否是因为未登录
      if (dbError.message && (
        dbError.message.includes('User not signed in') ||
        dbError.message.includes('not signed in') ||
        dbError.message.includes('unauthorized') ||
        dbError.message.includes('User not found') ||
        dbError.message.includes('Network error') ||
        dbError.message.includes('Failed to fetch')
      )) {
        console.warn('用户未登录或网络错误:', dbError.message);
        authCache = { isAuthenticated: false, timestamp: Date.now() };
        return { isAuthenticated: false };
      }
      
      // 其他错误也认为未登录
      console.warn('数据库访问错误，认为用户未登录:', dbError.message);
      authCache = { isAuthenticated: false, timestamp: Date.now() };
      return { isAuthenticated: false };
    }
  } catch (error) {
    console.error('检查认证状态失败:', error);
    authCache = { isAuthenticated: false, timestamp: Date.now() };
    return { isAuthenticated: false };
  }
};

// 清除认证缓存
export const clearAuthCache = () => {
  authCache = null;
};

// 登录
export const signIn = async (username: string, password: string) => {
  try {
    await initUserbase();
    
    const result = await userbase.signIn({
      username,
      password,
      rememberMe: 'local', // 使用本地存储记住登录状态
    });
    
    // 登录成功后清除缓存，强制重新检查
    clearAuthCache();
    
    return { success: true, user: result };
  } catch (error: any) {
    console.error('登录失败:', error);
    return { success: false, error: error.message || '登录失败' };
  }
};

// 注册
export const signUp = async (username: string, password: string) => {
  try {
    await initUserbase();
    
    const result = await userbase.signUp({
      username,
      password,
      rememberMe: 'local', // 使用本地存储记住登录状态
    });
    
    return { success: true, user: result };
  } catch (error: any) {
    console.error('注册失败:', error);
    return { success: false, error: error.message || '注册失败' };
  }
};

// 登出
export const signOut = async () => {
  try {
    await userbase.signOut();
    // 登出后清除缓存
    clearAuthCache();
    return { success: true };
  } catch (error: any) {
    console.error('登出失败:', error);
    return { success: false, error: error.message || '登出失败' };
  }
};

// 检查管理员是否已存在
export const checkAdminExists = async (): Promise<boolean> => {
  try {
    await initUserbase();
    
    // 尝试用默认管理员账号登录来检查是否存在
    const result = await userbase.signIn({
      username: 'admin@luca.com',
      password: 'luca2024',
      rememberMe: 'none', // 这里只是检查，不需要记住
    });
    
    if (result) {
      // 立即登出，因为这只是检查
      await userbase.signOut();
      return true;
    }
    
    return false;
  } catch (error: any) {
    // 如果登录失败，说明管理员不存在或密码错误
    if (error.message && error.message.includes('User not found')) {
      return false;
    }
    // 其他错误也认为管理员不存在
    return false;
  }
};

// 创建默认管理员
export const createDefaultAdmin = async () => {
  try {
    await initUserbase();
    
    const result = await userbase.signUp({
      username: 'admin@luca.com',
      password: 'luca2024',
      rememberMe: 'local',
    });
    
    return { success: true, user: result };
  } catch (error: any) {
    console.error('创建默认管理员失败:', error);
    
    if (error.message && error.message.includes('username already exists')) {
      return { success: false, error: '管理员账号已存在' };
    }
    
    return { success: false, error: error.message || '创建管理员失败' };
  }
};

