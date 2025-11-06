import React from 'react';
import { useParams } from 'react-router-dom';

const LessonDetail: React.FC = () => {
    const { lessonId } = useParams<{ lessonId: string }>();

    // Simulação de dados da lição
    const lessonData = {
        title: 'Título da Lição',
        content: 'Conteúdo da lição...',
        vocabulary: ['palavra1', 'palavra2', 'palavra3'],
    };

    return (
        <div>
            <h1>{lessonData.title}</h1>
            <p>{lessonData.content}</p>
            <h2>Vocabulário</h2>
            <ul>
                {lessonData.vocabulary.map((word, index) => (
                    <li key={index}>{word}</li>
                ))}
            </ul>
        </div>
    );
};

export default LessonDetail;