import { notFound } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/auth';

interface Milestone {
  id: string;
  title: string;
  description: string;
  image_url: string;
  date: string;
}

export async function generateStaticParams() {
  const { data: milestones } = await supabase
    .from('milestones')
    .select('id');

  return (milestones || []).map((milestone) => ({
    id: milestone.id.toString(),
  }));
}

export default async function MilestonePage({ params }: { params: { id: string } }) {
  const { data: milestone } = await supabase
    .from('milestones')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!milestone) {
    return <div>里程碑不存在</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-qingke text-candy-purple">{milestone.title}</h1>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
        <div className="space-y-6">
          {milestone.image_url && (
            <div className="relative h-64 rounded-lg overflow-hidden">
              <img
                src={milestone.image_url}
                alt={milestone.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          )}
          <div>
            <h2 className="text-xl font-qingke text-candy-purple mb-2">描述</h2>
            <p className="text-gray-700">{milestone.description}</p>
          </div>
          <div>
            <h2 className="text-xl font-qingke text-candy-purple mb-2">日期</h2>
            <p className="text-gray-700">{new Date(milestone.date).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 