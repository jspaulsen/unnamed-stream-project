import { IpcMainEvent, dialog, ipcMain } from 'electron';
import { mainWindow } from './main';


interface Filters {
    name: string;
    extensions: string[];
}

interface OpenFileData {
    title: string;
    defaultPath: string;
    filters: Filters[];
}

ipcMain.on('open-file', async (event: IpcMainEvent, data: OpenFileData) => {
    console.log(event);
    console.log(data); // title, defaultPath

    if (!mainWindow) {
        return;
    }

    dialog.showOpenDialog(mainWindow, {})
        .then(result => {
            event.reply('open-file-paths', result);
        }).catch(err => {
            console.error(err);
        });
});

console.log('ipc.ts loaded');

export {
    ipcMain,
}

// https://stackoverflow.com/questions/70331707/how-do-i-use-showopendialog-withe-electron-s-ipc