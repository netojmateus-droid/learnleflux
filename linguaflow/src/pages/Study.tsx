
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLibraryStore } from '@/store/libraryStore';
import { Caption, TextItem } from '@/types';
import { AnimatePresence } from 'framer-motion';
import { WordModal } from '@/components/word/WordModal';
import { useVocabStore } from '@/store/vocabStore';
import { tokenize } from '@/lib/tokenize';
import { ArrowLeft, Play, Pause, Rewind } from 'lucide-react';
import { Button } from '@/components/common/Button';

const useYouTubePlayer = (
    containerId: string,
    videoId?: string,
    onReady?: (event: any) => void,
    onStateChange?: (event: any) => void
) => {
    const [player, setPlayer] = useState<any | null>(null);

    useEffect(() => {
        if (!videoId) return;

        const createPlayer = () => {
            const newPlayer = new (window as any).YT.Player(containerId, {
                videoId,
                playerVars: {
                    playsinline: 1,
                    rel: 0,
                    modestbranding: 1,
                    iv_load_policy: 3,
                },
                events: {
                    onReady: onReady,
                    onStateChange: onStateChange,
                },
            });
            setPlayer(newPlayer);
        };

        if (!(window as any).YT) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            document.head.appendChild(tag);
            (window as any).onYouTubeIframeAPIReady = createPlayer;
        } else {
            createPlayer();
        }

        return () => {
            if (player) {
                player.destroy();
            }
        };
    }, [videoId, containerId, onReady, onStateChange]);

    return player;
};

const StudyPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getTextById, updateText } = useLibraryStore();
    const { getVocabByTerm } = useVocabStore();

    const [textItem, setTextItem] = useState<TextItem | undefined>();
    const [captions, setCaptions] = useState<Caption[]>([]);
    const [selectedWord, setSelectedWord] = useState<string | null>(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [activeCaptionIndex, setActiveCaptionIndex] = useState(-1);
    const [isPlaying, setIsPlaying] = useState(false);
    
    const activeCaptionRef = useRef<HTMLDivElement>(null);
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        if (id) {
            const item = getTextById(id);
            setTextItem(item);
            if (item && item.type === 'video') {
                try {
                    const parsedCaptions = JSON.parse(item.content);
                    setCaptions(parsedCaptions);
                } catch (e) { console.error("Failed to parse captions:", e); }
            }
        }
    }, [id, getTextById]);

    const onPlayerReady = useCallback((event: any) => {
        event.target.seekTo(textItem?.progress || 0);
    }, [textItem?.progress]);

    const onPlayerStateChange = useCallback((event: any) => {
        if (event.data === (window as any).YT.PlayerState.PLAYING) {
            setIsPlaying(true);
            intervalRef.current = window.setInterval(() => {
                setCurrentTime(event.target.getCurrentTime());
            }, 250);
        } else {
            setIsPlaying(false);
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
    }, []);

    const player = useYouTubePlayer('youtube-player-container', textItem?.videoId, onPlayerReady, onPlayerStateChange);

    useEffect(() => {
        const currentMs = currentTime * 1000;
        const newIndex = captions.findIndex(c => currentMs >= c.start && currentMs <= c.end);
        if (newIndex !== -1 && newIndex !== activeCaptionIndex) {
            setActiveCaptionIndex(newIndex);
        }
    }, [currentTime, captions, activeCaptionIndex]);
    
    useEffect(() => {
        activeCaptionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, [activeCaptionIndex]);
    
    useEffect(() => {
        return () => {
            if (id && player?.getCurrentTime) {
                updateText(id, { progress: player.getCurrentTime() });
            }
        };
    }, [id, player, updateText]);


    const handleWordClick = (word: string) => {
        const cleanedWord = word.replace(/[.,!?;:"]$/, '').toLowerCase();
        if (cleanedWord.length > 1) setSelectedWord(cleanedWord);
    };

    if (!textItem || textItem.type !== 'video') return <div className="p-8 text-center">Video not found.</div>;
    
    return (
        <div className="flex flex-col h-screen bg-dark-base-end">
            <header className="flex items-center p-2 text-white bg-dark-base-start flex-shrink-0">
                 <button onClick={() => navigate('/')} className="p-2 rounded-full hover:bg-white/10" aria-label="Back"><ArrowLeft/></button>
                 <h1 className="font-display text-lg truncate mx-4 flex-1">{textItem.title}</h1>
            </header>
            <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
                <div className="w-full md:flex-1 h-1/2 md:h-full bg-black flex flex-col items-center justify-center p-2">
                    <div id="youtube-player-container" className="w-full aspect-video max-h-full"></div>
                    <div className="flex items-center gap-4 mt-4">
                        <Button variant="secondary" onClick={() => player.seekTo(player.getCurrentTime() - 5, true)}><Rewind size={20}/></Button>
                        <Button variant="secondary" onClick={() => isPlaying ? player.pauseVideo() : player.playVideo()}>{isPlaying ? <Pause size={20}/> : <Play size={20}/>}</Button>
                    </div>
                </div>
                <aside className="w-full md:w-96 h-1/2 md:h-full bg-dark-base-start overflow-y-auto p-4 flex-shrink-0">
                    <div className="space-y-2">
                    {captions.map((caption, index) => (
                        <div 
                            key={index} 
                            ref={index === activeCaptionIndex ? activeCaptionRef : null}
                            onClick={() => player.seekTo(caption.start / 1000, true)}
                            className={`p-3 rounded-lg cursor-pointer transition-colors duration-200 ${activeCaptionIndex === index ? 'bg-accent/20 text-accent' : 'text-dark-text-secondary hover:bg-white/10'}`}
                        >
                            {tokenize(caption.text).map((token, i) => {
                                const cleanedToken = token.toLowerCase().replace(/[.,!?;:"]$/, '');
                                const isKnown = !!getVocabByTerm(cleanedToken, textItem.lang);
                                return (
                                    <span key={i} onClick={(e) => { e.stopPropagation(); handleWordClick(token); }} className={`cursor-pointer rounded-md px-0.5 -mx-0.5 ${isKnown ? 'text-accent/80' : 'hover:bg-accent/20'}`}>
                                        {token}{' '}
                                    </span>
                                );
                            })}
                        </div>
                    ))}
                    </div>
                </aside>
            </div>
             <AnimatePresence>
                {selectedWord && (<WordModal word={selectedWord} lang={textItem.lang} onClose={() => setSelectedWord(null)} />)}
            </AnimatePresence>
        </div>
    );
};

export default StudyPage;
