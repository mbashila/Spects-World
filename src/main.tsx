import {createRoot} from 'react-dom/client';
import '@fontsource/open-sauce-one/latin-400.css';
import '@fontsource/open-sauce-one/latin-500.css';
import '@fontsource/open-sauce-one/latin-600.css';
import '@fontsource/open-sauce-one/latin-700.css';
import '@fontsource/open-sauce-one/latin-800.css';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);
