import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { Button } from '../components/common/Button';
import ProgressBar from '../components/ui/ProgressBar';
import { StudyAssistant } from '../components/common/StudyAssistant';
import { StoryGenerator } from '../components/common/StoryGenerator';

const Home: React.FC = () => {
    const [assistantOpen, setAssistantOpen] = useState(false);
    
    return (
        <div className="home space-y-12">
            <div>
                <h1>Bem-vindo ao LeFlux!</h1>
                <p>Aprenda idiomas de forma divertida e interativa.</p>
                <ProgressBar progress={50} />
            </div>

            <div className="actions">
                <Link to="/lessons">
                    <Button>Começar a Aprender</Button>
                </Link>
                <Link to="/library">
                    <Button>Ver Biblioteca</Button>
                </Link>
                <Link to="/settings">
                    <Button>Configurações</Button>
                </Link>
            </div>

            <StoryGenerator
                language="Português"
                languageCode="pt-BR"
                maxCharacters={1000}
            />
            
            <button 
                onClick={() => setAssistantOpen(!assistantOpen)}
                className="fixed bottom-20 right-6 rounded-full bg-accent p-3 hover:bg-accent/80 transition-colors shadow-lg"
                title="Assistente de Estudo"
            >
                <MessageCircle className="h-6 w-6 text-white" />
            </button>
            
            <StudyAssistant 
                language="Português"
                context="Estou ajudando você a aprender idiomas"
                visible={assistantOpen}
                onClose={() => setAssistantOpen(false)}
            />
        </div>
    );
};

export default Home;