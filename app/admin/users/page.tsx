'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

interface User {
  id: string;
  email: string;
  full_name?: string;
  role: 'admin' | 'family' | 'friend' | 'visitor';
  relationship?: string;
  is_active: boolean;
  created_at: string;
  last_login_at?: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'visitor' as User['role'],
    relationship: '',
  });

  const roleLabels = {
    admin: '爸爸妈妈',
    family: '家人',
    friend: '朋友',
    visitor: '访客',
  };

  const relationshipOptions = [
    '爷爷', '奶奶', '外公', '外婆',
    '叔叔', '阿姨', '舅舅', '舅妈',
    '姑姑', '姑父', '伯伯', '伯母'
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setUsers(data || []);
    } catch (error) {
      console.error('获取用户失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const { error } = await supabase
          .from('admin_profiles')
          .update({
            full_name: formData.full_name,
            role: formData.role,
            relationship: formData.relationship,
          })
          .eq('id', isEditing);

        if (error) throw error;
      } else {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });

        if (authError) throw authError;

        if (authData.user) {
          const { error: profileError } = await supabase
            .from('admin_profiles')
            .insert({
              id: authData.user.id,
              email: formData.email,
              full_name: formData.full_name,
              role: formData.role,
              relationship: formData.relationship,
            });

          if (profileError) throw profileError;
        }
      }

      await fetchUsers();
      setIsAdding(false);
      setIsEditing(null);
      setFormData({
        email: '',
        password: '',
        full_name: '',
        role: 'visitor',
        relationship: '',
      });
    } catch (error) {
      console.error('保存用户失败:', error);
      alert(`保存用户失败: ${(error as Error).message}`);
    }
  };

  const handleEdit = (user: User) => {
    setIsEditing(user.id);
    setFormData({
      email: user.email,
      password: '',
      full_name: user.full_name || '',
      role: user.role,
      relationship: user.relationship || '',
    });
    setIsAdding(true);
  };

  const handleToggleActive = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('admin_profiles')
        .update({ is_active: !currentStatus })
        .eq('id', userId);

      if (error) throw error;

      await fetchUsers();
    } catch (error) {
      console.error('更新用户状态失败:', error);
      alert(`更新用户状态失败: ${(error as Error).message}`);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('确定要删除这个用户吗？此操作不可恢复！')) return;

    try {
      const { error } = await supabase
        .from('admin_profiles')
        .update({ is_active: false })
        .eq('id', userId);

      if (error) throw error;

      await fetchUsers();
      alert('用户已禁用');
    } catch (error) {
      console.error('删除用户失败:', error);
      alert(`删除用户失败: ${(error as Error).message}`);
    }
  };

  const getRoleBadge = (role: User['role']) => {
    const styles = {
      admin: 'bg-red-100 text-red-700',
      family: 'bg-blue-100 text-blue-700',
      friend: 'bg-green-100 text-green-700',
      visitor: 'bg-gray-100 text-gray-700',
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${styles[role]}`}>
        {roleLabels[role]}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-candy-pink"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-qingke text-candy-purple">用户管理</h1>
        <button
          onClick={() => setIsAdding(true)}
          className="px-4 py-2 bg-candy-pink text-white rounded-lg hover:bg-candy-purple transition-colors"
        >
          添加用户
        </button>
      </div>

      {/* 添加/编辑表单 */}
      {isAdding && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">邮箱</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-candy-pink"
                  required
                  disabled={!!isEditing}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">姓名</label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-candy-pink"
                />
              </div>
            </div>

            {!isEditing && (
              <div>
                <label className="block text-gray-700 mb-2">密码</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-candy-pink"
                  required={!isEditing}
                  minLength={6}
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">角色</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as User['role'] })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-candy-pink"
                  required
                >
                  <option value="visitor">访客</option>
                  <option value="friend">朋友</option>
                  <option value="family">家人</option>
                  <option value="admin">爸爸妈妈</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  爸爸妈妈：完全权限 | 家人：查看和评论 | 朋友：仅查看 | 访客：受限访问
                </p>
              </div>

              {formData.role === 'family' && (
                <div>
                  <label className="block text-gray-700 mb-2">称谓</label>
                  <select
                    value={formData.relationship}
                    onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-candy-pink"
                  >
                    <option value="">选择称谓</option>
                    {relationshipOptions.map(rel => (
                      <option key={rel} value={rel}>{rel}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setIsEditing(null);
                  setFormData({
                    email: '',
                    password: '',
                    full_name: '',
                    role: 'visitor',
                    relationship: '',
                  });
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-candy-pink text-white rounded-lg hover:bg-candy-purple transition-colors"
              >
                {isEditing ? '保存修改' : '添加用户'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* 用户列表 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-candy-pink/10">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                用户
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                角色
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                称谓
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                状态
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                创建时间
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {user.full_name || '未设置'}
                    </div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getRoleBadge(user.role)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.relationship || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      user.is_active
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {user.is_active ? '激活' : '禁用'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="text-candy-blue hover:text-candy-purple"
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => handleToggleActive(user.id, user.is_active)}
                    className="text-yellow-600 hover:text-yellow-700"
                  >
                    {user.is_active ? '禁用' : '激活'}
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-red-500 hover:text-red-700"
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
  );
}
