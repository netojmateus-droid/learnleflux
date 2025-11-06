import { openDB, DBSchema } from 'idb';
import { TextItem, VocabEntry, UserPrefs } from '@/types';
import type { PersistStorage } from 'zustand/middleware';

const DB_NAME = 'LinguaFlowDB';
const DB_VERSION = 1;

interface LinguaFlowDB extends DBSchema {
  texts: {
    key: string;
    value: TextItem;
    indexes: { 'by-lastRead': number };
  };
  vocabulary: {
    key: string;
    value: VocabEntry;
    indexes: { 'by-lang': string; 'by-nextReview': number };
  };
  preferences: {
    key: string;
    value: string; // Storing the stringified state from Zustand
  };
}

export const dbPromise = openDB<LinguaFlowDB>(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('texts')) {
      const store = db.createObjectStore('texts', { keyPath: 'id' });
      store.createIndex('by-lastRead', 'lastRead');
    }
    if (!db.objectStoreNames.contains('vocabulary')) {
      const store = db.createObjectStore('vocabulary', { keyPath: 'id' });
      store.createIndex('by-lang', 'lang');
      // FIX: Removed index on 'srs.nextReview' as IndexedDB does not support key paths on nested objects.
      // This would cause a runtime error. The review logic already filters in-memory.
    }
    if (!db.objectStoreNames.contains('preferences')) {
      db.createObjectStore('preferences'); // No keyPath, we use an explicit key
    }
  },
});

export const idbStorage = {
  getItem: async (name: string): Promise<string | null> => {
    const db = await dbPromise;
    const storeName = name.split('-')[0];

    if (storeName === 'preferences') {
      return (await db.get('preferences', 'user-prefs')) ?? null;
    }

    if (storeName === 'texts' || storeName === 'vocabulary') {
      const items = await db.getAll(storeName as 'texts' | 'vocabulary');
      const state = { [storeName]: items };
      return JSON.stringify({ state, version: 0 });
    }

    return null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    const db = await dbPromise;
    const storeName = name.split('-')[0];

    if (storeName === 'preferences') {
      await db.put('preferences', value, 'user-prefs');
      return;
    }

    if (storeName === 'texts' || storeName === 'vocabulary') {
      const { state } = JSON.parse(value);
      const items = state[storeName];
      if (!Array.isArray(items)) return;

      const tx = db.transaction(storeName as 'texts' | 'vocabulary', 'readwrite');
      await tx.store.clear();
      for (const item of items) {
        tx.store.put(item);
      }
      await tx.done;
      return;
    }
  },
  removeItem: async (name: string): Promise<void> => {
    const db = await dbPromise;
    const storeName = name.split('-')[0];
    if (storeName === 'preferences') {
      await db.delete('preferences', 'user-prefs');
    } else if (storeName === 'texts' || storeName === 'vocabulary') {
      await db.clear(storeName as 'texts' | 'vocabulary');
    }
  },
} as unknown as PersistStorage<any>;