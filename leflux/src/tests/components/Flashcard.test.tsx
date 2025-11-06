import React from 'react';
import { render, screen } from '@testing-library/react';
import Flashcard from '../../components/ui/Flashcard';

describe('Flashcard Component', () => {
  const mockProps = {
    question: 'What is the capital of France?',
    answer: 'Paris',
    onFlip: jest.fn(),
  };

  test('renders the question', () => {
    render(<Flashcard {...mockProps} />);
    expect(screen.getByText(mockProps.question)).toBeInTheDocument();
  });

  test('renders the answer when flipped', () => {
    render(<Flashcard {...mockProps} />);
    // Simulate flipping the flashcard
    const flashcard = screen.getByText(mockProps.question);
    flashcard.click();
    expect(screen.getByText(mockProps.answer)).toBeInTheDocument();
  });

  test('calls onFlip when clicked', () => {
    render(<Flashcard {...mockProps} />);
    const flashcard = screen.getByText(mockProps.question);
    flashcard.click();
    expect(mockProps.onFlip).toHaveBeenCalled();
  });
});