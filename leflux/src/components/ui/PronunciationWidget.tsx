import React from 'react';

interface PronunciationWidgetProps {
    word: string;
    audioUrl: string;
}

const PronunciationWidget: React.FC<PronunciationWidgetProps> = ({ word, audioUrl }) => {
    const playAudio = () => {
        const audio = new Audio(audioUrl);
        audio.play();
    };

    return (
        <div className="pronunciation-widget">
            <p>Pronunciation of: <strong>{word}</strong></p>
            <button onClick={playAudio}>Play Pronunciation</button>
        </div>
    );
};

export default PronunciationWidget;