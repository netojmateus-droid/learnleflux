import React from 'react';
import ReactPlayer from 'react-player';

const VideoStudyPage = () => {
  // Example YouTube URL - this would come from the global state
  const videoUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

  return (
    <div className="p-4 animate-page-enter">
      <h1 className="text-3xl font-lexend mb-6">Video Study Room</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Video Player */}
        <div className="aspect-video">
          <ReactPlayer
            url={videoUrl}
            width="100%"
            height="100%"
            controls
          />
        </div>

        {/* Active Notebook */}
        <div>
          <h2 className="text-2xl font-lexend mb-4">Active Notebook</h2>
          <textarea
            className="w-full h-96 p-4 bg-white dark:bg-gray-800 border border-border-light dark:border-border-dark rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Type your transcriptions and notes here..."
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default VideoStudyPage;
