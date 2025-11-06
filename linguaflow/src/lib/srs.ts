
import { SrsState } from "@/types";

const DAY_IN_MS = 24 * 60 * 60 * 1000;

export const createNewSrsState = (): SrsState => ({
  ease: 2.3,
  interval: 0,
  nextReview: Date.now(),
  correctStreak: 0,
  reviews: 0,
  produced: 0,
  stage: 'new',
});

export const updateSrsState = (currentState: SrsState, rating: 0 | 1 | 2): SrsState => {
  const now = Date.now();
  const newState: SrsState = { ...currentState, reviews: currentState.reviews + 1 };

  if (rating === 0) { // Errei
    newState.interval = 1;
    newState.ease = Math.max(1.3, currentState.ease - 0.2);
    newState.stage = 'learning';
    newState.correctStreak = 0;
  } else if (rating === 1) { // Difícil
    newState.interval = Math.ceil(Math.max(1, currentState.interval * 1.2));
    newState.ease = Math.max(1.3, currentState.ease - 0.05);
    newState.correctStreak += 1;
    newState.stage = 'learning';
  } else { // Fácil (rating === 2)
    const newInterval = currentState.interval === 0 ? 1 : Math.ceil(currentState.interval * currentState.ease);
    newState.interval = newInterval;
    newState.ease += 0.15;
    newState.correctStreak += 1;
  }
  
  if (newState.correctStreak >= 3 && newState.interval >= 30) {
    newState.stage = 'mastered';
  }

  newState.nextReview = now + newState.interval * DAY_IN_MS;

  return newState;
};
   