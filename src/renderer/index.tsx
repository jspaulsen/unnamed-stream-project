import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

window.resizeTo(920, 670);
root.render(<App />);

// console.log(
//     window.electron.ipcRenderer.invoke('authorize-twitch', {})
// );

// // calling IPC exposed from preload script
// //  pager.js (render)
// console.log("Sending message to main process");
// window.electron.ipcRenderer.sendMessage('open-file', {
//   title: 'Title',
//   defaultPath: localStorage.getItem('defaultPath')
// });

// window.electron.ipcRenderer.on('open-file-paths', (event: any) => {
//   console.log(event);
// });

// await window.electron.ipcRenderer.invoke(
//   'open-file', 
//   { title: 'Title', defaultPath: localStorage.getItem('defaultPath')},
// );




// window.electron.ipcRenderer.invoke('open-file', {
//   title: 'Title',
//   defaultPath: localStorage.getItem('defaultPath')
// }).then((event: any) => {
//   console.log(event);
// });