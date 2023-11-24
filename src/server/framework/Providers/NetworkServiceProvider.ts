import axios from 'axios';
import os from 'os';
import { readFileSync, statSync } from "fs";

import Logger from '@framework/Foundation/Logger';

import ServiceProvider from "./ServiceProvider";

class NetworkServiceProvider extends ServiceProvider {
    public static class: string = this.getFilePath();

    public constructor() {
        super();
        globalThis.internalIp = this.get_internal_ip();
        globalThis.externalIp = '';
        this.get_external_ip().then((ip) => {
            globalThis.externalIp = ip;
        });
    }

    public register(): void {
    }

    public boot(): void {
    }
    
        
    public async get_external_ip() {
        return await axios
            .get<string>('https://api.ipify.org/')
            .then(({ data }) => {
                return data;
            })
            .catch((error) => {
                Logger.log({
                    level: 'error',
                    name: 'networking',
                    color: 'red',
                    message: error?.response ?? 'failed to obtain public ip address.',
                });
            });
    };

    public get_internal_ip() {
        if (this.isWsl() && !process.env.INTERNAL_IP) {
            console.log('You are running the server on WSL, You must set an internal IP in your .env.');
            process.exit(0);
        }

        const interfaces = os.networkInterfaces();
        const addresses: any[] = [];
        for (const k in interfaces) {
            for (const k2 in interfaces[k]) {
                const address = interfaces?.[k]?.[k2];
                if (!address) {
                    continue;
                }
                addresses.push(address);
            }
        }

        const result = addresses.find(
            a =>
                !a.address.startsWith('127') && !a.address.startsWith('172') && a.family === 'IPv4' && !a.internal && a.netmask == '255.255.255.0'
        );

        return result?.address ?? process.env.INTERNAL_IP;
    };
    
    private isWsl() {
        if (process.platform !== 'linux') {
            return false;
        }

        if (os.release().toLowerCase().includes('microsoft')) {
            if (this.isDocker()) {
                return false;
            }

            return true;
        }

        try {
            return readFileSync('/proc/version', 'utf8').toLowerCase().includes('microsoft')
                ? !this.isDocker() : false;
        } catch {
            return false;
        }
    };
    
    private hasDockerEnv() {
        try {
            statSync('/.dockerenv');
            return true;
        } catch (_) {
            return false;
        }
    }

    private hasDockerCGroup() {
        try {
            return readFileSync('/proc/self/cgroup', 'utf8').includes('docker');
        } catch (_) {
            return false;
        }
    }

    private isDocker() {
        return this.hasDockerEnv() || this.hasDockerCGroup();
    };

}

export default NetworkServiceProvider;
