import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db';
import GrowthRecord from '@/models/GrowthRecord';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const record = await GrowthRecord.findById(params.id)
      .populate('author', 'name');
    
    if (!record) {
      return NextResponse.json(
        { error: '记录不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json(record);
  } catch (error) {
    console.error('获取记录失败:', error);
    return NextResponse.json(
      { error: '获取记录失败' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json(
        { error: '未授权' },
        { status: 401 }
      );
    }

    await connectDB();
    const data = await request.json();
    
    const record = await GrowthRecord.findByIdAndUpdate(
      params.id,
      { ...data },
      { new: true }
    );

    if (!record) {
      return NextResponse.json(
        { error: '记录不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json(record);
  } catch (error) {
    console.error('更新记录失败:', error);
    return NextResponse.json(
      { error: '更新记录失败' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json(
        { error: '未授权' },
        { status: 401 }
      );
    }

    await connectDB();
    const record = await GrowthRecord.findByIdAndDelete(params.id);

    if (!record) {
      return NextResponse.json(
        { error: '记录不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: '删除成功' });
  } catch (error) {
    console.error('删除记录失败:', error);
    return NextResponse.json(
      { error: '删除记录失败' },
      { status: 500 }
    );
  }
} 