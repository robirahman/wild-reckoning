import { useThemeStore } from '../store/themeStore';

export function ThemeToggle() {
  const { theme, toggle } = useThemeStore();
  return (
    <button
      onClick={toggle}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      style={{
        background: 'none',
        border: '1px solid var(--color-border)',
        borderRadius: 3,
        padding: '4px 10px',
        fontFamily: 'var(--font-ui)',
        fontSize: '0.8rem',
        cursor: 'pointer',
        color: 'var(--color-text)',
      }}
    >
      {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
    </button>
  );
}
