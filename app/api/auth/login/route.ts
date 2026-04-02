import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: '邮箱和密码不能为空' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('登录失败:', error);
      return NextResponse.json(
        { error: '登录失败', details: error.message },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        user: data.user,
        session: data.session
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('登录失败:', error);
    return NextResponse.json(
      { error: '服务器错误', details: error.message },
      { status: 500 }
    );
  }
}
