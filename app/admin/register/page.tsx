'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    // 检查是否已登录
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/admin');
      }
    };
    checkSession();
  }, [router, supabase.auth]);

  const autoRegister = async () => {
    setLoading(true);
    setError(null);
    setIsRetrying(false);

    try {
      console.log('开始注册流程...');
      
      // 1. 注册用户
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: 'me@moreyu.me',
        password: 'luckysonyu99',
        options: {
          emailRedirectTo: `${window.location.origin}/admin/login`,
        },
      });

      if (signUpError) {
        console.error('注册用户失败:', signUpError);
        throw signUpError;
      }

      console.log('用户注册成功:', signUpData);

      // 2. 等待2秒确保用户创建完成
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 3. 创建管理员记录
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .insert([
          {
            user_id: signUpData.user?.id,
            email: 'me@moreyu.me',
            role: 'admin',
            created_at: new Date().toISOString(),
          },
        ])
        .select();

      if (adminError) {
        console.error('创建管理员记录失败:', adminError);
        throw adminError;
      }

      console.log('管理员记录创建成功:', adminData);

      // 4. 登录用户
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: 'me@moreyu.me',
        password: 'luckysonyu99',
      });

      if (signInError) {
        console.error('登录失败:', signInError);
        throw signInError;
      }

      console.log('登录成功，准备跳转...');
      router.push('/admin');
    } catch (error: any) {
      console.error('注册过程出错:', error);
      setError(error.message || '注册失败，请重试');

      // 如果是数据库表不存在错误，尝试创建表
      if (error.message?.includes('relation "admin_users" does not exist')) {
        try {
          console.log('尝试创建 admin_users 表...');
          const { error: createTableError } = await supabase.rpc('create_admin_users_table');
          if (createTableError) {
            console.error('创建表失败:', createTableError);
          } else {
            console.log('表创建成功，准备重试...');
            // 重试注册流程
            if (retryCount < 3) {
              setRetryCount(prev => prev + 1);
              setIsRetrying(true);
              setTimeout(autoRegister, 5000);
            }
          }
        } catch (createTableError: any) {
          console.error('创建表时出错:', createTableError);
        }
      } else if (retryCount < 3) {
        setRetryCount(prev => prev + 1);
        setIsRetrying(true);
        setTimeout(autoRegister, 5000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">管理员注册</CardTitle>
          <CardDescription className="text-center">
            点击下方按钮自动注册管理员账号
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>错误</AlertTitle>
              <AlertDescription>
                {error}
                {retryCount >= 3 && (
                  <div className="mt-2">
                    <p>已达到最大重试次数，请刷新页面重试。</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => window.location.reload()}
                    >
                      刷新页面
                    </Button>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}
          
          {isRetrying && (
            <Alert className="mb-4">
              <AlertTitle>正在重试</AlertTitle>
              <AlertDescription>
                第 {retryCount} 次重试中...请稍候
              </AlertDescription>
            </Alert>
          )}

          <Button
            className="w-full"
            onClick={autoRegister}
            disabled={loading || isRetrying}
          >
            {loading || isRetrying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isRetrying ? '重试中...' : '注册中...'}
              </>
            ) : (
              '一键注册管理员账号'
            )}
          </Button>

          <div className="mt-4 text-sm text-gray-500 text-center">
            <p>邮箱: me@moreyu.me</p>
            <p>密码: luckysonyu99</p>
            <p className="mt-2">
              注册成功后请及时修改密码！
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 