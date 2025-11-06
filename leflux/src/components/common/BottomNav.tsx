import { NavLink } from 'react-router-dom';
import { BookMarked, UploadCloud, Library, Sparkle, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '@/services/i18n';

export function BottomNav() {
  const { locale } = useI18n();
  const navItems = [
    { to: '/', label: locale.nav.library, icon: Library },
    { to: '/import', label: locale.nav.import, icon: UploadCloud },
    { to: '/vocabulary', label: locale.nav.vocabulary, icon: BookMarked },
    { to: '/review', label: locale.nav.review, icon: Sparkle },
    { to: '/account', label: locale.nav.account, icon: User },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-4 z-20 flex justify-center px-4">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="surface-glass flex w-full max-w-2xl items-center justify-around px-4 py-3 backdrop-blur-xl"
        >
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                isActive
                  ? 'flex flex-col items-center text-accent'
                  : 'flex flex-col items-center text-text-secondary hover:text-text-primary transition-colors duration-200'
              }
              aria-label={label}
            >
              <Icon className="h-5 w-5" aria-hidden />
              <span className="mt-1 text-xs font-medium">{label}</span>
            </NavLink>
          ))}
        </motion.div>
      </AnimatePresence>
    </nav>
  );
}
