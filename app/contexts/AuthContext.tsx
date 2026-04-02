'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const checkAuth = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('认证检查失败:', error);
        setIsAuthenticated(false);
        setUser(null);
      } else if (session && session.user) {
        setIsAuthenticated(true);
        setUser(session.user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('认证检查失败:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('登录错误:', error);
        return { success: false, error: error.message };
      }

      if (data.user && data.session) {
        console.log('登录成功:', data.user.email);
        setIsAuthenticated(true);
        setUser(data.user);
        setIsLoading(false);
        return { success: true };
      }

      return { success: false, error: '登录失败' };
    } catch (error: any) {
      console.error('登录异常:', error);
      return { success: false, error: error.message || '登录失败' };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('登出失败:', error);
    }
  };

  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    const initAuth = async () => {
      console.log('[AuthContext] 开始初始化认证...');

      // 设置超时保护 - 5秒后强制设置 isLoading = false
      timeoutId = setTimeout(() => {
        if (mounted) {
          console.log('[AuthContext] 超时保护触发，强制设置 isLoading = false');
          setIsLoading(false);
        }
      }, 5000);

      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (!mounted) {
          console.log('[AuthContext] 组件已卸载，跳过状态更新');
          return;
        }

        if (error) {
          console.error('[AuthContext] 认证检查失败:', error);
          setIsAuthenticated(false);
          setUser(null);
        } else if (session && session.user) {
          console.log('[AuthContext] 找到现有会话:', session.user.email);
          setIsAuthenticated(true);
          setUser(session.user);
        } else {
          console.log('[AuthContext] 无现有会话');
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error('[AuthContext] 认证检查异常:', error);
        if (mounted) {
          setIsAuthenticated(false);
          setUser(null);
        }
      } finally {
        if (mounted) {
          clearTimeout(timeoutId);
          console.log('[AuthContext] 设置 isLoading = false');
          setIsLoading(false);
        }
      }
    };

    initAuth();

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[AuthContext] Auth state changed:', event);

        if (!mounted) return;

        if (session && session.user) {
          console.log('[AuthContext] 用户已登录:', session.user.email);
          setIsAuthenticated(true);
          setUser(session.user);
        } else {
          console.log('[AuthContext] 用户未登录');
          setIsAuthenticated(false);
          setUser(null);
        }
      }
    );

    return () => {
      console.log('[AuthContext] 清理订阅');
      mounted = false;
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextType = {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
