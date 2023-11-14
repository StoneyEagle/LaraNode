
declare global {
	interface String {
		capitalize: () => string
		toTitleCase: () => string
		toPascalCase: () => string
		toUcFirst: () => string
		titleCase: (lang: string | 'NL' | 'FR', withLowers: boolean) => string
	}
}

export {}