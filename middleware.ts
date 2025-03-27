import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const MAX_LOGIN_ATTEMPTS = 3;
const BLOCK_DURATION = 30 * 60 * 1000; // 30分钟

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 获取登录尝试信息
  const loginAttempts = request.cookies.get('login_attempts')?.value;
  const lastAttemptTime = request.cookies.get('last_attempt_time')?.value;
  const attempts = loginAttempts ? parseInt(loginAttempts) : 0;
  const lastAttempt = lastAttemptTime ? parseInt(lastAttemptTime) : 0;

  // 检查是否在封禁期内
  const isBlocked = attempts >= MAX_LOGIN_ATTEMPTS && (Date.now() - lastAttempt) < BLOCK_DURATION;

  // 如果用户未登录且访问管理页面
  if (!session && request.nextUrl.pathname.startsWith('/admin')) {
    // 如果是登录页面且在封禁期内，重定向到未授权页面
    if (request.nextUrl.pathname === '/admin/login' && isBlocked) {
      const redirectUrl = new URL('/admin/unauthorized', request.url);
      return NextResponse.redirect(redirectUrl);
    }
    
    // 如果不是登录页面，重定向到登录页面
    if (!request.nextUrl.pathname.startsWith('/admin/login') && 
        !request.nextUrl.pathname.startsWith('/admin/unauthorized')) {
      const redirectUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // 如果用户已登录且访问登录页面，重定向到管理首页
  if (session && request.nextUrl.pathname.startsWith('/admin/login')) {
    const redirectUrl = new URL('/admin', request.url);
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: '/admin/:path*',
}; 