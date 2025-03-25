import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db';
import GrowthRecord from '@/models/GrowthRecord';

export async function GET() {
  try {
    await connectDB();
    const records = await GrowthRecord.find()
      .sort({ date: -1 })
      .populate('author', 'name');
    
    return NextResponse.json(records);
  } catch (error) {
    console.error('获取记录失败:', error);
    return NextResponse.json(
      { error: '获取记录失败' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
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
    
    const record = await GrowthRecord.create({
      ...data,
      author: session.user.id,
    });

    return NextResponse.json(record);
  } catch (error) {
    console.error('创建记录失败:', error);
    return NextResponse.json(
      { error: '创建记录失败' },
      { status: 500 }
    );
  }
} 