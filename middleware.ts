import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const MAX_LOGIN_ATTEMPTS = 3;
const BLOCK_DURATION = 30 * 60 * 1000; // 30分钟

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // 检查用户是否已登录
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 如果是访问管理后台页面
  if (req.nextUrl.pathname.startsWith('/admin')) {
    // 如果用户未登录，重定向到登录页面
    if (!session) {
      const redirectUrl = new URL('/admin/login', req.url);
      redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // 验证用户是否是管理员
    const { data: userData } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    if (!userData) {
      // 如果不是管理员，重定向到未授权页面
      return NextResponse.redirect(new URL('/admin/unauthorized', req.url));
    }
  }

  // 如果已登录用户访问登录页面，重定向到管理后台
  if (req.nextUrl.pathname === '/admin/login' && session) {
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  return res;
}

// 配置需要进行中间件处理的路径
export const config = {
  matcher: [
    '/admin/:path*',
    '/admin/login',
  ],
}; 