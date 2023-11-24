
/**
 * Pads a number or string with leading zeros until it reaches the specified length.
 * @param number - The number or string to pad.
 * @param places - The total length of the resulting string, including the original number or string.
 * @returns The padded string.
 */
export const pad = (number: string | number, places = 2): string => {
	if (typeof number !== 'undefined') {
		const zero = places - number.toString().length + 1;

		return Array(+(zero > 0 && zero)).join('0') + number;
	}
	return '';
};
export type Pad = typeof pad;
globalThis.pad = pad;

/**
 * Calculates the percentage match between two strings.
 * @param strA - The first string to compare.
 * @param strB - The second string to compare.
 * @returns The percentage match between the two strings.
 */
export const matchPercentage = (strA: string, strB: string): number => {
	let result = 0;
	// eslint-disable-next-line no-cond-assign
	for (let i = strA.length; (i -= 1);) {
		if (typeof strB[i] == 'undefined' || strA[i] == strB[i]) {
			//
		} else if (strA[i].toLowerCase() == strB[i].toLowerCase()) {
			result += 1;
		} else {
			result += 4;
		}
	}
	return (
		100
		- ((result + 4 * Math.abs(strA.length - strB.length))
			/ (2 * (strA.length + strB.length)))
		* 100
	);
};
export type MatchPercentage = typeof matchPercentage;
globalThis.matchPercentage = matchPercentage;

/**
 * * Sort Array of objects by the percentage matched,
 * @param {Array} array Array
 * @param {string} key Group key
 * @param {string} match Match to
 */
export const sortByMatchPercentage = <T>(
	array: T[],
	key: string | number,
	match: string
) => {
	return array.sort((a, b) => {
		const x = matchPercentage(match, a[key]);
		const y = matchPercentage(match, b[key]);
		return x > y
			? -1
			: x < y
				? 1
				: 0;
	});
};
export type SortByMatchPercentage = typeof sortByMatchPercentage;
globalThis.sortByMatchPercentage = sortByMatchPercentage;

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
