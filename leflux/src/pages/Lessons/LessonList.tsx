import React from 'react';
import { Link } from 'react-router-dom';

const LessonList: React.FC = () => {
    const lessons = [
        { id: 1, title: 'Introdução ao Idioma' },
        { id: 2, title: 'Vocabulário Básico' },
        { id: 3, title: 'Frases Comuns' },
        { id: 4, title: 'Gramática Fundamental' },
        { id: 5, title: 'Conversação Básica' },
    ];

    return (
        <div>
            <h1>Lista de Lições</h1>
            <ul>
                {lessons.map(lesson => (
                    <li key={lesson.id}>
                        <Link to={`/lessons/${lesson.id}`}>{lesson.title}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LessonList;