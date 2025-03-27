'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function RegisterPage() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstAdmin, setIsFirstAdmin] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const autoRegister = async () => {
      setIsLoading(true);
      setError('');

      try {
        // 注册新用户
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: 'me@moreyu.me',
          password: 'luckysonyu99',
        });

        if (authError) {
          throw authError;
        }

        if (authData.user) {
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
            throw adminError;
          }

          // 注册成功，重定向到登录页面
          router.push('/admin/login');
        }
      } catch (error: any) {
        setError(error.message || '注册失败');
      } finally {
        setIsLoading(false);
      }
    };

    autoRegister();
  }, [supabase, router]);

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
            请稍候...
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
            <div className="text-red-500 text-center">{error}</div>
          ) : null}
        </motion.div>
      </div>
    </div>
  );
} 