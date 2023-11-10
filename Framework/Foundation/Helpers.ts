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
export const config = (key: string, fallback: string = ''): string => {
    const keys = key.split('.');
    const value = recompose(require(config_path(keys[0])).default, keys.slice(1).join('.'));

    return value ?? fallback;
};
globalThis.config = config;

function recompose(obj: { [x: string]: any; }, string: string) {
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
	return config('app.name');
}
globalThis.serverName = serverName;

String.prototype.capitalize = function (): string {
	return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.toTitleCase = function (): string {
	let i: number;
	let j: number;
	let str: string;

	str = this.replace(/([^\W_]+[^\s-]*) */gu, (txt) => {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});

	// Certain minor words should be left lowercase unless
	// they are the first or last words in the string

	['a', 'for', 'so', 'an', 'in', 'the', 'and', 'nor', 'to', 'at', 'of', 'up', 'but', 'on', 'yet', 'by', 'or'];
	const lowers = ['A', 'An', 'The', 'And', 'But', 'Or', 'For', 'Nor', 'As', 'At', 'By', 'For', 'From', 'In', 'Into', 'Near', 'Of', 'On', 'Onto', 'To', 'With'];
	for (i = 0, j = lowers.length; i < j; i++) {
		str = str.replace(new RegExp(`\\s${lowers[i]}\\s`, 'gu'), (txt) => {
			return txt.toLowerCase();
		});
	}

	// Certain words such as initialisms or acronyms should be left uppercase
	const uppers = ['Id', 'Tv'];
	for (i = 0, j = uppers.length; i < j; i++) { str = str.replace(new RegExp(`\\b${uppers[i]}\\b`, 'gu'), uppers[i].toUpperCase()); }

	return str;
};

String.prototype.titleCase = function (lang = navigator.language.split('-')[0], withLowers = true): string {
	let string = '';
	let lowers: string[] = [];

	string = this.replace(/([^\s:\-'])([^\s:\-']*)/gu, (txt) => {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	}).replace(/Mc(.)/gu, (_match, next) => {
		return `Mc${next.toUpperCase()}`;
	});

	if (withLowers) {
		lowers = ['A', 'An', 'The', 'At', 'By', 'For', 'In', 'Of', 'On', 'To', 'Up', 'And', 'As', 'But', 'Or', 'Nor', 'Not'];
		if (lang == 'FR') {
			lowers = ['Un', 'Une', 'Le', 'La', 'Les', 'Du', 'De', 'Des', 'À', 'Au', 'Aux', 'Par', 'Pour', 'Dans', 'Sur', 'Et', 'Comme', 'Mais', 'Ou', 'Où', 'Ne', 'Ni', 'Pas'];
		} else if (lang == 'NL') {
			lowers = ['De', 'Het', 'Een', 'En', 'Van', 'Naar', 'Op', 'Door', 'Voor', 'In', 'Als', 'Maar', 'Waar', 'Niet', 'Bij', 'Aan'];
		}
		for (let i = 0; i < lowers.length; i++) {
			string = string.replace(new RegExp(`\\s${lowers[i]}\\s`, 'gu'), (txt) => {
				return txt.toLowerCase();
			});
		}
	}

	const uppers = ['Id', 'R&d'];
	for (let i = 0; i < uppers.length; i++) {
		string = string.replace(new RegExp(`\\b${uppers[i]}\\b`, 'gu'), uppers[i].toUpperCase());
	}

	return string;
};

String.prototype.toPascalCase = function (): string {
	const pascal = (this
		.match(/[a-z0-9]+/giu) as string[])
		.map((word: string) => word.charAt(0).toUpperCase() + word.substr(1).toLowerCase())
		.join('_');

	return pascal;
};

String.prototype.toUcFirst = function (): string {
	return this.charAt(0).toUpperCase() + this.substr(1).toLowerCase();
};

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
export const json = (data: any, headers: any = {}) => {
	return {
		type: 'json',
		data,
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
