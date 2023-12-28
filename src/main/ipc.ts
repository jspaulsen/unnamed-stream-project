import { BrowserWindow, IpcMain, IpcMainEvent, IpcMainInvokeEvent, dialog, ipcMain } from 'electron';
import { app, mainWindow } from './main';
import Configuration from './configuration';
import axios from 'axios';
import { access } from 'fs';
import { authorizeSpotify, authorizeTwitch } from './auth';
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

ipcMain.on('app-quit', () => {
    app.quit();
});

ipcMain.handle('open-file', async (_: IpcMainInvokeEvent, data: OpenFileData) => {
    if (!mainWindow) {
        return;
    }

    if (!data.defaultPath) {
        data.defaultPath = '.';
    }

    return await dialog.showOpenDialog(mainWindow, data);
});

ipcMain.handle('get-twitch-access-token', async (_: IpcMainInvokeEvent, __: any) => {
    const result =  Configuration
        .getInstance()
        .getSecret('twitchAccessToken');

    return result;
    
});

ipcMain.handle('set-twitch-access-token', async (_: IpcMainInvokeEvent, data: any) => {
    Configuration
        .getInstance()
        .setSecret('twitchAccessToken', data.accessToken);
});

ipcMain.handle('get-spotify-refresh-token', async (_: IpcMainInvokeEvent, __: any) => {
    return Configuration
        .getInstance()
        .getSecret('spotifyRefreshToken');
});

ipcMain.handle('set-spotify-refresh-token', async (_: IpcMainInvokeEvent, data: any) => {
    Configuration
        .getInstance()
        .setSecret('spotifyRefreshToken', data.refreshToken);
});

ipcMain.handle('authorize-twitch', async (_: IpcMainInvokeEvent, __: any) => {
    const configuration = Configuration.getInstance();
    const clientId = configuration.get('twitchClientId');
    const scopes = configuration.get('twitchScopes');
    const redirectUri = configuration.get('twitchCallbackUrl');

    const result = authorizeTwitch({
        clientId,
        scopes,
        callbackUrl: redirectUri,
    });

    return result;
});

ipcMain.handle('authorize-spotify', async (_: IpcMainInvokeEvent, __: any) => {
    const configuration = Configuration.getInstance();
    const clientId = configuration.get('spotifyClientId');
    const scopes = configuration.get('spotifyScopes');
    const redirectUri = configuration.get('spotifyCallbackUrl');

    const result = authorizeSpotify({
        clientId,
        scopes,
        callbackUrl: redirectUri,
    });

    return result;
});

ipcMain.handle('get-spotify-client-id', async (_: IpcMainInvokeEvent, __: any) => {
    const configuration = Configuration.getInstance();
    const clientId = configuration.get('spotifyClientId');

    return clientId;
});


export {
    ipcMain,
}
