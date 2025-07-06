import { useState, useCallback } from 'react';
import type { SplashAnimation } from '@/types';

export const useTheme = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [splash, setSplash] = useState<SplashAnimation>({ 
    show: false, 
    x: 0, 
    y: 0, 
    toDark: false 
  });

  const toggleTheme = useCallback((event?: React.MouseEvent<HTMLButtonElement>) => {
    if (!event) {
      setDarkMode((prev: boolean) => !prev);
      return;
    }

    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const rootRect = document.body.getBoundingClientRect();
    
    const x = rect.left + rect.width / 2 - rootRect.left;
    const y = rect.top + rect.height / 2 - rootRect.top;
    
    setSplash({ 
      show: true, 
      x, 
      y, 
      toDark: !darkMode 
    });
  }, [darkMode]);

  const completeSplashAnimation = useCallback(() => {
    setSplash((prev: SplashAnimation) => {
      if (prev.toDark !== darkMode) {
        setDarkMode(prev.toDark);
      }
      return { ...prev, show: false };
    });
  }, [darkMode]);

  return {
    darkMode,
    splash,
    toggleTheme,
    completeSplashAnimation
  };
}; 