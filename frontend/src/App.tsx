import { Link, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import ModManager from './pages/ModManager';
import { Global } from '@mantine/core'


export default function App() {
    return (
        <div className="App">
            <Global styles={(theme) => ({
                // 'button:disabled': {
                //     backgroundColor: '#3c3c47 !important',
            
                //     '&:hover': {
                //         backgroundColor: '#3c3c47 !important'
                //     }
                // },
                '.mantine-Button-outline': {
                    border: '2px solid' 
                }
            })} />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="mod-manager" element={<ModManager />} />
            </Routes>
        </div>
    );
}