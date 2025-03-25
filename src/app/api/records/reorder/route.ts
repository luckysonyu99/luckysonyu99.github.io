import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function PUT(request: Request) {
  try {
    const { updates } = await request.json();
    const { db } = await connectToDatabase();

    // 批量更新排序
    const bulkOps = updates.map((update: { id: string; order: number }) => ({
      updateOne: {
        filter: { _id: update.id },
        update: { $set: { order: update.order } },
      },
    }));

    await db.collection('records').bulkWrite(bulkOps);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('更新排序失败:', error);
    return NextResponse.json(
      { error: '更新排序失败' },
      { status: 500 }
    );
  }
} 