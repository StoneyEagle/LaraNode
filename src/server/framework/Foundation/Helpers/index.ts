import { dirname, resolve } from 'path';
import dotenv from 'dotenv';
import packageJson from "../../../../../package.json?commonjs-external&asset";
import './array';
import './string';

dotenv.config();

const ROOT = dirname(process.env.PWD ?? require.main?.filename ?? __dirname);

export type ServerVersion = typeof serverVersion;
export const serverVersion = (): string => {
	return require(packageJson).version;
};
globalThis.serverVersion = serverVersion;

export type BasePath = typeof base_path;
export const base_path = (path: string = ''): string => {
    return resolve(ROOT, path);
};
globalThis.base_path = base_path;

export type AppPath = typeof app_path;
export const app_path = (path: string = ''): string => {
    return resolve(ROOT, 'app', path);
};
globalThis.app_path = app_path;

export type ConfigPath = typeof config_path;
export const config_path = (path: string = ''): string => {
    return resolve(ROOT, 'config', path);
};
globalThis.config_path = config_path;

export type DatabasePath = typeof database_path;
export const database_path = (path: string = ''): string => {
    return resolve(ROOT, 'database', path);
};
globalThis.database_path = database_path;

export type PublicPath = typeof public_path;
export const public_path = (path: string = ''): string => {
    return resolve(ROOT, 'public', path);
};
globalThis.public_path = public_path;

export type ResourcePath = typeof resource_path;
export const resource_path = (path: string = ''): string => {
    return resolve(ROOT, 'resources', path);
};
globalThis.resource_path = resource_path;

export type StoragePath = typeof storage_path;
export const storage_path = (path: string = ''): string => {
    return resolve(ROOT, 'storage', path);
};
globalThis.storage_path = storage_path;

export type RoutePath = typeof route_path;
export const route_path = (path: string = ''): string => {
    return resolve(ROOT, 'routes', path);
};
globalThis.route_path = route_path;

export type ViewPath = typeof view_path;
export const view_path = (path: string = ''): string => {
    return resolve(ROOT, 'views', path);
};
globalThis.view_path = view_path;

export type Env = typeof env;
export const env = (key: string, fallback: string | number | boolean = ''): string | number | boolean => {
	const value = process.env[key];
	
	if(value == 'true' || value == 'false') {
		return value == 'true';
	} else if(Number.isNaN(Number(value))) {
    	return value ?? fallback;
	} else {
		return Number(value);
	}
};
globalThis.env = env;

export type Config = typeof config;
export const config = (key: string, fallback: string = ''): string|number|object => {
    const keys = key.split('.');
    const value = recompose(require(config_path(keys[0])), keys.slice(1).join('.'));

    return value ?? fallback;
};
globalThis.config = config;

function recompose(obj: { [x: string]: string|number|object; } | string | number | object, string: string) {
    if (!string) {
        return obj;
    }

    let parts = string.split('.');

    let newObj = obj[parts[0]];

    if (parts[1]) {
        parts.splice(0, 1);
        let newString = parts.join('.');
        return recompose(newObj, newString);
    }

    return newObj;
}

export type SetLocale = typeof setLocale;
export const setLocale = (language: string, country: string) => {
    process.env.LANGUAGE = language;
    process.env.COUNTRY = country;
};
globalThis.setLocale = setLocale;

export type Language = typeof language;
export const language = () => {
    return process.env.LANGUAGE;
};
globalThis.language = language;

export type Country = typeof country;
export const country = () => {
    return process.env.COUNTRY;
};
globalThis.country = country;

export type ServerName = typeof serverName;
export const serverName = (): string => {
	return config('app.name') as string;
}
globalThis.serverName = serverName;

let _serverHost: string = process.env.SERVER_HOST ? process.env.SERVER_HOST : 'http://localhost';
export type ServerHost = typeof serverHost;
export const serverHost = (): string => {
	return _serverHost as string;
}
globalThis.serverHost = serverHost;

export const setServerUrl = (url: string) => {
	_serverHost = url;
}

let _serverPort: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;
export type ServerPort = typeof serverPort;
export const serverPort = (): number => {
	return _serverPort as number;
}
globalThis.serverPort = serverPort;

export const setServerPort = (port: number) => {
	_serverPort = port;
}

export type View = typeof view;
export const view = (data: string, headers: any = {}) => {
	return {
		type: 'view',
		data,
		headers
	};
}
globalThis.view = view;

export type Redirect = typeof redirect;
export const redirect = (data: string, headers: any = {}) => {
	return {
		type: 'redirect',
		data,
		headers
	};
}
globalThis.redirect = redirect;

export type Json = typeof json;
export const json = <T>(data: T, headers: any = {}) => {
	return {
		type: 'json',
		data: data,
		headers
	};
}
globalThis.json = json;

export type Send = typeof send;
export const send = (data: any, headers: any = {}) => {
	return {
		type: 'send',
		data,
		headers
	};
}
globalThis.send = send;

export default {};