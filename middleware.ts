import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  try {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });

    // 如果是访问管理后台相关页面（除了登录页面）
    if (req.nextUrl.pathname.startsWith('/admin') && req.nextUrl.pathname !== '/admin/login') {
      // 检查用户是否已登录
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        console.log('No session found, redirecting to login');
        const loginUrl = new URL('/admin/login', req.url);
        return NextResponse.redirect(loginUrl);
      }

      try {
        // 验证用户是否是管理员
        const { data: userData, error: userError } = await supabase
          .from('admin_users')
          .select('user_id, email')
          .eq('user_id', session.user.id)
          .single();

        // 如果不是管理员，重定向到登录页面
        if (userError || !userData) {
          console.log('User not found in admin_users table:', session.user.id);
          const loginUrl = new URL('/admin/login', req.url);
          return NextResponse.redirect(loginUrl);
        }
      } catch (error) {
        console.error('Admin verification error:', error);
        const loginUrl = new URL('/admin/login', req.url);
        return NextResponse.redirect(loginUrl);
      }
    }

    // 如果已登录管理员访问登录页面，重定向到管理后台
    if (req.nextUrl.pathname === '/admin/login') {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        try {
          const { data: userData } = await supabase
            .from('admin_users')
            .select('user_id')
            .eq('user_id', session.user.id)
            .single();

          if (userData) {
            const adminUrl = new URL('/admin', req.url);
            return NextResponse.redirect(adminUrl);
          }
        } catch (error) {
          // 如果验证失败，继续显示登录页面
          console.error('Admin check error on login page:', error);
        }
      }
    }

    return res;
  } catch (error) {
    console.error('Middleware error:', error);
    // 只有在不是登录页面时才重定向到登录页面
    if (req.nextUrl.pathname !== '/admin/login') {
      const loginUrl = new URL('/admin/login', req.url);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }
}

// 配置需要进行中间件处理的路径
export const config = {
  matcher: [
    '/admin/:path*',
  ],
}; 