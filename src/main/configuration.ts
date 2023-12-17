import { app, safeStorage } from 'electron';
import fs from 'fs';

const APPLICATION_NAME = 'shiddy';
const APPLICATION_DATA_PATH = app.getPath('userData') + '/' + APPLICATION_NAME + '/data';

interface Storage {
    [key: string]: any;
}

class Configuration {
    private static instance: Configuration;
    private configuration: Storage = {
        applicationName: 'Shiddy',
        applicationVersion: '0.1.0',
        dataPath: APPLICATION_DATA_PATH,
        websocketPort: 6969,
        twitchClientId: 'x4ialb6ptemxp1pgyyytyckgme7qp7',
        twitchScopes: [ // These are all scopes required by comfy.js
            'channel:manage:redemptions',
            'channel:read:redemptions',
            'user:read:email',
            'chat:edit',
            'chat:read',
        ],
    };
    
    private constructor () {
        const configurationFilePath = this.getConfigurationFilePath();

        if (!fs.existsSync(configurationFilePath)) {
            if (!fs.existsSync(APPLICATION_DATA_PATH)) {
                fs.mkdirSync(APPLICATION_DATA_PATH, { recursive: true });
            }

            fs.writeFileSync(configurationFilePath, JSON.stringify(this.configuration));
        }

        this.configuration = this.getConfiguration();
    }
    
    public get(key: string): any | undefined {
        return this.configuration[key];
    }

    public _saveOnSet(): void {
        const configurationFilePath = this.getConfigurationFilePath();

        fs.writeFileSync(
            configurationFilePath, 
            JSON.stringify(this.configuration),
        );
    }

    public set(key: string, value: any): void {
        if (value === null || value === undefined) {
            delete this.configuration[key];
        } else {
            this.configuration[key] = value;
        }

        this._saveOnSet();
    }

    public setSecret(key: string, value: any): void {
        this.configuration[key] = safeStorage.encryptString(value);
        this._saveOnSet();
    }

    public getSecret(key: string): any | undefined {
        const configItem = this.configuration[key];

        if (!configItem) {
            return undefined;
        }

        return safeStorage.decryptString(
            Buffer.from(configItem)
        );
    }

    private getConfigurationFilePath(): string {
        return APPLICATION_DATA_PATH + '/configuration.json';
    }

    private getConfiguration(): object {
        const configurationFilePath = this.getConfigurationFilePath();
        const configuration = fs.readFileSync(configurationFilePath, 'utf8');

        return JSON.parse(configuration);
    }

    public static getInstance(): Configuration {
        if (!Configuration.instance) {
            Configuration.instance = new Configuration();
        }

        return Configuration.instance;
    }
}

export default Configuration;
