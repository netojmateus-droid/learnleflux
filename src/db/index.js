import { openDB } from 'idb';

const DB_NAME = 'LeFluxDB';
const DB_VERSION = 1;

export async function initDB() {
  const db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create a store for texts/stories
      if (!db.objectStoreNames.contains('texts')) {
        db.createObjectStore('texts', { keyPath: 'id', autoIncrement: true });
      }

      // Create a store for vocabulary
      if (!db.objectStoreNames.contains('vocabulary')) {
        const vocabStore = db.createObjectStore('vocabulary', { keyPath: 'id', autoIncrement: true });
        vocabStore.createIndex('term', 'term', { unique: true });
      }

      // Create a store for user settings
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' });
      }
    },
  });
  return db;
}

// You can add more specific data access functions here as needed
// For example:
// export async function getTexts() { ... }
// export async function addText(text) { ... }
// export async function getVocabulary() { ... }
// export async function addWord(word) { ... }
