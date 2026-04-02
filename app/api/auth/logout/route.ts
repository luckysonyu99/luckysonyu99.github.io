import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('登出失败:', error);
      return NextResponse.json(
        { error: '登出失败', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: '登出成功' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('登出失败:', error);
    return NextResponse.json(
      { error: '服务器错误', details: error.message },
      { status: 500 }
    );
  }
}
