
declare global {
	interface String {
		capitalize: () => string;
		toTitleCase: () => string;
		// @ts-ignore
		toPascalCase: (string: any) => string;
		titlecase: (lang: string | 'NL' | 'FR', withLowers: boolean) => string;
	}
}

export {};