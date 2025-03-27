'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface Album {
  id: number;
  title: string;
  description: string;
  cover_image: string;
  created_at: string;
  updated_at: string;
}

export default function AlbumsPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/admin/login');
        return;
      }

      // 验证用户是否是管理员
      const { data: userData } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (!userData) {
        router.push('/admin/unauthorized');
        return;
      }

      setIsLoading(false);
    };

    checkSession();

    // 设置实时订阅
    const subscription = supabase
      .channel('album_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'albums' }, (payload) => {
        // 当数据发生变化时，刷新页面
        window.location.reload();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  useEffect(() => {
    const fetchAlbums = async () => {
      const { data, error } = await supabase
        .from('albums')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setError(error.message);
        return;
      }

      setAlbums(data || []);
    };

    fetchAlbums();
  }, [supabase]);

  const handleEdit = (album: Album) => {
    setEditingAlbum(album);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!editingAlbum) return;

    const { error } = await supabase
      .from('albums')
      .update({
        title: editingAlbum.title,
        description: editingAlbum.description,
        cover_image: editingAlbum.cover_image,
      })
      .eq('id', editingAlbum.id);

    if (error) {
      setError(error.message);
      return;
    }

    setIsEditing(false);
    setEditingAlbum(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个相册吗？')) return;

    const { error } = await supabase
      .from('albums')
      .delete()
      .eq('id', id);

    if (error) {
      setError(error.message);
      return;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-candy-pink"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-candy-pink/5 via-candy-blue/5 to-candy-yellow/5 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-qingke text-candy-purple">
            相册管理
          </h1>
          <p className="mt-2 text-gray-600">
            管理网站上的相册内容
          </p>
        </motion.div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    标题
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    描述
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    封面图片
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {albums.map((album) => (
                  <tr key={album.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing && editingAlbum?.id === album.id ? (
                        <input
                          type="text"
                          value={editingAlbum.title}
                          onChange={(e) =>
                            setEditingAlbum({
                              ...editingAlbum,
                              title: e.target.value,
                            })
                          }
                          className="border rounded px-2 py-1"
                        />
                      ) : (
                        album.title
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {isEditing && editingAlbum?.id === album.id ? (
                        <textarea
                          value={editingAlbum.description}
                          onChange={(e) =>
                            setEditingAlbum({
                              ...editingAlbum,
                              description: e.target.value,
                            })
                          }
                          className="border rounded px-2 py-1 w-full"
                        />
                      ) : (
                        album.description
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing && editingAlbum?.id === album.id ? (
                        <input
                          type="text"
                          value={editingAlbum.cover_image}
                          onChange={(e) =>
                            setEditingAlbum({
                              ...editingAlbum,
                              cover_image: e.target.value,
                            })
                          }
                          className="border rounded px-2 py-1"
                        />
                      ) : (
                        album.cover_image
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing && editingAlbum?.id === album.id ? (
                        <button
                          onClick={handleSave}
                          className="text-green-600 hover:text-green-900 mr-2"
                        >
                          保存
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEdit(album)}
                          className="text-blue-600 hover:text-blue-900 mr-2"
                        >
                          编辑
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(album.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 