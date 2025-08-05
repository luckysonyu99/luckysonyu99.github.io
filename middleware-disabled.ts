// 临时禁用中间件以进行测试
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // 直接放行所有请求
  return NextResponse.next();
}

export const config = {
  matcher: [],
};

