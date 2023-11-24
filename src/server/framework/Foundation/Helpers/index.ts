import { dirname, resolve } from 'path';
import dotenv from 'dotenv';
import packageJson from "../../../../../package.json?commonjs-external&asset";
import Queue from "queue-promise";

import './time';
import './array';
import './string';

dotenv.config();

const ROOT = dirname(process.env.PWD ?? require.main?.filename ?? __dirname);

export const serverVersion = (): string => {
	return require(packageJson).version;
};
export type ServerVersion = typeof serverVersion;
globalThis.serverVersion = serverVersion;

export const base_path = (path: string = ''): string => {
	return resolve(ROOT, path);
};
export type BasePath = typeof base_path;
globalThis.base_path = base_path;

export const app_path = (path: string = ''): string => {
	return resolve(ROOT, 'app', path);
};
export type AppPath = typeof app_path;
globalThis.app_path = app_path;

export const config_path = (path: string = ''): string => {
	return resolve(ROOT, 'config', path);
};
export type ConfigPath = typeof config_path;
globalThis.config_path = config_path;

export const database_path = (path: string = ''): string => {
	return resolve(ROOT, 'database', path);
};
export type DatabasePath = typeof database_path;
globalThis.database_path = database_path;

export const public_path = (path: string = ''): string => {
	return resolve(ROOT, 'public', path);
};
export type PublicPath = typeof public_path;
globalThis.public_path = public_path;

export const resource_path = (path: string = ''): string => {
	return resolve(ROOT, 'resources', path);
};
export type ResourcePath = typeof resource_path;
globalThis.resource_path = resource_path;

export const storage_path = (path: string = ''): string => {
	return resolve(ROOT, 'storage', path);
};
export type StoragePath = typeof storage_path;
globalThis.storage_path = storage_path;

export const route_path = (path: string = ''): string => {
	return resolve(ROOT, 'routes', path);
};
export type RoutePath = typeof route_path;
globalThis.route_path = route_path;

export const view_path = (path: string = ''): string => {
	return resolve(ROOT, 'views', path);
};
export type ViewPath = typeof view_path;
globalThis.view_path = view_path;

export const env = (key: string, fallback: string | number | boolean = ''): string | number | boolean => {
	const value = process.env[key];

	if (value == 'true' || value == 'false') {
		return value == 'true';
	} else if (Number.isNaN(Number(value))) {
		return value ?? fallback;
	} else {
		return Number(value);
	}
};
export type Env = typeof env;
globalThis.env = env;

export const config = (key: string, fallback: string = ''): any => {
	const keys = key.split('.');
	const value = recompose(require(config_path(keys[0])), keys.slice(1).join('.'));

	return value ?? fallback;
};
export type Config = typeof config;
globalThis.config = config;

function recompose(obj: { [x: string]: string | number | object; } | string | number | object, string: string) {
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

export const setLocale = (language: string, country: string) => {
	process.env.LANGUAGE = language;
	process.env.COUNTRY = country;
};
export type SetLocale = typeof setLocale;
globalThis.setLocale = setLocale;

export const language = () => {
	return process.env.LANGUAGE;
};
export type Language = typeof language;
globalThis.language = language;

export const country = () => {
	return process.env.COUNTRY;
};
export type Country = typeof country;
globalThis.country = country;

export const serverName = (): string => {
	return config('app.name') as string;
};
export type ServerName = typeof serverName;
globalThis.serverName = serverName;

let _serverHost: string = process.env.SERVER_HOST ? process.env.SERVER_HOST : 'http://localhost';
export const serverHost = (): string => {
	return _serverHost as string;
};
export type ServerHost = typeof serverHost;
globalThis.serverHost = serverHost;

export const setServerUrl = (url: string) => {
	_serverHost = url;
};

let _serverPort: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;
export const serverPort = (): number => {
	return _serverPort as number;
};
export type ServerPort = typeof serverPort;
globalThis.serverPort = serverPort;

export const setServerPort = (port: number) => {
	_serverPort = port;
};

export const view = <T>(data: T, headers: Partial<Headers> = {}) => {
	return {
		type: 'view',
		data,
		headers
	};
};
export type View = typeof view;
globalThis.view = view;

export const redirect = <T>(data: T, headers: Partial<Headers> = {}) => {
	return {
		type: 'redirect',
		data,
		headers
	};
};
export type Redirect = typeof redirect;
globalThis.redirect = redirect;

export const json = <T>(data: T, headers: Partial<Headers> = {}) => {
	return {
		type: 'json',
		data: data,
		headers
	};
};
export type Json = typeof json;
globalThis.json = json;

export const send = <T>(data: T, headers: Partial<Headers> = {}) => {
	return {
		type: 'send',
		data,
		headers
	};
};
export type Send = typeof send;
globalThis.send = send;

const promiseQueue = new Queue({
	concurrent: 50,
	interval: 1000,
	start: true,
});
export type PromiseQueue = typeof promiseQueue;
globalThis.promiseQueue = promiseQueue;
