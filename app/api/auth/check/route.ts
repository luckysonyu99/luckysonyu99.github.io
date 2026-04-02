import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error('检查认证状态失败:', error);
      return NextResponse.json(
        { isAuthenticated: false, error: error.message },
        { status: 200 }
      );
    }

    if (session && session.user) {
      return NextResponse.json(
        {
          isAuthenticated: true,
          user: session.user
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { isAuthenticated: false },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('检查认证状态失败:', error);
    return NextResponse.json(
      { isAuthenticated: false, error: error.message },
      { status: 500 }
    );
  }
}
