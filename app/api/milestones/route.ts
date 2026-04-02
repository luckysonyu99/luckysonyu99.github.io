import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - 获取所有里程碑
export async function GET(request: NextRequest) {
  try {
    const { data: milestones, error } = await supabase
      .from('milestones')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('获取里程碑失败:', error);
      return NextResponse.json(
        { error: '获取里程碑失败', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ milestones }, { status: 200 });
  } catch (error: any) {
    console.error('获取里程碑失败:', error);
    return NextResponse.json(
      { error: '服务器错误', details: error.message },
      { status: 500 }
    );
  }
}

// POST - 创建新里程碑
export async function POST(request: NextRequest) {
  try {
    // 验证用户是否已登录
    const { data: { session }, error: authError } = await supabase.auth.getSession();

    if (authError || !session) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, description, date, image_url } = body;

    // 验证必填字段
    if (!title || !description || !date) {
      return NextResponse.json(
        { error: '缺少必填字段' },
        { status: 400 }
      );
    }

    const { data: milestone, error } = await supabase
      .from('milestones')
      .insert({
        title,
        description,
        date,
        image_url: image_url || null,
      })
      .select()
      .single();

    if (error) {
      console.error('创建里程碑失败:', error);
      return NextResponse.json(
        { error: '创建里程碑失败', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ milestone }, { status: 201 });
  } catch (error: any) {
    console.error('创建里程碑失败:', error);
    return NextResponse.json(
      { error: '服务器错误', details: error.message },
      { status: 500 }
    );
  }
}

// PUT - 更新里程碑
export async function PUT(request: NextRequest) {
  try {
    // 验证用户是否已登录
    const { data: { session }, error: authError } = await supabase.auth.getSession();

    if (authError || !session) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, title, description, date, image_url } = body;

    if (!id) {
      return NextResponse.json(
        { error: '缺少里程碑 ID' },
        { status: 400 }
      );
    }

    const { data: milestone, error } = await supabase
      .from('milestones')
      .update({
        title,
        description,
        date,
        image_url,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('更新里程碑失败:', error);
      return NextResponse.json(
        { error: '更新里程碑失败', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ milestone }, { status: 200 });
  } catch (error: any) {
    console.error('更新里程碑失败:', error);
    return NextResponse.json(
      { error: '服务器错误', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - 删除里程碑
export async function DELETE(request: NextRequest) {
  try {
    // 验证用户是否已登录
    const { data: { session }, error: authError } = await supabase.auth.getSession();

    if (authError || !session) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: '缺少里程碑 ID' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('milestones')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('删除里程碑失败:', error);
      return NextResponse.json(
        { error: '删除里程碑失败', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: '删除成功' }, { status: 200 });
  } catch (error: any) {
    console.error('删除里程碑失败:', error);
    return NextResponse.json(
      { error: '服务器错误', details: error.message },
      { status: 500 }
    );
  }
}
