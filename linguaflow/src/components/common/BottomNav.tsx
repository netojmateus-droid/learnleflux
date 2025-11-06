
import { NavLink } from 'react-router-dom';
import { Book, Layers3, Repeat, User, PenSquare } from 'lucide-react';

const navItems = [
  { path: '/', icon: Book, label: 'Library' },
  { path: '/vocabulary', icon: Layers3, label: 'Vocabulary' },
  { path: '/review', icon: Repeat, label: 'Review' },
  { path: '/texts', icon: PenSquare, label: 'Create' },
  { path: '/account', icon: User, label: 'Account' },
];

export const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-dark-base-end/50 backdrop-blur-lg border-t border-white/10 md:hidden z-50">
      <div className="flex justify-around items-center h-full max-w-md mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 text-dark-text-tertiary transition-colors duration-200 ${
                isActive ? 'text-accent' : 'hover:text-dark-text-primary'
              }`
            }
          >
            <item.icon size={24} />
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
