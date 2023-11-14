
// import { resolve } from "path";
import ServiceProvider from "./ServiceProvider";
import Electron from "@framework/Server/Electron";
import icon from "@/assets/icon.png?asset";

class ElectronServiceProvider extends ServiceProvider {
    public static class: string = this.getFilePath();

    electron: Electron| undefined;

    constructor() {
        super();
    }

    public register(): void {
        // console.log('ElectronServiceProvider registered');
    }

    public boot(): void {
        // console.log('ElectronServiceProvider booted');
        
        this.electron = new Electron({
            icon: icon,
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
