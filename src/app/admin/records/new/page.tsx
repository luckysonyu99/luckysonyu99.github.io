'use client';

import GrowthRecordForm from '@/components/GrowthRecordForm';

export default function NewRecordPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">添加成长记录</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <GrowthRecordForm />
      </div>
    </div>
  );
} 