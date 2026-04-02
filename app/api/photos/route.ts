import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - 获取所有照片
export async function GET(request: NextRequest) {
  try {
    const { data: photos, error } = await supabase
      .from('photos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('获取照片失败:', error);
      return NextResponse.json(
        { error: '获取照片失败', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ photos }, { status: 200 });
  } catch (error: any) {
    console.error('获取照片失败:', error);
    return NextResponse.json(
      { error: '服务器错误', details: error.message },
      { status: 500 }
    );
  }
}

// POST - 创建新照片
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
    const { title, description, image_url, category } = body;

    // 验证必填字段
    if (!title || !description || !image_url || !category) {
      return NextResponse.json(
        { error: '缺少必填字段' },
        { status: 400 }
      );
    }

    const { data: photo, error } = await supabase
      .from('photos')
      .insert({
        title,
        description,
        image_url,
        category,
      })
      .select()
      .single();

    if (error) {
      console.error('创建照片失败:', error);
      return NextResponse.json(
        { error: '创建照片失败', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ photo }, { status: 201 });
  } catch (error: any) {
    console.error('创建照片失败:', error);
    return NextResponse.json(
      { error: '服务器错误', details: error.message },
      { status: 500 }
    );
  }
}

// PUT - 更新照片
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
    const { id, title, description, image_url, category } = body;

    if (!id) {
      return NextResponse.json(
        { error: '缺少照片 ID' },
        { status: 400 }
      );
    }

    const { data: photo, error } = await supabase
      .from('photos')
      .update({
        title,
        description,
        image_url,
        category,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('更新照片失败:', error);
      return NextResponse.json(
        { error: '更新照片失败', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ photo }, { status: 200 });
  } catch (error: any) {
    console.error('更新照片失败:', error);
    return NextResponse.json(
      { error: '服务器错误', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - 删除照片
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
        { error: '缺少照片 ID' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('photos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('删除照片失败:', error);
      return NextResponse.json(
        { error: '删除照片失败', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: '删除成功' }, { status: 200 });
  } catch (error: any) {
    console.error('删除照片失败:', error);
    return NextResponse.json(
      { error: '服务器错误', details: error.message },
      { status: 500 }
    );
  }
}
