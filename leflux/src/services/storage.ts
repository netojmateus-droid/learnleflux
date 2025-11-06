import Dexie from 'dexie';

class LeFluxDB extends Dexie {
    lessons: Dexie.Table<Lesson, number>; // Define a table for lessons

    constructor() {
        super('LeFluxDB');
        this.version(1).stores({
            lessons: '++id,title,content', // Primary key and indexed fields
        });

        this.lessons = this.table('lessons');
    }
}

const db = new LeFluxDB();

export const addLesson = async (lesson: Lesson) => {
    return await db.lessons.add(lesson);
};

export const getLessons = async () => {
    return await db.lessons.toArray();
};

export const updateLesson = async (id: number, updatedLesson: Partial<Lesson>) => {
    return await db.lessons.update(id, updatedLesson);
};

export const deleteLesson = async (id: number) => {
    return await db.lessons.delete(id);
};

export default db;