'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      router.push('/admin');
      router.refresh();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-candy-pink/20 via-candy-blue/20 to-candy-yellow/20">
      <div className="max-w-md w-full space-y-8 p-8 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
        <div className="text-center">
          <h2 className="text-3xl font-qingke text-candy-purple tracking-wider">
            管理员登录
            <span className="inline-block animate-bounce ml-2">🔐</span>
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSignIn}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                邮箱
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-candy-pink focus:border-candy-pink"
              />
            </div>
            <div>
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                密码
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-candy-pink focus:border-candy-pink"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-candy-pink to-candy-purple hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-candy-pink disabled:opacity-50"
          >
            {loading ? '登录中...' : '登录'}
          </button>
        </form>
      </div>
    </div>
  );
} 