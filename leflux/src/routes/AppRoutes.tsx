import { Routes, Route } from 'react-router-dom';
import { LibraryHome } from '@/pages/Library/Home';
import { ImportPage } from '@/pages/Import';
import { ReaderPage } from '@/pages/Reader';
import { VocabularyPage } from '@/pages/Vocabulary';
import { ReviewPage } from '@/pages/Review';
import { TextsPage } from '@/pages/Texts';
import { AccountPage } from '@/pages/Account';

export function AppRoutes() {
    return (
        <Routes>
            <Route index element={<LibraryHome />} />
            <Route path="import" element={<ImportPage />} />
            <Route path="read/:id" element={<ReaderPage />} />
            <Route path="vocabulary" element={<VocabularyPage />} />
            <Route path="review" element={<ReviewPage />} />
            <Route path="texts" element={<TextsPage />} />
            <Route path="account" element={<AccountPage />} />
        </Routes>
    );
}

    export default AppRoutes;