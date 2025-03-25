'use client';

import { useEffect, useState } from 'react';
import GrowthRecordForm from '@/components/GrowthRecordForm';

interface PageProps {
  params: {
    id: string;
  };
}

export default function EditRecordPage({ params }: PageProps) {
  const [record, setRecord] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const response = await fetch(`/api/records/${params.id}`);
        if (!response.ok) {
          throw new Error('获取记录失败');
        }
        const data = await response.json();
        setRecord(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取记录失败');
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [params.id]);

  if (loading) {
    return <div className="text-gray-500">加载中...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">编辑成长记录</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <GrowthRecordForm initialData={record} />
      </div>
    </div>
  );
} 