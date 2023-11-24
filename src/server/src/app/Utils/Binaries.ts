import path, { basename } from "path";
import { chmodSync, createWriteStream, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "fs";
import request from 'request';
import unzipper from 'unzipper';

import Logger from "@framework/Foundation/Logger";
import { fileChangedAgo } from "@framework/Foundation/Helpers/time";
import { binariesPath, ffmpeg, ffprobe, fpcalc, makeMkv, sslCA, sslCert, sslKey, subtitleEdit } from "../Helper/paths";
import { Download } from "@/types/server/info";

class Binaries {

    list: Download[] = [];

    constructor(list: Download[]) {
        this.list = list;
    }

    public async downloadAll() {
        for (const program of this.list) {
            if (this.fileLastModified(program.name) > 7) {
                await this.download(program);
            }
        }
    }

    private async download(program: Download) {

        const name = basename(program.url);

        this.info(`Downloading: ${program.name}`);

        await new Promise<void>(async (resolve, reject) => {
            request.head(program.url, () => {
                request(program.url).pipe(
                    createWriteStream(path.resolve(binariesPath, name))
                        .on('finish', async () => {
                            if (existsSync(path.resolve(binariesPath, name))) {

                                await this.extract(name, program);

                                resolve();
                            }
                        })
                );
            });
        });
    }

    private async extract(name: string, program: any) {

        this.info(`Unpacking: ${path.resolve(binariesPath, name)}`);

        const buffer = readFileSync(path.resolve(binariesPath, name));
        const directory = await unzipper.Open.buffer(buffer);

        let folders = directory.files.filter(f => f.type === 'Directory');
        let files = directory.files.filter(f => f.type === 'File');

        if (program.filter) {
            folders = directory.files.filter(f => f.type === 'Directory').filter(f => f.path.includes(program.filter || ''));
            files = directory.files
                .filter(f => f.type === 'File')
                .filter(f => f.path.includes(program.filter || ''))
                .map((f) => {
                    return {
                        ...f,
                        path: f.path.replace(/.*\//u, ''),
                    };
                });
        }

        for (const f of folders) {
            this.verbose(`mkdir: ${path.resolve(binariesPath, program.path, f.path)}`);
            mkdirSync(path.resolve(binariesPath, program.path, f.path), {
                recursive: true,
            });
        }

        for (const f of files) {
            const content = await f.buffer();

            const file = path.resolve(binariesPath, program.path, f.path);

            if (!existsSync(path.dirname(file))) {
                this.verbose(`mkdir: ${path.dirname(file)}`);

                mkdirSync(path.dirname(file), { recursive: true });
            }

            this.verbose(`write: ${file}`);

            writeFileSync(`${file}`, content);
            chmodSync(`${file}`, 711);
        }

        this.verbose(`rm: ${path.resolve(binariesPath, name)}`);

        rmSync(path.resolve(binariesPath, name));

    }

    private fileLastModified(name: string) {
        let file: string;
        switch (name) {
            case 'ffmpeg':
                file = ffmpeg;
                break;
            case 'ffprobe':
                file = ffprobe;
                break;
            case 'makemkv':
                file = makeMkv;
                break;
            case 'subtitleedit':
                file = subtitleEdit;
                break;
            case 'sslCA':
                file = sslCA;
                break;
            case 'sslCert':
                file = sslCert;
                break;
            case 'sslKey':
                file = sslKey;
                break;
            case 'fpcalc':
                file = fpcalc;
                break;
            default:
                return Number.MAX_SAFE_INTEGER;
        }

        if (!existsSync(file)) {
            return Number.MAX_SAFE_INTEGER;
        }

        return fileChangedAgo(file, 'days');
    };

    private info(message: string) {
        Logger.log({
            level: 'info',
            name: 'setup',
            color: 'blueBright',
            message: message,
        });
    }

    private verbose(message: string) {
        Logger.log({
            level: 'verbose',
            name: 'setup',
            color: 'blueBright',
            message: message,
        });
    }

}

export default Binaries;