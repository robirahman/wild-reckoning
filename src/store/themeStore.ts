import { create } from 'zustand';

interface ThemeState {
  theme: 'light' | 'dark';
  toggle: () => void;
}

export const useThemeStore = create<ThemeState>((set) => {
  // Load saved theme and apply it
  const saved = localStorage.getItem('wild-reckoning-theme') as 'light' | 'dark' | null;
  const initial = saved ?? 'light';
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', initial);
  }

  return {
    theme: initial,
    toggle() {
      set((s) => {
        const next = s.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('wild-reckoning-theme', next);
        document.documentElement.setAttribute('data-theme', next);
        return { theme: next };
      });
    },
  };
});
