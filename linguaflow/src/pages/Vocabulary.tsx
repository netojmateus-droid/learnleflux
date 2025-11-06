import React, { useState, useMemo } from 'react';
import { useVocabStore } from '@/store/vocabStore';
import { motion, AnimatePresence } from 'framer-motion';
import { VocabEntry } from '@/types';
import { X, Volume2 } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { GeneratedImage } from '@/components/common/GeneratedImage';


// FIX: Define props with a type and use React.FC for the component.
type VocabModalProps = {
    entry: VocabEntry;
    onClose: () => void;
};

const VocabModal: React.FC<VocabModalProps> = ({ entry, onClose }) => {
    const handleTTS = () => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(entry.term);
            utterance.lang = entry.lang;
            window.speechSynthesis.speak(utterance);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="relative bg-dark-base-end/80 backdrop-blur-lg border border-white/10 rounded-3xl p-6 shadow-soft text-dark-text-primary max-w-lg w-full"
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-dark-text-tertiary hover:text-white" aria-label="Close modal"><X size={20}/></button>
                <div className="flex flex-col sm:flex-row gap-6">
                    <GeneratedImage prompt={entry.term} alt={entry.term} className="w-full sm:w-32 h-40 sm:h-32 object-cover rounded-xl flex-shrink-0"/>
                    <div className="flex-1">
                        <div className="flex items-center gap-4">
                           <h2 className="font-display text-3xl">{entry.term}</h2>
                           <Button variant="ghost" size="sm" onClick={handleTTS} aria-label="Listen to pronunciation">
                               <Volume2 size={22}/>
                           </Button>
                        </div>
                        <p className="mt-2 text-dark-text-secondary">{entry.definition || 'No definition available.'}</p>
                    </div>
                </div>
                <div className="mt-6 border-t border-white/10 pt-4">
                    <h3 className="font-display text-lg text-dark-text-secondary">My Sentences</h3>
                    <p className="text-sm text-dark-text-tertiary mt-2">You haven't created any sentences with this word yet.</p>
                </div>
            </motion.div>
        </motion.div>
    );
};


type VocabCardProps = {
    entry: VocabEntry;
    onClick: () => void;
};

const VocabCard: React.FC<VocabCardProps> = ({ entry, onClick }) => (
    <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative aspect-[3/4] rounded-3xl overflow-hidden group cursor-pointer"
        onClick={onClick}
    >
        <GeneratedImage prompt={entry.term} alt={entry.term} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"/>
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 className="font-display text-xl">{entry.term}</h3>
            <p className="text-sm opacity-80 truncate">{entry.definition || 'No definition'}</p>
        </div>
    </motion.div>
);


const VocabularyPage = () => {
    const vocabulary = useVocabStore(s => s.vocabulary);
    const [filter, setFilter] = useState<'all' | 'new' | 'learning' | 'mastered'>('all');
    const [selectedEntry, setSelectedEntry] = useState<VocabEntry | null>(null);

    const filteredVocab = useMemo(() => {
        if (filter === 'all') return vocabulary;
        return vocabulary.filter(v => v.srs.stage === filter);
    }, [vocabulary, filter]);

    const filters = [
        { id: 'all', label: 'All' },
        { id: 'new', label: 'New' },
        { id: 'learning', label: 'Learning' },
        { id: 'mastered', label: 'Mastered' },
    ];

    return (
        <div className="p-4 sm:p-6 md:p-8 pb-24">
            <h1 className="font-display text-4xl text-dark-text-primary mb-8">Vocabulary</h1>
            
            <div className="flex gap-2 mb-6">
                {filters.map(f => (
                    <button
                        key={f.id}
                        onClick={() => setFilter(f.id as any)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${filter === f.id ? 'bg-accent text-dark-base-end' : 'bg-white/10 text-dark-text-secondary hover:bg-white/20'}`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                <AnimatePresence>
                    {filteredVocab.map(entry => (
                        <VocabCard key={entry.id} entry={entry} onClick={() => setSelectedEntry(entry)} />
                    ))}
                </AnimatePresence>
            </motion.div>
            
            {filteredVocab.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-dark-text-secondary">No vocabulary in this category yet.</p>
                </div>
            )}

            <AnimatePresence>
                {selectedEntry && (
                    <VocabModal 
                        entry={selectedEntry} 
                        onClose={() => setSelectedEntry(null)} 
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default VocabularyPage;
