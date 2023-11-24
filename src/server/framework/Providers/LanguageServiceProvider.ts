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
    }
}

export default LanguageServiceProvider;
