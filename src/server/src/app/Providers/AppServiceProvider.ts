import { existsSync, mkdirSync, writeFileSync } from 'fs';

import ServiceProvider from '@framework/Providers/ServiceProvider';
import { applicationPaths, configFile, tokenFile } from '../Helper/paths';

class AppServiceProvider extends ServiceProvider {
    public static class: string = `${this.getFilePath()}`;

    constructor() {
        super();
    }

    public register(): void {
        super.register();
        this.createAppFolders();
    }

    public boot(): void {
        super.boot();
    }
    
    private createAppFolders() {
        for (let i = 0; i < Object.values(applicationPaths).length; i++) {
            const path = Object.values(applicationPaths)[i];
            mkdirSync(path, { recursive: true });
        }

        if (!existsSync(tokenFile)) {
            writeFileSync(tokenFile, JSON.stringify({}));
        }
        if (!existsSync(configFile)) {
            writeFileSync(configFile, JSON.stringify({}));
        }
    }
}

export default AppServiceProvider;