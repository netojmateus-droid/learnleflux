import React, { useContext } from 'react';
import { GlobalStateContext } from '../context/GlobalState';

// Placeholder icons - we'll replace these with actual SVG icons later
const LibraryIcon = () => <span>Lib</span>;
const VocabIcon = () => <span>Voc</span>;
const ReviewIcon = () => <span>Rev</span>;
const AccountIcon = () => <span>Acc</span>;

const navItems = [
  { id: 'library', label: 'Library', icon: <LibraryIcon /> },
  { id: 'vocabulary', label: 'Vocabulary', icon: <VocabIcon /> },
  { id: 'review', label: 'Review', icon: <ReviewIcon /> },
  { id: 'account', label: 'Account', icon: <AccountIcon /> },
];

const BottomNav = () => {
  const { page, setPage } = useContext(GlobalStateContext);

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-t border-border-light dark:border-border-dark flex justify-around items-center shadow-lg-soft">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setPage(item.id)}
          className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-200 ${
            page === item.id
              ? 'text-primary dark:text-primary-light'
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          {item.icon}
          <span className="text-xs mt-1">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;
