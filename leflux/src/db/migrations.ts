import { db } from './dexie';

export const migrateDatabase = async () => {
    const currentVersion = await db.version();
    
    if (currentVersion < 1) {
        await db.version(1).stores({
            lessons: '++id,title,content',
            users: '++id,name,language',
        });
    }

    if (currentVersion < 2) {
        await db.version(2).stores({
            lessons: '++id,title,content,updatedAt',
        });
    }

    // Add more migrations as needed
};