import { getMilestone } from '@/models/milestone';
import EditMilestoneForm from './EditMilestoneForm';

export async function generateStaticParams() {
  // 由于这是管理页面，我们可以返回一个空数组
  // 这意味着这个页面将不会在构建时生成
  return [];
}

export default async function EditMilestonePage({ params }: { params: { id: string } }) {
  const milestone = await getMilestone(parseInt(params.id));

  if (!milestone) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500">未找到里程碑</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">编辑里程碑 ✨</h1>
      <EditMilestoneForm milestone={milestone} />
    </div>
  );
} 