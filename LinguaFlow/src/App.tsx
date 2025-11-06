import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Library from '@/pages/Library';
import Import from '@/pages/Import';
import Reader from '@/pages/Reader';
import Vocabulary from '@/pages/Vocabulary';
import Review from '@/pages/Review';
import Texts from '@/pages/Texts';
import Account from '@/pages/Account';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Library />} />
        <Route path="/import" element={<Import />} />
        <Route path="/read/:id" element={<Reader />} />
        <Route path="/vocabulary" element={<Vocabulary />} />
        <Route path="/review" element={<Review />} />
        <Route path="/texts" element={<Texts />} />
        <Route path="/account" element={<Account />} />
      </Routes>
    </Router>
  );
}

export default App;
