
/**
 * * Group Array of objects by key.
 * * Sort by key (optional)
 * @param {Array} array Array
 * @param {string} key Group key
 * @param {string} key Sort key
 */
export const groupBy = <T>(array: T[], key: string) => {
	const list: {[key: string]: T[]} = {};

	array.map((element: any) => {
		list[element[key]] = array.filter((el: any) => el[key] == element[key]);
	});

	return list;
};
globalThis.groupBy = groupBy;
export type GroupBy = typeof groupBy;