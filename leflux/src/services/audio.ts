import { useEffect, useRef } from 'react';

const useAudio = (url: string) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        audioRef.current = new Audio(url);
        return () => {
            audioRef.current?.pause();
            audioRef.current = null;
        };
    }, [url]);

    const play = () => {
        audioRef.current?.play();
    };

    const pause = () => {
        audioRef.current?.pause();
    };

    const stop = () => {
        audioRef.current?.pause();
        audioRef.current.currentTime = 0;
    };

    return { play, pause, stop };
};

export default useAudio;