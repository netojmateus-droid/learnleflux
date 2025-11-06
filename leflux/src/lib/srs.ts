import { SrsState } from '@/types';

const DEFAULT_EASE = 2.3;

export function initialSrsState(): SrsState {
  return {
    ease: DEFAULT_EASE,
    interval: 0,
    nextReview: Date.now(),
    correctStreak: 0,
    reviews: 0,
    produced: 0,
    stage: 'new',
  };
}

export function applySRS(state: SrsState, response: 0 | 1 | 2): SrsState {
  const now = Date.now();
  let { ease, interval, correctStreak, reviews, produced, stage } = state;

  reviews += 1;

  if (response === 0) {
    // Errei
    interval = 1;
  ease = Math.max(1.3, ease - 0.2);
    correctStreak = 0;
    stage = 'learning';
  } else if (response === 1) {
    // Difícil
    interval = Math.ceil(Math.max(1, interval * 1.2));
    ease = Math.max(1.3, ease - 0.05);
    correctStreak += 1;
  } else if (response === 2) {
    // Fácil
    interval = Math.ceil(Math.max(1, interval * ease));
    ease += 0.15;
    correctStreak += 1;
  }

  const nextReview = now + interval * 24 * 60 * 60 * 1000; // days to ms

  // Promotion
  if (correctStreak >= 3 && interval >= 30) {
    stage = 'mastered';
  }

  // Demotion
  if (ease < 1.6) {
    stage = 'learning';
  }

  return {
    ease,
    interval,
    nextReview,
    correctStreak,
    reviews,
    produced,
    stage,
  };
}