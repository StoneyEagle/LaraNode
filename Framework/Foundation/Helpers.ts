import { dirname, resolve } from 'path';
import dotenv from 'dotenv';
dotenv.config();

const ROOT = dirname(process.env.PWD ?? require.main?.filename ?? __dirname);

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
export const env = (key: string, fallback: string = ''): string => {
    return process.env[key] ?? fallback;
};
globalThis.env = env;

export type Config = typeof config;
export const config = (key: string, fallback: string = ''): string => {
    const keys = key.split('.');
    const value = recompose(require(config_path(keys[0])).default, keys.slice(1).join('.'));

    return value ?? fallback;
};
globalThis.config = config;

function recompose(obj, string) {
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
