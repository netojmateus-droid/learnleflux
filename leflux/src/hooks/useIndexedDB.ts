import { useEffect, useState } from 'react';
import { initDB, db } from '@/lib/db/indexeddb';
import type { TextItem, VocabEntry, UserPrefs } from '@/types';

interface IndexedDBState {
  texts: TextItem[];
  vocab: VocabEntry[];
  prefs?: UserPrefs;
}

export function useIndexedDB() {
  const [state, setState] = useState<IndexedDBState>({ texts: [], vocab: [] });
  const [isReady, setReady] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    let active = true;
    const hydrate = async () => {
      try {
        await initDB();
        if (!active) return;
        const [texts, vocab, prefs] = await Promise.all([
          db.getAllTexts(),
          db.getAllVocab(),
          db.getPrefs(),
        ]);
        if (active) {
          setState({ texts, vocab, prefs: prefs ?? undefined });
          setReady(true);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'IndexedDB unavailable');
        }
      }
    };
    void hydrate();
    return () => {
      active = false;
    };
  }, []);

  return { ...state, isReady, error };
}