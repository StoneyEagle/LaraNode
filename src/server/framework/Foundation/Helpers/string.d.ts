import { Pad } from './string';

declare global {
	interface String {
		capitalize: () => string;
		toTitleCase: () => string;
		// @ts-ignore
		toPascalCase: (string: string) => string;
		titlecase: (lang: string | 'NL' | 'FR', withLowers: boolean) => string;
	}

	var pad: Pad;
}

export { };