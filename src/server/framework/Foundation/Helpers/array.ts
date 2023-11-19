
/**
 * * Group Array of objects by key.
 * * Sort by key (optional)
 * @param {Array} array Array
 * @param {string} key Group key
 * @param {string} key Sort key
 */
export const groupBy = <T>(array: T[], key: string) => {
	const list: { [key: string]: T[]; } = {};

	array.map((element: T) => {
		list[element[key]] = array.filter((el: T) => el[key] == element[key]);
	});

	return list;
};
globalThis.groupBy = groupBy;
export type GroupBy = typeof groupBy;

export default {};

/**
 * * Return only unique objects by key,
 * @param {Array} array Array
 * @param {string} key Unique key
 */
export const unique = <T>(array: T[], key: string): T[] => {
	if (!array || !Array.isArray(array)) {
		return [];
	}

	return array.filter(
		(obj: T, pos, arr) =>
			arr.map((mapObj: T) => mapObj[key]).indexOf(obj[key]) === pos
	);
};
globalThis.unique = unique;
export type Unique = typeof unique;