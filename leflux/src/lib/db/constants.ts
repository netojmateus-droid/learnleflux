export const TEXT_STORE = 'texts' as const;
export const VOCAB_STORE = 'vocab' as const;
export const PREFS_STORE = 'prefs' as const;

export type StoreName = typeof TEXT_STORE | typeof VOCAB_STORE | typeof PREFS_STORE;
