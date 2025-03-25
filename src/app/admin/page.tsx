'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function AdminDashboard() {
  const { data: session } = useSession();

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          欢迎回来，{session?.user?.name}
        </h1>
        <p className="text-gray-600">
          在这里你可以管理 Luca 的成长记录和照片墙。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/admin/records"
          className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            成长记录
          </h2>
          <p className="text-gray-600">
            添加和管理 Luca 的成长记录，包括文字、图片和视频。
          </p>
        </Link>

        <Link
          href="/admin/gallery"
          className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            照片墙
          </h2>
          <p className="text-gray-600">
            管理照片墙，展示 Luca 的精彩瞬间。
          </p>
        </Link>
      </div>
    </div>
  );
} 