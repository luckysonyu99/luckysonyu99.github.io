'use client';

import { supabase } from './supabase';

// 登录
export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('登录失败:', error);
      return { success: false, error: error.message };
    }

    return { success: true, user: data.user };
  } catch (error: any) {
    console.error('登录失败:', error);
    return { success: false, error: error.message || '登录失败' };
  }
};

// 注册
export const signUp = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error('注册失败:', error);
      return { success: false, error: error.message };
    }

    // 创建管理员 profile
    if (data.user) {
      const { error: profileError } = await supabase
        .from('admin_profiles')
        .insert({
          id: data.user.id,
          email: email,
        });

      if (profileError) {
        console.error('创建管理员 profile 失败:', profileError);
      }
    }

    return { success: true, user: data.user };
  } catch (error: any) {
    console.error('注册失败:', error);
    return { success: false, error: error.message || '注册失败' };
  }
};

// 登出
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('登出失败:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error('登出失败:', error);
    return { success: false, error: error.message || '登出失败' };
  }
};

// 检查用户是否已登录
export const checkAuthStatus = async (): Promise<{ isAuthenticated: boolean; user?: any }> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error('检查认证状态失败:', error);
      return { isAuthenticated: false };
    }

    if (session && session.user) {
      return { isAuthenticated: true, user: session.user };
    }

    return { isAuthenticated: false };
  } catch (error) {
    console.error('检查认证状态失败:', error);
    return { isAuthenticated: false };
  }
};

// 获取当前用户
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      console.error('获取用户信息失败:', error);
      return null;
    }

    return user;
  } catch (error) {
    console.error('获取用户信息失败:', error);
    return null;
  }
};

// 检查管理员是否已存在
export const checkAdminExists = async (): Promise<boolean> => {
  try {
    // 尝试登录来检查管理员是否存在
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'admin@luca.com',
      password: 'luca2024',
    });

    if (data.user) {
      // 立即登出
      await supabase.auth.signOut();
      return true;
    }

    return false;
  } catch (error) {
    return false;
  }
};

// 创建默认管理员
export const createDefaultAdmin = async () => {
  try {
    const result = await signUp('admin@luca.com', 'luca2024');
    return result;
  } catch (error: any) {
    console.error('创建默认管理员失败:', error);
    return { success: false, error: error.message || '创建管理员失败' };
  }
};

// 监听认证状态变化
export const onAuthStateChange = (callback: (event: string, session: any) => void) => {
  return supabase.auth.onAuthStateChange(callback);
};
