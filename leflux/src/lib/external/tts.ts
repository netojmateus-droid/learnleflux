export function isSpeechSynthesisSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export interface SpeakOptions {
  lang?: string;
  rate?: number;
  pitch?: number;
}

export function speak(text: string, options: SpeakOptions = {}) {
  if (!isSpeechSynthesisSupported()) return;
  const utterance = new SpeechSynthesisUtterance(text);
  if (options.lang) utterance.lang = options.lang;
  if (options.rate) utterance.rate = options.rate;
  if (options.pitch) utterance.pitch = options.pitch;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}
