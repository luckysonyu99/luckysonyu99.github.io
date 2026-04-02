'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeName, themes, getCurrentTheme, saveTheme, applyTheme } from '@/lib/themes';

interface ThemeContextType {
  currentTheme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  theme: typeof themes[ThemeName];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>('preschool');
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const savedTheme = getCurrentTheme();
    setCurrentTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const setTheme = (newTheme: ThemeName) => {
    if (newTheme === currentTheme) return;

    setIsTransitioning(true);

    // 添加过渡动画
    document.body.style.transition = 'all 0.8s ease-in-out';

    setTimeout(() => {
      setCurrentTheme(newTheme);
      applyTheme(newTheme);

      setTimeout(() => {
        setIsTransitioning(false);
        document.body.style.transition = '';
      }, 800);
    }, 100);
  };

  const value: ThemeContextType = {
    currentTheme,
    setTheme,
    theme: themes[currentTheme],
  };

  return (
    <ThemeContext.Provider value={value}>
      <div className={`${isTransitioning ? 'opacity-90' : 'opacity-100'} transition-opacity duration-800`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
