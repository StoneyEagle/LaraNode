import i18next from 'i18next';
import middleware from 'i18next-http-middleware';
import FsBackend from 'i18next-node-fs-backend';

import ServiceProvider from "./ServiceProvider";

class LanguageServiceProvider extends ServiceProvider {
    public static class: string = this.getFilePath();

    constructor() {
        super();
    }

    public register(): void {
        // console.log('LanguageServiceProvider registered');
        i18next
        	.use(FsBackend)
        	.use(middleware.LanguageDetector)
        	.init({
        		fallbackLng: 'en',
        		saveMissing: true,
        		debug: false,
        	});

        globalThis.i18next = i18next;
    }

    public boot(): void {
        // console.log('LanguageServiceProvider booted');
    }

    protected static getFilePath(): string {
        const nodeModule = this.getNodeModule();
        return (nodeModule) ? nodeModule.filename : "";
    }

    protected static getNodeModule(): NodeModule | undefined {
        const nodeModule = Object.values(require.cache)
            .filter((mn) => mn?.filename.includes(this.name))
            .shift();
        return nodeModule;
    }
}

export default LanguageServiceProvider;
