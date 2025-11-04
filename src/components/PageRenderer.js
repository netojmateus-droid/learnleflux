import React, { useContext } from 'react';
import { GlobalStateContext } from '../context/GlobalState';

// Import pages
import ImportPage from '../pages/ImportPage';
import VideoStudyPage from '../pages/VideoStudyPage';
import LibraryPage from '../pages/LibraryPage';
import VocabPage from '../pages/VocabPage';
import ReviewPage from '../pages/ReviewPage';
import AccountPage from '../pages/AccountPage';

const PageRenderer = () => {
  const { page } = useContext(GlobalStateContext);

  const renderPage = () => {
    switch (page) {
      case 'import':
        return <ImportPage />;
      case 'video-study':
        return <VideoStudyPage />;
      case 'library':
        return <LibraryPage />;
      case 'vocabulary':
        return <VocabPage />;
      case 'review':
        return <ReviewPage />;
      case 'account':
        return <AccountPage />;
      default:
        return <LibraryPage />; // Default to library page now
    }
  };

  return <main className="flex-grow">{renderPage()}</main>;
};

export default PageRenderer;
