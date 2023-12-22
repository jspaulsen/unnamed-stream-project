import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

// add the id "draggable" to the root element
// container.id = 'draggable';

window.resizeTo(920, 670);
root.render(<App />);