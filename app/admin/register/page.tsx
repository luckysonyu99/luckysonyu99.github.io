'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function RegisterPage() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const registerUser = async () => {
    try {
      // 注册新用户
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: 'me@moreyu.me',
        password: 'luckysonyu99',
        options: {
          emailRedirectTo: `${window.location.origin}/admin/login`,
        },
      });

      if (authError) {
        console.error('注册用户失败:', authError);
        throw authError;
      }

      if (!authData.user) {
        throw new Error('注册失败：未创建用户');
      }

      // 等待一段时间确保用户创建完成
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 添加用户到管理员表
      const { error: adminError } = await supabase
        .from('admin_users')
        .insert([
          {
            user_id: authData.user.id,
            email: authData.user.email,
          },
        ]);

      if (adminError) {
        console.error('添加管理员失败:', adminError);
        throw adminError;
      }

      // 注册成功，重定向到登录页面
      router.push('/admin/login');
    } catch (error: any) {
      console.error('注册过程出错:', error);
      throw error;
    }
  };

  useEffect(() => {
    const autoRegister = async () => {
      setIsLoading(true);
      setError('');

      try {
        await registerUser();
      } catch (error: any) {
        console.error('注册失败:', error);
        setError(error.message || '注册失败，请检查控制台了解详细信息');
        
        // 如果失败次数小于3次，5秒后重试
        if (retryCount < 3) {
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, 5000);
        }
      } finally {
        setIsLoading(false);
      }
    };

    autoRegister();
  }, [supabase, router, retryCount]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-candy-pink/5 via-candy-blue/5 to-candy-yellow/5 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="mt-6 text-3xl font-qingke text-candy-purple">
            正在创建管理员账号
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {retryCount > 0 ? `第 ${retryCount} 次尝试...` : '请稍候...'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/20"
        >
          {isLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-candy-pink"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center">
              <p>{error}</p>
              <p className="mt-2 text-sm">
                {retryCount < 3 
                  ? `将在5秒后进行第 ${retryCount + 1} 次尝试...`
                  : '已达到最大重试次数，请刷新页面重试'}
              </p>
            </div>
          ) : null}
        </motion.div>
      </div>
    </div>
  );
} 