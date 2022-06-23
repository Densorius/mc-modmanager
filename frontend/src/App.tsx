import './styles/globals.scss';
import { Link, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import ModManager from './pages/ModManager';

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="mod-manager" element={<ModManager />} />
            </Routes>
        </div>
    );
}

export default App;