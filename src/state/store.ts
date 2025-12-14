import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeStore {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: 'dark',
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'light' ? 'dark' : 'light' 
      })),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'algorithm-visualizer-theme',
    }
  )
);

// Apply theme on load
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('algorithm-visualizer-theme');
  if (stored) {
    try {
      const { state } = JSON.parse(stored);
      if (state.theme === 'light') {
        document.documentElement.classList.add('light');
      } else {
        document.documentElement.classList.remove('light');
      }
    } catch {
      // Default to dark
    }
  }
}
