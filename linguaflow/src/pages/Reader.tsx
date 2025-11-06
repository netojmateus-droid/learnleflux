import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLibraryStore } from '@/store/libraryStore';
import { usePrefsStore } from '@/store/prefsStore';
import { AnimatePresence, motion } from 'framer-motion';
import { useVocabStore } from '@/store/vocabStore';
import { ArrowLeft, Play, Pause, Square } from 'lucide-react';
import { WordModal } from '@/components/word/WordModal';

type PlaybackState = 'stopped' | 'playing' | 'paused';

const ReaderHeader = ({
    title,
    progress,
    playbackState,
    onPlayPause,
    onStop,
}: {
    title: string;
    progress: number;
    playbackState: PlaybackState;
    onPlayPause: () => void;
    onStop: () => void;
}) => {
    const navigate = useNavigate();
    const isPlaying = playbackState === 'playing';

    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-dark-base-end/80 backdrop-blur-lg z-40 flex items-center px-4 transition-shadow shadow-none">
            <button onClick={() => navigate('/')} className="p-2 rounded-full hover:bg-white/10 text-dark-text-secondary hover:text-dark-text-primary" aria-label="Back to library">
                <ArrowLeft size={24} />
            </button>
            <div className="flex-1 mx-4 overflow-hidden">
                <h1 className="font-display text-lg truncate text-dark-text-primary">{title}</h1>
            </div>
            <div className="flex items-center gap-2 mr-2">
                <button onClick={onPlayPause} className="p-2 rounded-full hover:bg-white/10 text-dark-text-secondary hover:text-dark-text-primary" aria-label={isPlaying ? "Pause text" : "Play text"}>
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>
                <button onClick={onStop} disabled={playbackState === 'stopped'} className="p-2 rounded-full hover:bg-white/10 text-dark-text-secondary hover:text-dark-text-primary disabled:opacity-50" aria-label="Stop text">
                    <Square size={20} />
                </button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                <motion.div 
                    className="h-1 bg-accent"
                    animate={{ width: `${progress * 100}%` }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
            </div>
        </header>
    );
};


const ReaderPage = () => {
    const { id } = useParams<{ id: string }>();
    const { getTextById, updateText } = useLibraryStore();
    const { fontSize, lineHeight } = usePrefsStore(s => s.prefs);
    const textItem = id ? getTextById(id) : undefined;
    const [selectedWord, setSelectedWord] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const debounceTimeout = useRef<number | null>(null);
    
    const [playbackState, setPlaybackState] = useState<PlaybackState>('stopped');
    const [currentWordIndex, setCurrentWordIndex] = useState(-1);

    // Effect to set initial scroll position based on saved progress
    useEffect(() => {
        if (textItem) {
            const initialProgress = textItem.progress || 0;
            setProgress(initialProgress);
            setTimeout(() => {
                const { scrollHeight, clientHeight } = document.documentElement;
                if (scrollHeight > clientHeight) {
                    const scrollToY = (scrollHeight - clientHeight) * initialProgress;
                    window.scrollTo({ top: scrollToY });
                }
            }, 100);
        }
    }, [textItem?.id]); // Rerun if textItem id changes

    const handleScroll = useCallback(() => {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        if (scrollHeight <= clientHeight) {
            setProgress(1);
            return;
        }

        const currentProgress = Math.min(1, scrollTop / (scrollHeight - clientHeight));
        setProgress(currentProgress);

        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        debounceTimeout.current = window.setTimeout(() => {
            if (id) {
                updateText(id, { progress: currentProgress, lastRead: Date.now() });
            }
        }, 500); // Debounce store updates
    }, [id, updateText]);

    const tokensWithIndices = useMemo(() => {
        if (!textItem) return [];
        const text = textItem.content;
        const regex = /[\w']+|[.,!?;:"]+/g;
        let match;
        const results = [];
        while ((match = regex.exec(text)) !== null) {
            results.push({
                token: match[0],
                index: match.index,
            });
        }
        return results;
    }, [textItem]);

    const cleanUpSpeech = useCallback(() => {
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        }
        setPlaybackState('stopped');
        setCurrentWordIndex(-1);
    }, []);

    const handlePlay = useCallback(() => {
        if (!textItem || !('speechSynthesis' in window)) return;
        
        cleanUpSpeech();

        const utterance = new SpeechSynthesisUtterance(textItem.content);
        utterance.lang = textItem.lang;

        utterance.onstart = () => setPlaybackState('playing');
        utterance.onpause = () => setPlaybackState('paused');
        utterance.onresume = () => setPlaybackState('playing');
        
        utterance.onboundary = (event) => {
            const charIndex = event.charIndex;
            let wordIdx = -1;
            for (let i = 0; i < tokensWithIndices.length; i++) {
                if (tokensWithIndices[i].index <= charIndex) {
                    wordIdx = i;
                } else {
                    break;
                }
            }
            setCurrentWordIndex(wordIdx);
        };
        
        utterance.onend = () => {
           cleanUpSpeech();
        };

        utterance.onerror = (event) => {
            console.error("Speech synthesis error", event);
            cleanUpSpeech();
        };

        speechSynthesis.speak(utterance);
    }, [textItem, cleanUpSpeech, tokensWithIndices]);

    const handlePause = useCallback(() => {
        if (speechSynthesis.speaking) speechSynthesis.pause();
    }, []);

    const handleResume = useCallback(() => {
        if (speechSynthesis.paused) speechSynthesis.resume();
    }, []);

    const handlePlayPause = useCallback(() => {
        switch(playbackState) {
            case 'stopped': handlePlay(); break;
            case 'playing': handlePause(); break;
            case 'paused': handleResume(); break;
        }
    }, [playbackState, handlePlay, handlePause, handleResume]);

    useEffect(() => {
        return () => {
            cleanUpSpeech();
        };
    }, [cleanUpSpeech]);

    useEffect(() => {
        if (id) {
            updateText(id, { lastRead: Date.now() });
        }
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
            const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
            if(id && scrollHeight > clientHeight) {
                 const finalProgress = Math.min(1, scrollTop / (scrollHeight - clientHeight));
                 updateText(id, { progress: finalProgress, lastRead: Date.now() });
            } else if (id) {
                 updateText(id, { progress: 1, lastRead: Date.now() });
            }
        };
    }, [id, handleScroll, updateText]);

    const { getVocabByTerm } = useVocabStore();

    if (!textItem) {
        return <div className="p-8 text-center">Text not found.</div>;
    }

    const handleWordClick = (word: string) => {
        const cleanedWord = word.replace(/[.,!?;:"]$/, '').toLowerCase();
        if (cleanedWord.length > 1) {
             setSelectedWord(cleanedWord);
        }
    };
    
    return (
        <div className="relative">
            <ReaderHeader
                title={textItem.title}
                progress={progress}
                playbackState={playbackState}
                onPlayPause={handlePlayPause}
                onStop={cleanUpSpeech}
            />
            <div className="max-w-prose mx-auto px-4 pt-24 pb-12" style={{ fontSize: `${fontSize}%`, lineHeight: lineHeight }}>
                <h1 className="font-display text-4xl mb-8">{textItem.title}</h1>
                <div className="text-lg leading-relaxed text-dark-text-secondary prose dark:prose-invert prose-p:my-4 prose-p:text-dark-text-secondary dark:prose-p:text-dark-text-secondary">
                   {tokensWithIndices.map(({ token }, index) => {
                       const cleanedToken = token.toLowerCase().replace(/[.,!?;:"]$/, '');
                       const isKnown = !!getVocabByTerm(cleanedToken, textItem.lang);
                       const isCurrentWord = index === currentWordIndex;
                       
                       const className = `cursor-pointer transition-colors duration-200 rounded-md px-0.5 -mx-0.5 ${
                           isCurrentWord ? 'bg-accent text-dark-base-end' :
                           isKnown ? 'text-accent/80 hover:text-accent bg-accent/10' : 'hover:bg-accent/20'
                       }`;
                       
                       const trailingSpace = /[\w']/.test(token) && index < tokensWithIndices.length - 1 && /[\w']/.test(tokensWithIndices[index + 1].token) ? ' ' : '';
                       
                       return (
                           <span key={index} className={className} onClick={() => handleWordClick(token)}>
                               {token}{trailingSpace}
                           </span>
                       );
                   })}
                </div>
            </div>
            <AnimatePresence>
                {selectedWord && (
                    <WordModal 
                        word={selectedWord} 
                        lang={textItem.lang} 
                        onClose={() => setSelectedWord(null)} 
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default ReaderPage;
