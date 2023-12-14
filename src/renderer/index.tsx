import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(<App />);

// calling IPC exposed from preload script
//  pager.js (render)
console.log("Sending message to main process");
window.electron.ipcRenderer.sendMessage('open-file', {
  title: 'Title',
  defaultPath: localStorage.getItem('defaultPath')
});

window.electron.ipcRenderer.on('open-file-paths', (event: any) => {
  console.log(event);
});