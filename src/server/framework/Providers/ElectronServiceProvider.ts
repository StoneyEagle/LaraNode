
import ServiceProvider from "./ServiceProvider";
import Electron from "@framework/Server/Electron";
import icon from "@/assets/icon.png?asset";
import DetectBrowsers from '@framework/Foundation/Helpers/detectBrowsers';

class ElectronServiceProvider extends ServiceProvider {
    public static class: string = this.getFilePath();

    electron: Electron | undefined;
    open: boolean = true;
    title: string = '';
    tooltip: string = '';

    constructor() {
        super();
    }

    public async register(): Promise<void> {
    }

    public async boot(): Promise<void> {
        if (!DetectBrowsers()) return;

        this.electron = new Electron({
            icon: icon,
            open: this.open,
            title: this.title,
            tooltip: this.tooltip,
            url: 'https://vue-dev.nomercy.tv',
        });
        globalThis.electron = this.electron;

        this.electron.make();
    }
}

export default ElectronServiceProvider;
