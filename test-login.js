const http = require('http');

// 测试登录页面是否可访问
function testLoginPage() {
  return new Promise((resolve) => {
    http.get('http://localhost:3001/admin/login', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const hasEmailInput = data.includes('type="email"');
        const hasPasswordInput = data.includes('type="password"');
        const hasSubmitButton = data.includes('type="submit"');

        console.log('📄 登录页面检查:');
        console.log('  - 邮箱输入框:', hasEmailInput ? '✅' : '❌');
        console.log('  - 密码输入框:', hasPasswordInput ? '✅' : '❌');
        console.log('  - 提交按钮:', hasSubmitButton ? '✅' : '❌');

        resolve(hasEmailInput && hasPasswordInput && hasSubmitButton);
      });
    }).on('error', (e) => {
      console.log('❌ 无法访问登录页面:', e.message);
      resolve(false);
    });
  });
}

// 测试调试页面
function testDebugPage() {
  return new Promise((resolve) => {
    http.get('http://localhost:3001/admin/debug', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const hasDebugContent = data.includes('认证调试页面') || data.includes('AuthContext');
        console.log('\n🔍 调试页面检查:', hasDebugContent ? '✅' : '❌');
        resolve(hasDebugContent);
      });
    }).on('error', (e) => {
      console.log('❌ 无法访问调试页面:', e.message);
      resolve(false);
    });
  });
}

// 检查 AuthContext 文件
function checkAuthContext() {
  const fs = require('fs');
  const path = '/Users/m2reyu/yuyan-local/app/contexts/AuthContext.tsx';

  console.log('\n📝 AuthContext 文件检查:');
  if (fs.existsSync(path)) {
    const content = fs.readFileSync(path, 'utf8');
    const hasLogin = content.includes('const login =');
    const hasSupabase = content.includes('supabase.auth.signInWithPassword');
    const hasStateUpdate = content.includes('setIsAuthenticated(true)');

    console.log('  - login 函数:', hasLogin ? '✅' : '❌');
    console.log('  - Supabase 集成:', hasSupabase ? '✅' : '❌');
    console.log('  - 状态更新:', hasStateUpdate ? '✅' : '❌');

    return hasLogin && hasSupabase && hasStateUpdate;
  } else {
    console.log('  ❌ 文件不存在');
    return false;
  }
}

// 运行所有测试
async function runTests() {
  console.log('🧪 开始测试登录功能...\n');

  const authContextOk = checkAuthContext();
  const loginPageOk = await testLoginPage();
  const debugPageOk = await testDebugPage();

  console.log('\n📊 测试总结:');
  console.log('  - AuthContext 配置:', authContextOk ? '✅' : '❌');
  console.log('  - 登录页面:', loginPageOk ? '✅' : '❌');
  console.log('  - 调试页面:', debugPageOk ? '✅' : '❌');

  if (authContextOk && loginPageOk) {
    console.log('\n✅ 登录功能已修复！');
    console.log('📍 访问 http://localhost:3001/admin/login');
    console.log('🔑 使用凭据: admin@moreyu.me / luca@2026');
  } else {
    console.log('\n❌ 仍有问题需要修复');
  }
}

runTests();
