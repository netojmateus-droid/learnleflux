import React from 'react';

interface FlashcardProps {
  question: string;
  answer: string;
  onFlip: () => void;
  isFlipped: boolean;
}

const Flashcard: React.FC<FlashcardProps> = ({ question, answer, onFlip, isFlipped }) => {
  return (
    <div className="flashcard" onClick={onFlip}>
      {isFlipped ? (
        <div className="flashcard-answer">{answer}</div>
      ) : (
        <div className="flashcard-question">{question}</div>
      )}
    </div>
  );
};

export default Flashcard;