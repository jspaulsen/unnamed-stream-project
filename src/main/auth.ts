import { BrowserWindow } from 'electron';
import { mainWindow } from './main';


interface AuthorizeTwitchOpts {
    clientId: string;
    scopes: string[];
}

function authorizeTwitch(opts: AuthorizeTwitchOpts): Promise<string | null> {
    const url = new URL('https://id.twitch.tv/oauth2/authorize');

    let promiseResolve: (token: string | null) => void;
    let promiseReject: (error: string | null) => void;

    const promise: Promise<string | null> = new Promise((resolve, reject) => {
      promiseResolve = resolve;
      promiseReject = reject;
    });

    url.searchParams.append('client_id', opts.clientId);
    url.searchParams.append('redirect_uri', "http://localhost/callback"),
    url.searchParams.append('response_type', 'token');
    url.searchParams.append('scope', opts.scopes.join(' '));

    if (!mainWindow) {
        return Promise.reject('mainWindow is not defined');
    }

    const authWindow = new BrowserWindow({
        width: 800,
        height: 600,
        frame: true,
        resizable: false,
        autoHideMenuBar: true,
    });

    // Twitch doesn't like the default user agent, so we'll lie and say we're Chrome
    authWindow.webContents.on('did-create-window', (window) => {
        window.webContents.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    });


    authWindow.loadURL(url.toString());

    authWindow.webContents.on('will-navigate', (event, url) => {
        const queryParams = new URLSearchParams(
            url
                .split('#')[1]
        );

        const accessToken = queryParams.get('access_token');
        const error = queryParams.get('error');

        if (accessToken || error) {
            authWindow.destroy();
            
            if (queryParams.get('error')) {
                promiseReject(queryParams.get('error'));
            } else {
                promiseResolve(accessToken);
            }
        }
    });

    return promise;
}

export {
    authorizeTwitch,
    AuthorizeTwitchOpts,
}