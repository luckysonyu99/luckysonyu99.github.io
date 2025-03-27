import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

interface Milestone {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  image_url?: string;
}

export async function generateStaticParams() {
  const supabase = createClient();
  try {
    const { data: milestones } = await supabase
      .from('milestones')
      .select('id');

    return (milestones || []).map((milestone) => ({
      id: milestone.id,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default async function MilestonePage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  let milestone: Milestone | null = null;

  try {
    const { data, error } = await supabase
      .from('milestones')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) throw error;
    milestone = data;
  } catch (error) {
    console.error('Error fetching milestone:', error);
    notFound();
  }

  if (!milestone) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-qingke text-candy-purple">{milestone.title}</h1>
          <Link
            href="/admin/milestones"
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            返回列表
          </Link>
        </div>

        {milestone.image_url && (
          <div className="relative h-64 mb-8 rounded-lg overflow-hidden">
            <img
              src={milestone.image_url}
              alt={milestone.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        )}

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-qingke text-candy-purple mb-2">日期</h2>
            <p className="text-gray-700">{milestone.date}</p>
          </div>

          <div>
            <h2 className="text-xl font-qingke text-candy-purple mb-2">分类</h2>
            <p className="text-gray-700">{milestone.category}</p>
          </div>

          <div>
            <h2 className="text-xl font-qingke text-candy-purple mb-2">描述</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{milestone.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 