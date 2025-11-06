import React, { useEffect, useState } from 'react';
import { useReviewStore } from '@/store/reviewStore';
import { Button } from '@/components/common/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { VocabEntry } from '@/types';
import { Mic } from 'lucide-react';
import { GeneratedImage } from '@/components/common/GeneratedImage';

// FIX: Define props with a type and use React.FC to correctly type the component for JSX,
// resolving the issue where 'key' was being treated as a normal prop.
type ReviewCardProps = {
    card: VocabEntry;
    onAnswer: (rating: 0 | 1 | 2) => void;
};

const ReviewCard: React.FC<ReviewCardProps> = ({ card, onAnswer }) => {
    const [showAnswer, setShowAnswer] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [recognitionResult, setRecognitionResult] = useState('');
    const [feedbackMessage, setFeedbackMessage] = useState('');

    useEffect(() => {
        setShowAnswer(false);
        setFeedbackMessage('');
        setRecognitionResult('');
    }, [card]);

    const handlePronunciationPractice = () => {
        // FIX: Cast `window` to `any` to access the non-standard SpeechRecognition API
        // properties, which are not included in TypeScript's default `Window` type.
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setFeedbackMessage('Speech recognition is not supported in this browser.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = card.lang;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            setIsListening(true);
            setFeedbackMessage('Listening...');
        };

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setRecognitionResult(transcript);
            const isCorrect = transcript.trim().toLowerCase() === card.term.trim().toLowerCase();
            setFeedbackMessage(isCorrect ? 'Correct!' : 'Try again.');
        };
        
        recognition.onerror = (event: any) => {
            setFeedbackMessage(`Error: ${event.error}`);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.start();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-lg mx-auto bg-white/5 p-8 rounded-3xl"
        >
            <GeneratedImage prompt={card.term} alt={card.term} className="w-full h-56 rounded-xl mb-6"/>
            <div className="flex items-center justify-center gap-4 mb-4">
                <h2 className="text-center font-display text-4xl">{card.term}</h2>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handlePronunciationPractice} 
                    disabled={isListening}
                    className={isListening ? 'animate-pulse text-accent' : ''}
                    aria-label="Practice pronunciation"
                >
                    <Mic size={24}/>
                </Button>
            </div>
            
            {feedbackMessage && (
                <div className={`text-center text-sm mb-4 ${feedbackMessage === 'Correct!' ? 'text-green-400' : 'text-yellow-400'}`}>
                    {feedbackMessage}
                    {recognitionResult && ` You said: "${recognitionResult}"`}
                </div>
            )}
            
            {showAnswer ? (
                <div className="text-center text-dark-text-secondary mb-6">
                    <p>{card.definition}</p>
                </div>
            ) : (
                <Button onClick={() => setShowAnswer(true)} className="w-full mb-6">Show Answer</Button>
            )}

            {showAnswer && (
                <div className="grid grid-cols-3 gap-4">
                    <Button onClick={() => onAnswer(0)} className="bg-red-500/80 hover:bg-red-500">Again</Button>
                    <Button onClick={() => onAnswer(1)} className="bg-yellow-500/80 hover:bg-yellow-500">Hard</Button>
                    <Button onClick={() => onAnswer(2)} className="bg-green-500/80 hover:bg-green-500">Easy</Button>
                </div>
            )}
        </motion.div>
    );
};

const ReviewPage = () => {
    const { reviewQueue, currentCardIndex, sessionCompleted, startReviewSession, answerCard, endReviewSession } = useReviewStore();
    const navigate = useNavigate();

    useEffect(() => {
        startReviewSession();
        return () => endReviewSession();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const currentCard = reviewQueue[currentCardIndex];

    if (reviewQueue.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <h1 className="font-display text-3xl">All caught up!</h1>
                <p className="text-dark-text-secondary mt-2">No words are due for review right now.</p>
                <Button onClick={() => navigate('/vocabulary')} className="mt-6">Back to Vocabulary</Button>
            </div>
        );
    }
    
    if (sessionCompleted) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <h1 className="font-display text-3xl">Session Complete!</h1>
                <p className="text-dark-text-secondary mt-2">You reviewed {reviewQueue.length} words.</p>
                 <div className="flex gap-4">
                    <Button onClick={startReviewSession} className="mt-6">Start Another</Button>
                    <Button onClick={() => navigate('/')} variant="secondary" className="mt-6">Done</Button>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
             <div className="absolute top-6 right-6 text-dark-text-secondary">
                {currentCardIndex + 1} / {reviewQueue.length}
            </div>
            <AnimatePresence mode="wait">
                {currentCard && <ReviewCard key={currentCard.id} card={currentCard} onAnswer={(rating) => answerCard(currentCard.id, rating)} />}
            </AnimatePresence>
        </div>
    );
};

export default ReviewPage;
