import { IDBPDatabase } from 'idb';
import type { LeFluxDB } from './indexeddb';
import { TEXT_STORE, VOCAB_STORE, PREFS_STORE } from './constants';

export interface Migration {
  version: number;
  migrate: (db: IDBPDatabase<LeFluxDB>) => void | Promise<void>;
}

const migrations: Migration[] = [
  {
    version: 1,
    migrate: (db) => {
      if (!db.objectStoreNames.contains(TEXT_STORE)) {
        db.createObjectStore(TEXT_STORE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(VOCAB_STORE)) {
        db.createObjectStore(VOCAB_STORE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(PREFS_STORE)) {
        db.createObjectStore(PREFS_STORE);
      }
    },
  },
];

export function getLatestVersion() {
  return migrations[migrations.length - 1]?.version ?? 1;
}

export function runMigrations(db: IDBPDatabase<LeFluxDB>, oldVersion: number, newVersion: number | null) {
  for (const migration of migrations) {
    if (migration.version > oldVersion && (newVersion === null || migration.version <= newVersion)) {
      migration.migrate(db);
    }
  }
}