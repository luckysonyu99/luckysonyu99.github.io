'use client';

import { useEffect } from 'react';
import { loadSettingsFromStorage, applyTheme, updateSiteMetadata } from '../../lib/settings';

export default function SettingsInitializer() {
  useEffect(() => {
    // 在客户端加载时应用设置
    const settings = loadSettingsFromStorage();
    
    // 应用主题
    applyTheme(settings.theme);
    
    // 更新网站元数据
    updateSiteMetadata(settings.siteTitle, settings.siteDescription);
  }, []);

  return null; // 这个组件不渲染任何内容
} 