import { Channels } from "../main/preload";

const ipcRenderer = window.electron.ipcRenderer;


interface IPCMessage {
    type: Channels;
    data: any;
}


interface SpotifyAccessToken {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
    expires?: number;
}
  
    

class IpcInterface {
    async invoke(message: IPCMessage) {
        return await ipcRenderer.invoke(
            message.type,
            message.data,
        );
    }

    async sendMessage(message: IPCMessage) {
        return ipcRenderer.sendMessage(
            message.type,
            message.data,
        );
    }

    async getTwitchAccessToken() {
        return ipcRenderer.invoke(
            'get-twitch-access-token',
            {},
        );
    }

    async setTwitchAccessToken(accessToken?: string) {
        return await this.invoke({
            type: 'set-twitch-access-token',
            data: {
                accessToken,
            },
        });
    }

    async getSpotifyRefreshToken() {
        return ipcRenderer.invoke(
            'get-spotify-refresh-token',
            {},
        );
    }

    async setSpotifyRefreshToken(refreshToken?: string) {
        return await this.invoke({
            type: 'set-spotify-refresh-token',
            data: {
                refreshToken,
            },
        });
    }

    async authorizeTwitch(): Promise<string> {
        return await this.invoke({
            type: 'authorize-twitch',
            data: {},
        });
    }

    async authorizeSpotify(): Promise<SpotifyAccessToken> {
        return await this.invoke({
            type: 'authorize-spotify',
            data: {},
        });
    }

    async getSpotifyClientId() {
        return await this.invoke({
            type: 'get-spotify-client-id',
            data: {},
        });
    }

    quit() {
        ipcRenderer.sendMessage('app-quit');
    }
}

const ipc = new IpcInterface();


export {
    ipc,
    IPCMessage,
}