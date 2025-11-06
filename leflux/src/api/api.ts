import axios from 'axios';

const API_BASE_URL = 'https://api.example.com'; // Substitua pela URL da sua API

export const fetchLanguages = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/languages`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar idiomas:', error);
        throw error;
    }
};

export const fetchLessons = async (languageId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/lessons?languageId=${languageId}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar lições:', error);
        throw error;
    }
};

export const fetchFlashcards = async (lessonId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/flashcards?lessonId=${lessonId}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar flashcards:', error);
        throw error;
    }
};