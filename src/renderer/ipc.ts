import { Channels } from "../main/preload";

const ipcRenderer = window.electron.ipcRenderer;


interface IPCMessage {
    type: Channels;
    data: any;
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

    async getAccessToken() {
        return ipcRenderer.invoke(
            'get-access-token',
            {},
        );
    }

    async setAccessToken(accessToken?: string) {
        return await this.invoke({
            type: 'set-access-token',
            data: {
                accessToken,
            },
        });
    }

    async authorizeTwitch(): Promise<string> {
        return await this.invoke({
            type: 'authorize-twitch',
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