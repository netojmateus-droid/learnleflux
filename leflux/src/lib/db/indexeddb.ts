import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { TextItem, VocabEntry, UserPrefs } from '@/types';
import { getLatestVersion, runMigrations } from './migrations';
import { TEXT_STORE, VOCAB_STORE, PREFS_STORE, StoreName } from './constants';

const DB_NAME = 'leflux-db';
const DB_VERSION = getLatestVersion();

interface LeFluxDB extends DBSchema {
  [TEXT_STORE]: {
    key: string;
    value: TextItem;
  };
  [VOCAB_STORE]: {
    key: string;
    value: VocabEntry;
  };
  [PREFS_STORE]: {
    key: string;
    value: UserPrefs;
  };
}

let dbPromise: Promise<IDBPDatabase<LeFluxDB>> | null = null;

async function getDatabase(): Promise<IDBPDatabase<LeFluxDB>> {
  if (!dbPromise) {
    dbPromise = openDB<LeFluxDB>(DB_NAME, DB_VERSION, {
      upgrade(database, oldVersion, newVersion, transaction) {
        void transaction;
        runMigrations(database, oldVersion, newVersion ?? null);
      },
    });
  }
  return dbPromise;
}

export const db = {
  async getAllTexts() {
    const database = await getDatabase();
    return database.getAll(TEXT_STORE);
  },
  async getText(id: string) {
    const database = await getDatabase();
    return database.get(TEXT_STORE, id);
  },
  async putText(text: TextItem) {
    const database = await getDatabase();
    return database.put(TEXT_STORE, text);
  },
  async deleteText(id: string) {
    const database = await getDatabase();
    return database.delete(TEXT_STORE, id);
  },
  async clearTexts() {
    const database = await getDatabase();
    await database.clear(TEXT_STORE);
  },
  async getAllVocab() {
    const database = await getDatabase();
    return database.getAll(VOCAB_STORE);
  },
  async getVocab(id: string) {
    const database = await getDatabase();
    return database.get(VOCAB_STORE, id);
  },
  async putVocab(entry: VocabEntry) {
    const database = await getDatabase();
    return database.put(VOCAB_STORE, entry);
  },
  async deleteVocab(id: string) {
    const database = await getDatabase();
    return database.delete(VOCAB_STORE, id);
  },
  async clearVocab() {
    const database = await getDatabase();
    await database.clear(VOCAB_STORE);
  },
  async getPrefs() {
    const database = await getDatabase();
    return database.get(PREFS_STORE, 'user');
  },
  async putPrefs(prefs: UserPrefs) {
    const database = await getDatabase();
    return database.put(PREFS_STORE, prefs, 'user');
  },
  async clearPrefs() {
    const database = await getDatabase();
    await database.delete(PREFS_STORE, 'user');
  },
};

export async function initDB() {
  return getDatabase();
}

export type { LeFluxDB };
export { TEXT_STORE, VOCAB_STORE, PREFS_STORE } from './constants';
export { DB_VERSION };