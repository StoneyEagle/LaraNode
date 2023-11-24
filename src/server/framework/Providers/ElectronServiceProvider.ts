
import ServiceProvider from "./ServiceProvider";
import Electron from "@framework/Server/Electron";
import icon from "@/assets/icon.png?asset";
import DetectBrowsers from '@framework/Foundation/Helpers/detectBrowsers';

class ElectronServiceProvider extends ServiceProvider {
    public static class: string = this.getFilePath();

    electron: Electron | undefined;
    open: boolean = true;

    constructor() {
        super();
    }

    public register(): void {
    }

    public boot(): void {
        if(!DetectBrowsers()) return;

        this.electron = new Electron({
            icon: icon,
            open: this.open,
        });
        globalThis.electron = this.electron;

        this.electron.make();
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

export default ElectronServiceProvider;
