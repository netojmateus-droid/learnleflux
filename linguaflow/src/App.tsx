
import React, { useEffect, Suspense, lazy } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { BottomNav } from './components/common/BottomNav';
import { usePrefsStore } from './store/prefsStore';
import { motion } from 'framer-motion';

const LibraryPage = lazy(() => import('./pages/Library'));
const ImportPage = lazy(() => import('./pages/Import'));
const ReaderPage = lazy(() => import('./pages/Reader'));
const VocabularyPage = lazy(() => import('./pages/Vocabulary'));
const ReviewPage = lazy(() => import('./pages/Review'));
const AccountPage = lazy(() => import('./pages/Account'));
const TextsPage = lazy(() => import('./pages/Texts'));
const StudyPage = lazy(() => import('./pages/Study'));


const App = () => {
  const theme = usePrefsStore((state) => state.prefs.theme);

  useEffect(() => {
    const root = window.document.documentElement;
    const isDark =
      theme === 'dark' ||
      (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    root.classList.toggle('dark', isDark);
  }, [theme]);

  return (
    <HashRouter>
      <div className="min-h-screen bg-gradient-to-b from-light-base-start to-light-base-end dark:from-dark-base-start dark:to-dark-base-end font-sans">
        <main className="pb-20 md:pb-0">
          <Suspense fallback={<LoadingSpinner/>}>
            <Routes>
              <Route path="/" element={<LibraryPage />} />
              <Route path="/import" element={<ImportPage />} />
              <Route path="/read/:id" element={<ReaderPage />} />
              <Route path="/study/:id" element={<StudyPage />} />
              <Route path="/vocabulary" element={<VocabularyPage />} />
              <Route path="/review" element={<ReviewPage />} />
              <Route path="/texts" element={<TextsPage />} />
              <Route path="/account" element={<AccountPage />} />
            </Routes>
          </Suspense>
        </main>
        <BottomNav />
      </div>
    </HashRouter>
  );
};

const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-screen">
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-t-accent border-white/20 rounded-full"
        />
    </div>
);


export default App;