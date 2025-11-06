
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Plus, Trash2, PlayCircle } from 'lucide-react';
import { useLibraryStore } from '@/store/libraryStore';
import { Button } from '@/components/common/Button';
import { TextItem } from '@/types';
import { GeneratedImage } from '@/components/common/GeneratedImage';

const TextCard: React.FC<{ text: TextItem; onRemove: (id: string) => void; }> = ({ text, onRemove }) => {
    const navigate = useNavigate();
    const isVideo = text.type === 'video';

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm(`Are you sure you want to remove "${text.title}"?`)) {
            onRemove(text.id);
        }
    };

    const progressPercentage = isVideo ? (text.progress / text.wordCount) * 100 : text.progress * 100;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={() => navigate(isVideo ? `/study/${text.id}` : `/read/${text.id}`)}
            className="group relative bg-white/5 border border-white/10 rounded-3xl p-4 cursor-pointer overflow-hidden transform hover:scale-[1.02] transition-transform duration-200"
        >
            <div className="relative">
                <GeneratedImage prompt={text.title} alt={text.title} className="w-full h-40 rounded-xl mb-4 opacity-80 group-hover:opacity-100 transition-opacity" />
                {isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                        <PlayCircle size={64} className="text-white drop-shadow-lg" />
                    </div>
                )}
            </div>
            <div className="relative">
                <h3 className="font-display text-lg text-dark-text-primary truncate">{text.title}</h3>
                <p className="text-sm text-dark-text-tertiary">{text.lang.toUpperCase()} - {isVideo ? 'Video' : `${text.wordCount} words`}</p>
                <div className="w-full bg-white/10 rounded-full h-1.5 mt-2">
                    <div className="bg-accent h-1.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                </div>
            </div>
             <button onClick={handleRemove} className="absolute top-6 right-6 p-2 bg-dark-base-end/50 rounded-full text-dark-text-tertiary hover:text-accent hover:bg-dark-base-end transition-all opacity-0 group-hover:opacity-100">
                <Trash2 size={18} />
            </button>
        </motion.div>
    );
}

const LibraryPage = () => {
  const texts = useLibraryStore((state) => state.texts);
  const removeText = useLibraryStore((state) => state.removeText);
  const sortedTexts = [...texts].sort((a,b) => b.lastRead - a.lastRead);

  if (texts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <BookOpen className="w-24 h-24 text-white/10 mb-6" />
        <h1 className="font-display text-3xl text-dark-text-primary mb-2">Your library is empty</h1>
        <p className="max-w-md text-dark-text-secondary mb-8">Nenhum texto ainda — transforme o seu input em aprendizado.</p>
        <Link to="/import">
          <Button variant="primary" icon={<Plus size={20} />}>
            Import your first text
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 pb-24">
      <header className="flex justify-between items-center mb-8">
        <h1 className="font-display text-4xl text-dark-text-primary">Library</h1>
        <Link to="/import">
          <Button variant="primary" icon={<Plus size={20}/>}>Import</Button>
        </Link>
      </header>
      <AnimatePresence>
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedTexts.map((text) => (
                <TextCard key={text.id} text={text} onRemove={removeText} />
            ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default LibraryPage;