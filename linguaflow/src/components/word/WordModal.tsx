
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useVocabStore } from '@/store/vocabStore';
import { usePrefsStore } from '@/store/prefsStore';
import { Volume2, ExternalLink, X, Send } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { GeneratedImage } from '@/components/common/GeneratedImage';

const getLingueeLangName = (code: string): string => {
    const map: { [key: string]: string } = { 'en': 'english', 'es': 'spanish', 'fr': 'french', 'de': 'german', 'pt': 'portuguese' };
    return map[code.toLowerCase()] || 'english';
};

export const WordModal = ({ word, lang, onClose }: { word: string; lang:string; onClose: () => void; }) => {
    const [definition, setDefinition] = useState('Loading...');
    const [examples, setExamples] = useState<string[]>([]);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [userSentence, setUserSentence] = useState('');

    const { addVocab, getVocabByTerm, updateVocab } = useVocabStore();
    const { targetLang } = usePrefsStore(s => s.prefs);
    const existingEntry = getVocabByTerm(word, lang);

    useEffect(() => {
        const fetchWordData = async () => {
            try {
                const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/${lang}/${word}`);
                if (!res.ok) throw new Error('Primary API failed');
                const data = await res.json();
                const firstMeaning = data[0]?.meanings[0];
                const firstDefinition = firstMeaning?.definitions[0];
                setDefinition(firstDefinition?.definition || 'No definition available.');
                const fetchedExamples = firstMeaning?.definitions.map((d: any) => d.example).filter(Boolean).slice(0, 2) || [];
                setExamples(fetchedExamples);
                const audio = data[0]?.phonetics?.find((p: any) => p.audio)?.audio;
                if (audio) setAudioUrl(audio);
            } catch (error) {
                try {
                    const prompt = `Define the word "${word}" in ${lang} and provide one simple example sentence. Format as: [Definition] | [Example]`;
                    const encodedPrompt = encodeURIComponent(prompt);
                    const url = `https://text.pollinations.ai/${encodedPrompt}?model=openai`;
                    const response = await fetch(url);
                    if (!response.ok) throw new Error("Pollinations API failed");
                    const text = await response.text();
                    const parts = text.split('|');
                    const def = parts[0]?.replace('[Definition]', '').trim();
                    const ex = parts[1]?.replace('[Example]', '').trim();
                    setDefinition(def || 'Could not find a definition.');
                    setExamples(ex ? [ex] : []);
                } catch (pollError) {
                    setDefinition('Could not find a definition.');
                    setExamples([]);
                }
            }
        };

        if (existingEntry) {
            setDefinition(existingEntry.definition || 'No definition saved.');
            setExamples(existingEntry.examples);
            setAudioUrl(existingEntry.audioUrl || null);
        } else {
            fetchWordData();
        }
    }, [word, lang, existingEntry]);

    const handleSave = () => {
        if (!existingEntry) {
            addVocab({ term: word, lang, definition, examples, translation: '', audioUrl: audioUrl || undefined });
        }
        onClose();
    };
    
    const handleTTS = () => {
        if (audioUrl) new Audio(audioUrl).play().catch(() => handleBrowserTTS());
        else handleBrowserTTS();
    };

    const handleBrowserTTS = () => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(word);
            utterance.lang = lang;
            window.speechSynthesis.speak(utterance);
        }
    }

    const handleAddSentence = () => {
        if (existingEntry && userSentence.trim()) {
            const updatedSentences = [...existingEntry.userSentences, userSentence.trim()];
            updateVocab(existingEntry.id, { userSentences: updatedSentences });
            setUserSentence('');
        }
    };

    const sourceLangName = getLingueeLangName(lang);
    const targetLangName = getLingueeLangName(targetLang);
    const lingueeUrl = `https://www.linguee.com/${sourceLangName}-${targetLangName}/search?source=auto&query=${encodeURIComponent(word)}`;

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed inset-x-0 bottom-0 sm:inset-auto sm:bottom-10 sm:left-1/2 sm:-translate-x-1/2 max-w-lg w-full z-50 p-4">
            <div className="bg-dark-base-end/80 backdrop-blur-lg border border-white/10 rounded-3xl p-6 shadow-soft text-dark-text-primary">
                <button onClick={onClose} className="absolute top-4 right-4 text-dark-text-tertiary hover:text-white"><X size={20}/></button>
                <div className="flex gap-4 mb-4">
                    <GeneratedImage prompt={word} alt={word} className="w-24 h-24 rounded-xl flex-shrink-0" />
                    <div>
                        <h2 className="font-display text-2xl">{word}</h2>
                        <div className="flex gap-2 mt-2">
                            <Button variant="ghost" size="sm" onClick={handleTTS}><Volume2 size={16}/></Button>
                            <a href={lingueeUrl} target="_blank" rel="noopener noreferrer"><Button variant="ghost" size="sm"><ExternalLink size={16}/></Button></a>
                        </div>
                    </div>
                </div>
                <div className="space-y-4 border-t border-white/10 pt-4">
                    <p className="text-dark-text-secondary">{definition}</p>
                    {examples.length > 0 && (
                        <div>
                            <h3 className="font-bold text-sm text-dark-text-tertiary mb-1">EXAMPLES</h3>
                            <ul className="space-y-1 text-dark-text-secondary text-sm list-disc list-inside">
                                {examples.map((ex, i) => <li key={i}>"{ex}"</li>)}
                            </ul>
                        </div>
                    )}
                    {existingEntry && (
                         <div>
                            <h3 className="font-bold text-sm text-dark-text-tertiary mb-2">MY SENTENCES</h3>
                            {existingEntry.userSentences.length > 0 ? (
                                <ul className="space-y-1 text-dark-text-secondary text-sm list-disc list-inside mb-2">
                                    {existingEntry.userSentences.map((s, i) => <li key={i}>{s}</li>)}
                                </ul>
                            ) : <p className="text-sm text-dark-text-tertiary mb-2">Add your own context.</p>}
                            <div className="flex gap-2">
                                <input type="text" value={userSentence} onChange={e => setUserSentence(e.target.value)} placeholder="Create a sentence..." className="flex-grow bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm focus:ring-accent focus:border-accent" onKeyDown={e => e.key === 'Enter' && handleAddSentence()} />
                                <Button size="sm" variant="secondary" onClick={handleAddSentence} disabled={!userSentence.trim()}><Send size={16}/></Button>
                            </div>
                        </div>
                    )}
                </div>
                <div className="mt-6">
                    <Button onClick={handleSave} className="w-full" disabled={!!existingEntry}>{existingEntry ? 'Already Saved' : 'Save Word'}</Button>
                </div>
            </div>
        </motion.div>
    );
};
