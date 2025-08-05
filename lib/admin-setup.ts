import { supabase } from './auth';

// 创建默认管理员账号
export async function createDefaultAdmin() {
  try {
    // 检查是否已有管理员
    const { data: existingAdmins, error: checkError } = await supabase
      .from('admin_users')
      .select('*')
      .limit(1);

    if (checkError && checkError.code !== '42P01') {
      console.error('检查管理员失败:', checkError);
      return { success: false, error: checkError.message };
    }

    // 如果已有管理员，不需要创建
    if (existingAdmins && existingAdmins.length > 0) {
      console.log('管理员已存在');
      return { success: true, message: '管理员已存在' };
    }

    // 创建默认管理员账号
    const defaultEmail = 'admin@luca.com';
    const defaultPassword = 'luca2024';

    // 注册用户
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: defaultEmail,
      password: defaultPassword,
    });

    if (signUpError) {
      console.error('注册管理员失败:', signUpError);
      return { success: false, error: signUpError.message };
    }

    if (!signUpData.user) {
      return { success: false, error: '用户创建失败' };
    }

    // 添加到管理员表
    const { error: insertError } = await supabase
      .from('admin_users')
      .insert({
        user_id: signUpData.user.id,
        email: defaultEmail,
      });

    if (insertError) {
      console.error('添加管理员失败:', insertError);
      return { success: false, error: insertError.message };
    }

    return { 
      success: true, 
      message: '默认管理员创建成功',
      credentials: {
        email: defaultEmail,
        password: defaultPassword
      }
    };
  } catch (error: any) {
    console.error('创建管理员异常:', error);
    return { success: false, error: error.message };
  }
}

// 验证管理员权限
export async function verifyAdminAccess(userId: string) {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('验证管理员权限失败:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('验证管理员权限异常:', error);
    return false;
  }
}

// 初始化数据库表
export async function initializeTables() {
  try {
    // 检查并创建 admin_users 表
    const { error: createTableError } = await supabase.rpc('create_admin_users_table_if_not_exists');
    
    if (createTableError) {
      console.error('创建表失败:', createTableError);
      return { success: false, error: createTableError.message };
    }

    return { success: true, message: '数据库表初始化成功' };
  } catch (error: any) {
    console.error('初始化数据库表异常:', error);
    return { success: false, error: error.message };
  }
}

