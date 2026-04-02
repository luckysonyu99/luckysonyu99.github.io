// 主题配置
export type ThemeName = 'preschool' | 'ultraman' | 'toy-car' | 'disney' | 'comic' | 'skateboard';

export interface Theme {
  name: ThemeName;
  displayName: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  gradients: {
    main: string;
    card: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  animations: {
    transition: string;
    hover: string;
  };
  icons: {
    main: string;
    decorative: string[];
  };
}

export const themes: Record<ThemeName, Theme> = {
  // 学前时期（当前主题）
  preschool: {
    name: 'preschool',
    displayName: '学前时期',
    colors: {
      primary: '#FF69B4',
      secondary: '#9370DB',
      accent: '#FFD700',
      background: 'from-pink-50 via-purple-50 to-yellow-50',
      text: '#4A5568',
    },
    gradients: {
      main: 'from-candy-pink via-candy-purple to-candy-yellow',
      card: 'from-pink-100 to-purple-100',
    },
    fonts: {
      heading: 'font-qingke',
      body: 'font-kuaile',
    },
    animations: {
      transition: 'transition-all duration-500 ease-in-out',
      hover: 'hover:scale-105 hover:rotate-2',
    },
    icons: {
      main: '🦖',
      decorative: ['🌈', '⭐', '🎈', '🎨', '🧸'],
    },
  },

  // 奥特曼主题
  ultraman: {
    name: 'ultraman',
    displayName: '奥特曼',
    colors: {
      primary: '#FF0000',
      secondary: '#0066CC',
      accent: '#FFD700',
      background: 'from-red-50 via-blue-50 to-gray-50',
      text: '#2D3748',
    },
    gradients: {
      main: 'from-red-500 via-blue-500 to-gray-700',
      card: 'from-red-100 to-blue-100',
    },
    fonts: {
      heading: 'font-bold',
      body: 'font-sans',
    },
    animations: {
      transition: 'transition-all duration-300 ease-out',
      hover: 'hover:scale-110 hover:shadow-2xl',
    },
    icons: {
      main: '⚡',
      decorative: ['💫', '🌟', '⭐', '✨', '🔥'],
    },
  },

  // 玩具汽车主题
  'toy-car': {
    name: 'toy-car',
    displayName: '玩具汽车',
    colors: {
      primary: '#FF6B35',
      secondary: '#004E89',
      accent: '#FFD23F',
      background: 'from-orange-50 via-blue-50 to-yellow-50',
      text: '#1A202C',
    },
    gradients: {
      main: 'from-orange-500 via-blue-600 to-yellow-400',
      card: 'from-orange-100 to-blue-100',
    },
    fonts: {
      heading: 'font-bold',
      body: 'font-sans',
    },
    animations: {
      transition: 'transition-all duration-400 ease-in-out',
      hover: 'hover:translate-x-2 hover:scale-105',
    },
    icons: {
      main: '🚗',
      decorative: ['🏎️', '🚙', '🚕', '🚌', '🚓'],
    },
  },

  // 迪士尼动画主题
  disney: {
    name: 'disney',
    displayName: '迪士尼',
    colors: {
      primary: '#FF1493',
      secondary: '#00CED1',
      accent: '#FFD700',
      background: 'from-pink-50 via-cyan-50 to-purple-50',
      text: '#2D3748',
    },
    gradients: {
      main: 'from-pink-400 via-cyan-400 to-purple-400',
      card: 'from-pink-100 to-cyan-100',
    },
    fonts: {
      heading: 'font-qingke',
      body: 'font-kuaile',
    },
    animations: {
      transition: 'transition-all duration-600 ease-in-out',
      hover: 'hover:scale-105 hover:-rotate-3',
    },
    icons: {
      main: '🏰',
      decorative: ['✨', '🌟', '⭐', '💫', '🎭'],
    },
  },

  // 漫画书主题
  comic: {
    name: 'comic',
    displayName: '漫画书',
    colors: {
      primary: '#FF4500',
      secondary: '#FFD700',
      accent: '#00CED1',
      background: 'from-orange-50 via-yellow-50 to-cyan-50',
      text: '#000000',
    },
    gradients: {
      main: 'from-orange-500 via-yellow-400 to-cyan-400',
      card: 'from-orange-100 to-yellow-100',
    },
    fonts: {
      heading: 'font-bold',
      body: 'font-sans',
    },
    animations: {
      transition: 'transition-all duration-300 ease-out',
      hover: 'hover:scale-110 hover:rotate-1',
    },
    icons: {
      main: '📚',
      decorative: ['💥', '⚡', '💫', '✨', '🎨'],
    },
  },

  // 滑板主题
  skateboard: {
    name: 'skateboard',
    displayName: '滑板',
    colors: {
      primary: '#00FF00',
      secondary: '#FF00FF',
      accent: '#00FFFF',
      background: 'from-green-50 via-purple-50 to-cyan-50',
      text: '#1A202C',
    },
    gradients: {
      main: 'from-green-400 via-purple-500 to-cyan-400',
      card: 'from-green-100 to-purple-100',
    },
    fonts: {
      heading: 'font-bold',
      body: 'font-sans',
    },
    animations: {
      transition: 'transition-all duration-500 ease-in-out',
      hover: 'hover:scale-105 hover:skew-x-3',
    },
    icons: {
      main: '🛹',
      decorative: ['🔥', '⚡', '💨', '✨', '🌟'],
    },
  },
};

// 获取当前主题
export const getCurrentTheme = (): ThemeName => {
  if (typeof window === 'undefined') return 'preschool';
  const saved = localStorage.getItem('theme');
  return (saved as ThemeName) || 'preschool';
};

// 保存主题
export const saveTheme = (theme: ThemeName) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('theme', theme);
  }
};

// 应用主题到 DOM
export const applyTheme = (themeName: ThemeName) => {
  if (typeof window === 'undefined') return;

  const theme = themes[themeName];
  const root = document.documentElement;

  // 设置 CSS 变量
  root.style.setProperty('--color-primary', theme.colors.primary);
  root.style.setProperty('--color-secondary', theme.colors.secondary);
  root.style.setProperty('--color-accent', theme.colors.accent);

  saveTheme(themeName);
};
