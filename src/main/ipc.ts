import { BrowserWindow, IpcMain, IpcMainEvent, IpcMainInvokeEvent, dialog, ipcMain } from 'electron';
import { mainWindow } from './main';
import Configuration from './configuration';
import axios from 'axios';
import { access } from 'fs';
import { authorizeTwitch } from './auth';
import { config } from 'process';


interface Filters {
    name: string;
    extensions: string[];
}

interface OpenFileData {
    title: string;
    defaultPath?: string;
    filters: Filters[];
}

ipcMain.handle('open-file', async (_: IpcMainInvokeEvent, data: OpenFileData) => {
    if (!mainWindow) {
        return;
    }

    if (!data.defaultPath) {
        data.defaultPath = '.';
    }

    return await dialog.showOpenDialog(mainWindow, data);
});

ipcMain.handle('get-access-token', async (_: IpcMainInvokeEvent, __: any) => {
    return Configuration
        .getInstance()
        .getSecret('accessToken');
});

ipcMain.handle('set-access-token', async (_: IpcMainInvokeEvent, data: any) => {
    console.log('set-access-token', data);
    Configuration
        .getInstance()
        .setSecret('accessToken', data.accessToken);
});

ipcMain.handle('authorize-twitch', async (_: IpcMainInvokeEvent, __: any) => {
    const configuration = Configuration.getInstance();
    const clientId = configuration.get('twitchClientId');
    const scopes = configuration.get('twitchScopes');

    const result = authorizeTwitch({
        clientId,
        scopes,
    });

    return result;
});


export {
    ipcMain,
}
