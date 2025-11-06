import React, { useState } from 'react';

const Quiz = () => {
    const [questions, setQuestions] = useState([
        { question: 'Qual é a capital da França?', options: ['Paris', 'Londres', 'Berlim'], answer: 'Paris' },
        { question: 'Qual é a capital da Espanha?', options: ['Madrid', 'Barcelona', 'Sevilha'], answer: 'Madrid' },
        { question: 'Qual é a capital da Itália?', options: ['Roma', 'Milão', 'Veneza'], answer: 'Roma' },
    ]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [score, setScore] = useState(0);
    const [quizCompleted, setQuizCompleted] = useState(false);

    const handleAnswer = (option: string) => {
        if (option === questions[currentQuestionIndex].answer) {
            setScore(score + 1);
        }
        const nextQuestion = currentQuestionIndex + 1;
        if (nextQuestion < questions.length) {
            setCurrentQuestionIndex(nextQuestion);
            setUserAnswer('');
        } else {
            setQuizCompleted(true);
        }
    };

    const handleRestart = () => {
        setCurrentQuestionIndex(0);
        setScore(0);
        setQuizCompleted(false);
    };

    return (
        <div className="quiz-container">
            {quizCompleted ? (
                <div>
                    <h2>Quiz Completo!</h2>
                    <p>Você acertou {score} de {questions.length} perguntas.</p>
                    <button onClick={handleRestart}>Reiniciar Quiz</button>
                </div>
            ) : (
                <div>
                    <h2>{questions[currentQuestionIndex].question}</h2>
                    <div>
                        {questions[currentQuestionIndex].options.map((option) => (
                            <button key={option} onClick={() => handleAnswer(option)}>
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Quiz;