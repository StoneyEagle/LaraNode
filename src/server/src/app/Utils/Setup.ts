import { AxiosError } from "axios";
import { Download, Info, Keys } from "@/types/server/info";
import { platform } from "../Helper/system";
import Logger from "@framework/Foundation/Logger";
import Binaries from "./Binaries";
import Register from "./Register";
import apiClient from "../Http/Clients/apiClient";
import logo from "./logo";

class Setup {
    downloads: Download[] = [];
    keys: Keys | undefined;
    colors: string[] | undefined;
    quote: string | undefined;

    constructor() {
        // this.init();
    }

    public async init() {
        return new Promise(async (resolve) => {
            this.requestInfo().then((info) => {
                this.downloads = info?.data.downloads[platform];
                this.keys = info?.data.keys;
                this.colors = info?.data.colors;
                this.quote = info?.data.quote;

                globalThis.quote = this.quote;
                globalThis.colors = this.colors;

            }).then(async () => {

                process.env.OMDB_API_KEY = this.keys?.omdb_key ?? '';
                process.env.TADB_API_KEY = this.keys?.tadb_key ?? '';
                process.env.TMDB_API_KEY = this.keys?.tmdb_token ?? '';
                process.env.TVDB_API_KEY = this.keys?.tvdb_key ?? '';
                process.env.ROTTEN_API_KEY = this.keys?.rotten_tomatoes ?? '';
                process.env.FANART_API_KEY = this.keys?.fanart_key ?? '';
                process.env.MUSIXMATCH_API_KEY = this.keys?.musixmatch_key ?? '';
                process.env.ACOUSTIC_ID = this.keys?.acoustic_id ?? '';
                process.env.JWPLAYER_KEY = this.keys?.jwplayer_key ?? '';

                const downloader = new Binaries(this.downloads);
                await downloader.downloadAll();
            }).then(async () => {
                await this.registerServer();
            }).finally(() => {
                logo(this.quote ?? '');
                resolve(true);
            });
        });
    }

    private async requestInfo() {
        try {
            const response = await apiClient()
                .get<Info>('info');
            return response.data;
        } catch (error: AxiosError | any) {
            Logger.log({
                level: 'error',
                name: 'setup',
                color: 'redBright',
                message: `Failed to download binaries list: ${error?.message}`,
            });
        }
    }

    private async registerServer() {
        const register = new Register();
        await register.init();
    }

}

export default Setup;