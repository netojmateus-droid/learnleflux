import React, { useState } from 'react';
import PropTypes from 'prop-types';

const ImportPage = () => {
  const [activeTab, setActiveTab] = useState('paste'); // 'paste', 'upload', 'link'

  const renderTabContent = () => {
    switch (activeTab) {
      case 'paste':
        return (
          <div>
            <textarea
              className="w-full h-48 p-4 bg-white dark:bg-gray-800 border border-border-light dark:border-border-dark rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Paste your text here..."
            ></textarea>
            <input
              type="text"
              className="w-full mt-4 p-4 bg-white dark:bg-gray-800 border border-border-light dark:border-border-dark rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Title (optional)"
            />
          </div>
        );
      case 'upload':
        return (
          <div className="flex items-center justify-center w-full h-48 border-2 border-dashed border-border-light dark:border-border-dark rounded-2xl">
            <p className="text-gray-500">Drag & drop files or click to browse</p>
          </div>
        );
      case 'link':
        return (
          <input
            type="text"
            className="w-full p-4 bg-white dark:bg-gray-800 border border-border-light dark:border-border-dark rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter a URL (article or YouTube)"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 animate-page-enter">
      <h1 className="text-3xl font-lexend mb-6">Import Content</h1>
      <div className="flex mb-4 border-b border-border-light dark:border-border-dark">
        <TabButton
          label="Paste Text"
          isActive={activeTab === 'paste'}
          onClick={() => setActiveTab('paste')}
        />
        <TabButton
          label="Upload File"
          isActive={activeTab === 'upload'}
          onClick={() => setActiveTab('upload')}
        />
        <TabButton
          label="From Link"
          isActive={activeTab === 'link'}
          onClick={() => setActiveTab('link')}
        />
      </div>
      <div>{renderTabContent()}</div>
      <button className="w-full mt-6 py-3 bg-primary text-white font-bold rounded-2xl shadow-lg-soft hover:bg-primary-dark transition-colors">
        Start Reading
      </button>
    </div>
  );
};

const TabButton = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 -mb-px font-semibold border-b-2 transition-colors ${
      isActive
        ? 'border-primary text-primary dark:border-primary-light dark:text-primary-light'
        : 'border-transparent text-gray-500 hover:text-primary'
    }`}
  >
    {label}
  </button>
);

TabButton.propTypes = {
  label: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default ImportPage;
