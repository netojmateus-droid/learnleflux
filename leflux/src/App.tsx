import { BrowserRouter } from 'react-router-dom';
import { useEffect } from 'react';
import { AppRoutes } from '@/routes/AppRoutes';
import { usePrefsStore } from '@/store/prefsStore';
import { BottomNav } from '@/components/common/BottomNav';
import { ToastProvider } from '@/components/common/Toast';
import { Header } from '@/components/common/Header';
import { useI18n } from '@/services/i18n';

function ThemeWatcher() {
  const { prefs } = usePrefsStore();

  useEffect(() => {
    if (typeof document === 'undefined' || typeof window === 'undefined') return;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const mode = prefs.theme === 'auto' ? (prefersDark ? 'dark' : 'light') : prefs.theme;
    document.body.dataset.theme = mode;
    document.documentElement.classList.toggle('dark', mode === 'dark');
  }, [prefs.theme]);

  return null;
}

function LanguageWatcher() {
  const { locale, isRTL } = useI18n();

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.lang = locale.meta.code;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [locale.meta.code, isRTL]);

  return null;
}

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <ThemeWatcher />
        <LanguageWatcher />
        <Header />
        <div className="relative min-h-screen bg-gradient-to-b from-dark-base to-dark-base-secondary text-text-primary transition-colors duration-300 dark:from-dark-base dark:to-dark-base-secondary">
          <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,209,102,0.08),_transparent_55%)]" aria-hidden />

          <div className="relative flex min-h-screen flex-col">
            <main className="flex-1">
              <AppRoutes />
            </main>
          </div>

          <BottomNav />
        </div>
      </BrowserRouter>
    </ToastProvider>
  );
}