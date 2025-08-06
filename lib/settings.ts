'use client';

import userbase from 'userbase-js';

export interface SiteSettings {
  siteTitle: string;
  siteDescription: string;
  theme: 'pink-purple' | 'blue-yellow' | 'green-blue' | 'purple-pink';
  currentPassword?: string;
  newPassword?: string;
}

const DEFAULT_SETTINGS: SiteSettings = {
  siteTitle: "Luca's Growing Journey",
  siteDescription: "记录宝宝成长的点点滴滴",
  theme: 'pink-purple',
};

// 从localStorage加载设置
export const loadSettingsFromStorage = (): SiteSettings => {
  try {
    const stored = localStorage.getItem('site-settings');
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch (error) {
    console.error('加载设置失败:', error);
  }
  return DEFAULT_SETTINGS;
};

// 保存设置到localStorage
export const saveSettingsToStorage = (settings: Partial<SiteSettings>): void => {
  try {
    const currentSettings = loadSettingsFromStorage();
    const newSettings = { ...currentSettings, ...settings };
    localStorage.setItem('site-settings', JSON.stringify(newSettings));
  } catch (error) {
    console.error('保存设置失败:', error);
  }
};

// 从数据库加载设置
export const loadSettingsFromDatabase = async (): Promise<SiteSettings> => {
  try {
    await userbase.init({ appId: '0b2844f0-e722-4251-a270-35200be9756a' });
    
    const { items } = await userbase.openDatabase({
      databaseName: 'settings',
      changeHandler: () => {}
    });
    
    if (items.length > 0) {
      const dbSettings = items[0].item as SiteSettings;
      return { ...DEFAULT_SETTINGS, ...dbSettings };
    }
  } catch (error) {
    console.error('从数据库加载设置失败:', error);
  }
  
  return DEFAULT_SETTINGS;
};

// 保存设置到数据库
export const saveSettingsToDatabase = async (settings: Partial<SiteSettings>): Promise<boolean> => {
  try {
    await userbase.init({ appId: '0b2844f0-e722-4251-a270-35200be9756a' });
    
    const { items } = await userbase.openDatabase({
      databaseName: 'settings',
      changeHandler: () => {}
    });
    
    const currentSettings = loadSettingsFromStorage();
    const newSettings = { ...currentSettings, ...settings };
    
    if (items.length > 0) {
      // 更新现有设置
      await userbase.updateItem({
        databaseName: 'settings',
        itemId: items[0].itemId,
        item: newSettings,
      });
    } else {
      // 创建新设置
      await userbase.insertItem({
        databaseName: 'settings',
        item: newSettings,
      });
    }
    
    // 同时保存到localStorage
    saveSettingsToStorage(newSettings);
    
    return true;
  } catch (error) {
    console.error('保存设置到数据库失败:', error);
    return false;
  }
};

// 应用主题设置
export const applyTheme = (theme: SiteSettings['theme']): void => {
  const root = document.documentElement;
  
  // 移除所有主题类
  root.classList.remove('theme-pink-purple', 'theme-blue-yellow', 'theme-green-blue', 'theme-purple-pink');
  
  // 添加新主题类
  root.classList.add(`theme-${theme}`);
  
  // 保存主题设置
  saveSettingsToStorage({ theme });
};

// 获取当前主题
export const getCurrentTheme = (): SiteSettings['theme'] => {
  const settings = loadSettingsFromStorage();
  return settings.theme;
};

// 更新网站标题和描述
export const updateSiteMetadata = (title: string, description: string): void => {
  // 更新页面标题
  document.title = title;
  
  // 更新meta描述
  let metaDescription = document.querySelector('meta[name="description"]');
  if (!metaDescription) {
    metaDescription = document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    document.head.appendChild(metaDescription);
  }
  metaDescription.setAttribute('content', description);
  
  // 保存设置
  saveSettingsToStorage({ siteTitle: title, siteDescription: description });
}; 