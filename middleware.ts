import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const MAX_LOGIN_ATTEMPTS = 3;
const BLOCK_DURATION = 30 * 60 * 1000; // 30分钟

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // 检查用户是否已登录
  const { data: { session } } = await supabase.auth.getSession();

  // 检查是否是管理员路由
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
  const isLoginPage = req.nextUrl.pathname === '/admin/login';
  const isRegisterPage = req.nextUrl.pathname === '/admin/register';
  const isUnauthorizedPage = req.nextUrl.pathname === '/admin/unauthorized';

  // 如果是管理员路由
  if (isAdminRoute) {
    // 如果未登录，重定向到登录页面
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }

    // 验证用户是否是管理员
    const { data: userData } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    // 如果不是管理员，重定向到未授权页面
    if (!userData) {
      return NextResponse.redirect(new URL('/admin/unauthorized', req.url));
    }

    // 如果是管理员且访问登录页面，重定向到管理后台
    if (isLoginPage) {
      return NextResponse.redirect(new URL('/admin', req.url));
    }

    // 如果是注册页面，检查是否已经有管理员
    if (isRegisterPage) {
      const { data: adminUsers } = await supabase
        .from('admin_users')
        .select('*')
        .limit(1);

      // 如果已经有管理员，重定向到未授权页面
      if (adminUsers && adminUsers.length > 0) {
        return NextResponse.redirect(new URL('/admin/unauthorized', req.url));
      }
    }
  }

  return res;
}

// 配置需要进行中间件处理的路径
export const config = {
  matcher: [
    '/admin/:path*',
  ],
}; 