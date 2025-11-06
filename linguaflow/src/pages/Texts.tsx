import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVocabStore } from '@/store/vocabStore';
import { useLibraryStore } from '@/store/libraryStore';
import { Button } from '@/components/common/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Sparkles } from 'lucide-react';
import { nanoid } from 'nanoid';

const TextsPage = () => {
    const navigate = useNavigate();
    const allVocabulary = useVocabStore(s => s.vocabulary);
    const addText = useLibraryStore(s => s.addText);
    const [selectedVocabIds, setSelectedVocabIds] = useState<string[]>([]);
    const [generatedText, setGeneratedText] = useState('');
    const [storyTitle, setStoryTitle] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const sortedVocabulary = useMemo(() => {
        return [...allVocabulary].sort((a, b) => b.createdAt - a.createdAt);
    }, [allVocabulary]);

    const handleToggleSelect = (id: string) => {
        setSelectedVocabIds(prev =>
            prev.includes(id) ? prev.filter(vid => vid !== id) : [...prev, id]
        );
    };

    const handleGenerateStory = async () => {
        const selectedWords = allVocabulary.filter(v => selectedVocabIds.includes(v.id));
        if (selectedWords.length === 0) return;
        
        setIsGenerating(true);
        setGeneratedText('');

        try {
            const wordList = selectedWords.map(w => w.term).join(', ');
            const prompt = `Write a very short and simple story for a language learner using these words: ${wordList}. The story must be easy to understand.`;
            const encodedPrompt = encodeURIComponent(prompt);
            const url = `https://text.pollinations.ai/${encodedPrompt}?model=openai`;

            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to generate story from API.');

            const story = await response.text();
            setGeneratedText(story.trim());
            setStoryTitle(`A story about a ${selectedWords[0].term}`);
        } catch (error) {
            console.error("Story generation failed:", error);
            setGeneratedText('Sorry, something went wrong. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };
    
    const handleSaveStory = () => {
        if (!generatedText.trim() || !storyTitle.trim()) {
            alert("Title and story cannot be empty.");
            return;
        }

        addText({
            title: storyTitle,
            lang: allVocabulary.find(v => v.id === selectedVocabIds[0])?.lang || 'en',
            content: generatedText,
            progress: 0,
            wordCount: generatedText.split(/\s+/).length,
            type: 'text'
        });
        
        // TODO: Show a success toast
        navigate('/');
    };

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 pb-24">
            <h1 className="font-display text-4xl text-dark-text-primary mb-2">Create a Story</h1>
            <p className="text-dark-text-secondary mb-8">Select words from your vocabulary to generate a short story.</p>
            
            <section className="mb-8">
                <h2 className="font-display text-xl text-dark-text-secondary mb-4">Select Words ({selectedVocabIds.length})</h2>
                {sortedVocabulary.length > 0 ? (
                    <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 bg-white/5 rounded-xl">
                        {sortedVocabulary.map(vocab => {
                            const isSelected = selectedVocabIds.includes(vocab.id);
                            return (
                                <motion.button
                                    key={vocab.id}
                                    onClick={() => handleToggleSelect(vocab.id)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${isSelected ? 'bg-accent/20 border-accent/50 text-accent' : 'bg-white/5 border-transparent hover:bg-white/10'}`}
                                >
                                    {vocab.term}
                                </motion.button>
                            );
                        })}
                    </div>
                ) : (
                     <div className="text-center py-10 bg-white/5 rounded-xl">
                        <p className="text-dark-text-secondary">Your vocabulary is empty.</p>
                        <Button variant="secondary" className="mt-4" onClick={() => navigate('/import')}>
                            Add some words by reading
                        </Button>
                    </div>
                )}
            </section>

            <div className="flex justify-center mb-8">
                 <Button onClick={handleGenerateStory} disabled={selectedVocabIds.length === 0 || isGenerating} icon={<Sparkles size={18}/>}>
                    {isGenerating ? 'Generating...' : 'Generate Story'}
                </Button>
            </div>
            
            <AnimatePresence>
            {generatedText && (
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                >
                     <input
                        type="text"
                        value={storyTitle}
                        onChange={(e) => setStoryTitle(e.target.value)}
                        placeholder="Story Title"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:ring-accent focus:border-accent"
                    />
                    <textarea
                        value={isGenerating ? 'Generating, please wait...' : generatedText}
                        onChange={(e) => setGeneratedText(e.target.value)}
                        className="w-full h-48 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:ring-accent focus:border-accent resize-y"
                        readOnly={isGenerating}
                    />
                    <Button onClick={handleSaveStory} className="w-full" icon={<Plus size={18}/>}>
                        Save to Library
                    </Button>
                </motion.section>
            )}
            </AnimatePresence>
        </div>
    );
};

export default TextsPage;