import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import DocumentAnalyzer from './pages/DocumentAnalyzer';
import FindLawyer from './pages/FindLawyer';
import KnowYourRights from './pages/KnowYourRights';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<Home />} />
            <Route path="/analyze" element={<DocumentAnalyzer />} />
            <Route path="/find-lawyer" element={<FindLawyer />} />
            <Route path="/rights" element={<KnowYourRights />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
