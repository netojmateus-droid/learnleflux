import React from 'react';
import PageRenderer from './components/PageRenderer';
import BottomNav from './components/BottomNav';

function App() {
  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-sans text-gray-900 dark:text-gray-100">
      <div className="flex-grow pb-16">
        <PageRenderer />
      </div>
      <BottomNav />
    </div>
  );
}

export default App;
