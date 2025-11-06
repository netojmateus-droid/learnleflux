import Dexie from 'dexie';

class LeFluxDB extends Dexie {
    lessons: Dexie.Table<Lesson, number>; // Define a table for lessons

    constructor() {
        super("LeFluxDB");
        this.version(1).stores({
            lessons: '++id, title, content, language, createdAt', // Define the schema for the lessons table
        });

        this.lessons = this.table("lessons");
    }

    // Method to add a lesson
    async addLesson(lesson: Lesson) {
        return await this.lessons.add(lesson);
    }

    // Method to get all lessons
    async getAllLessons() {
        return await this.lessons.toArray();
    }

    // Method to get a lesson by id
    async getLessonById(id: number) {
        return await this.lessons.get(id);
    }

    // Method to update a lesson
    async updateLesson(id: number, lesson: Partial<Lesson>) {
        return await this.lessons.update(id, lesson);
    }

    // Method to delete a lesson
    async deleteLesson(id: number) {
        return await this.lessons.delete(id);
    }
}

// Define the Lesson type
interface Lesson {
    id?: number;
    title: string;
    content: string;
    language: string;
    createdAt: Date;
}

const db = new LeFluxDB();
export default db;