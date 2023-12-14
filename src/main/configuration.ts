import { app } from 'electron';
import fs from 'fs';


class Configuration {
    private static instance: Configuration;

    /* Configuration fields */
    public applicationName: string = 'Electron React Boilerplate'; // TODO
    public applicationVersion: string = '0.0.1'; // TODO
    public websocketPort: number = 8080;
    
    private constructor () {
        const configurationFilePath = this.getConfigurationFilePath();

        if (!fs.existsSync(configurationFilePath)) {
            fs.writeFileSync(configurationFilePath, JSON.stringify(this));
        }

        const configuration = this.getConfiguration();

        this.applicationName = configuration.applicationName;
        this.applicationVersion = configuration.applicationVersion;
        this.websocketPort = configuration.websocketPort;
    }
    
    public static getInstance(): Configuration {
        if (!Configuration.instance) {
            Configuration.instance = new Configuration();
        }
    
        return Configuration.instance;
    }

    private getConfigurationFilePath(): string {
        return `${app.getPath('userData')}/configuration.json`;
    }

    public getConfiguration(): any {
        const configurationFilePath = this.getConfigurationFilePath();
        const configuration = fs.readFileSync(configurationFilePath, 'utf8');

        return JSON.parse(configuration);
    }
}

export default Configuration;
