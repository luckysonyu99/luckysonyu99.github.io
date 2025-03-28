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
  const [isAdding, setIsAdding] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    cover_image: '',
  });
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = e.target.files?.[0];
      if (!file) return;

      // 检查文件大小（限制为 5MB）
      if (file.size > 5 * 1024 * 1024) {
        setError('图片大小不能超过 5MB');
        return;
      }

      // 检查文件类型
      if (!file.type.startsWith('image/')) {
        setError('只能上传图片文件');
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('albums')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('albums')
        .getPublicUrl(filePath);

      if (isEditing && editingAlbum) {
        setEditingAlbum({
          ...editingAlbum,
          cover_image: publicUrl,
        });
      } else {
        setFormData({
          ...formData,
          cover_image: publicUrl,
        });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('图片上传失败，请重试');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (album: Album) => {
    setEditingAlbum(album);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!editingAlbum) return;

    try {
      const { error } = await supabase
        .from('albums')
        .update({
          title: editingAlbum.title,
          description: editingAlbum.description,
          cover_image: editingAlbum.cover_image,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingAlbum.id);

      if (error) {
        console.error('Update error:', error);
        setError('保存失败，请重试');
        return;
      }

      // 更新本地状态
      setAlbums(albums.map(album => 
        album.id === editingAlbum.id ? editingAlbum : album
      ));

      setIsEditing(false);
      setEditingAlbum(null);
      setError('');
    } catch (error) {
      console.error('Save error:', error);
      setError('保存失败，请重试');
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!formData.title || !formData.description || !formData.cover_image) {
        setError('请填写所有必填字段');
        return;
      }

      const { data, error } = await supabase
        .from('albums')
        .insert([{
          ...formData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('Insert error:', error);
        throw error;
      }

      // 更新本地状态
      setAlbums([data, ...albums]);

      setIsAdding(false);
      setFormData({
        title: '',
        description: '',
        cover_image: '',
      });
      setError('');
    } catch (error) {
      console.error('Add error:', error);
      setError('添加相册失败，请重试');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个相册吗？')) return;

    try {
      const { error } = await supabase
        .from('albums')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Delete error:', error);
        setError('删除失败，请重试');
        return;
      }

      // 更新本地状态
      setAlbums(albums.filter(album => album.id !== id));
      setError('');
    } catch (error) {
      console.error('Delete error:', error);
      setError('删除失败，请重试');
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

        <div className="mb-8">
          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 bg-candy-pink text-white rounded-lg hover:bg-candy-purple transition-colors"
          >
            添加相册
          </button>
        </div>

        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-8"
          >
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">标题</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-candy-pink"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">描述</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-candy-pink"
                  rows={4}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">封面图片</label>
                <div className="flex items-center space-x-4">
                  {formData.cover_image && (
                    <img
                      src={formData.cover_image}
                      alt="预览"
                      className="h-20 w-20 object-cover rounded-lg"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-candy-pink"
                    required
                    disabled={uploading}
                  />
                </div>
                {uploading && <p className="text-sm text-gray-500 mt-2">上传中...</p>}
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setFormData({
                      title: '',
                      description: '',
                      cover_image: '',
                    });
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-4 py-2 bg-candy-pink text-white rounded-lg hover:bg-candy-purple transition-colors disabled:opacity-50"
                >
                  添加相册
                </button>
              </div>
            </form>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {albums.map((album, index) => (
            <motion.div
              key={album.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
            >
              <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                <img
                  src={album.cover_image}
                  alt={album.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <h2 className="text-2xl font-qingke text-candy-purple mb-2">
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
                    className="w-full px-2 py-1 border rounded"
                  />
                ) : (
                  album.title
                )}
              </h2>
              <p className="text-gray-700 mb-4">
                {isEditing && editingAlbum?.id === album.id ? (
                  <textarea
                    value={editingAlbum.description}
                    onChange={(e) =>
                      setEditingAlbum({
                        ...editingAlbum,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-2 py-1 border rounded"
                    rows={3}
                  />
                ) : (
                  album.description
                )}
              </p>
              <div className="flex justify-end space-x-4">
                {isEditing && editingAlbum?.id === album.id ? (
                  <button
                    onClick={handleSave}
                    className="text-green-600 hover:text-green-900"
                  >
                    保存
                  </button>
                ) : (
                  <button
                    onClick={() => handleEdit(album)}
                    className="text-blue-600 hover:text-blue-900"
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
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 