import fs from 'fs';
import { pad } from './string';

export const convertToHuman = function (time: string|number) {
	time = parseInt(time as string, 10);
	let days: unknown = parseInt(`${time / (3600 * 24)}`, 10);

	let hours: string = pad
		(parseInt(`${(time % 86400) / 3600}`, 10), 2);

	let minutes: unknown = parseInt(`${(time % 3600) / 60}`, 10);
	let seconds: unknown = parseInt(`${time % 60}`, 10);
	if (`${minutes}`.length === 1) {
		minutes = `0${minutes}`;
	}
	if (`${seconds}`.length === 1) {
		seconds = `0${seconds}`;
	}
	if (days === 0) {
		days = '00:';
	} else {
		days = `${days}:`;
	}
	if (hours === '0') {
		hours = '00:';
	} else {
		hours = `${hours}:`;
	}
	if (minutes === 0) {
		minutes = '00:';
	} else {
		minutes = `${minutes}:`;
	}
	const current = days + hours + minutes + seconds;
	return current.replace('NaN:NaN:NaN:NaN', '00:00');
};
export type ConvertToHuman = typeof convertToHuman;
globalThis.convertToHuman = convertToHuman;

/**
 * Returns time in seconds in human readable format
 * @param time
 */
export const humanTime = function (time: string|number) {
	time = parseInt(time as string, 10);
	let hours: string = pad(parseInt(`${(time % 86400) / 3600}`, 10), 2);

	let minutes: unknown = parseInt(`${(time % 3600) / 60}`, 10);
	let seconds: unknown = parseInt(`${time % 60}`, 10);
	if (`${minutes}`.length === 1) {
		minutes = `0${minutes}`;
	}
	if (`${seconds}`.length === 1) {
		seconds = `0${seconds}`;
	}
	if (hours == '0') {
		hours = '00:';
	} else {
		hours = `${hours}:`;
	}
	if (minutes === 0) {
		minutes = '00:';
	} else {
		minutes = `${minutes}:`;
	}

	if (hours == '00:') {
		hours = '';
	}

	const current = hours + minutes + seconds;
	return current.replace('NaN:NaN:NaN', '00:00');
};
export type HumanTime = typeof humanTime;
globalThis.humanTime = humanTime;

/**
 * @description: convert time to 00:00:00.000
 * @param {string} time
 * @return {string} current
 */

export const convertToHis = function (time: string|number) {
	time = parseInt(time as string, 10);
	let hours: string = pad(parseInt(`${(time % 86400) / 3600}`, 10), 2);

	let minutes: unknown = parseInt(`${(time % 3600) / 60}`, 10);
	let seconds: unknown = parseInt(`${time % 60}`, 10);
	if (`${minutes}`.length === 1) {
		minutes = `0${minutes}`;
	}
	if (`${seconds}`.length === 1) {
		seconds = `0${seconds}`;
	}
	if (hours == '0') {
		hours = '00:';
	} else {
		hours = `${hours}:`;
	}
	if (minutes === 0) {
		minutes = '00:';
	} else {
		minutes = `${minutes}:`;
	}
	const current = `${hours + minutes + seconds}.000`;
	return current.replace('NaN:NaN:NaN', '00:00');
};
export type ConvertToHis = typeof convertToHis;
globalThis.convertToHis = convertToHis;

export const convertToSeconds = (hms: string | null) => {
	if (!hms) {
		return 0;
	}
	const a: number[] = hms.split(':').map(n => parseInt(n, 10));
	if (a.length < 3) {
		a.unshift(0);
	}

	return +a[0] * 60 * 60 + +a[1] * 60 + +a[2];
};
export type ConvertToSeconds = typeof convertToSeconds;
globalThis.convertToSeconds = convertToSeconds;

/**
 * Returns the year of a date
 * @param {string} date - the date
 * @returns {number | undefined} - the year of the date
 */
export const parseYear = function (date: string | number | undefined | null) {
	if (!date) {
		return null;
	}
	return new Date(date).getFullYear();
};
export type ParseYear = typeof parseYear;
globalThis.parseYear = parseYear;

/**
 * Sleeps for the specified number of milliseconds
 * @param ms the number of milliseconds to sleep for
 */
export const sleep = function (ms: number) {
	const start = new Date().getTime();
	const expire = start + ms;
	while (new Date().getTime() < expire) {
		//
	}
};
export type Sleep = typeof sleep;
globalThis.sleep = sleep;

/**
 * Get the modified time of a file.
 * @param {string} file - The file to get the modified time of.
 * @return {date} The modified time of the file.
 */
export const fileChangedAt = function (file: string) {
	const fileTime = fs.statSync(file).mtime;
	return fileTime;
};
export type FileChangedAt = typeof fileChangedAt;
globalThis.fileChangedAt = fileChangedAt;

/**
 * * Return file change time in hours ago.
 * @param {fs.PathLike} file Full path to file.
 * @param {string} notation Days, Hours (default), Minutes, Seconds.
 * @param {string} method Floor (default), Ceil, Round.
 */
export const fileChangedAgo = function (file: string|fs.PathLike, notation = 'hours', method = 'floor') {
	let time;
	switch (notation) {
		case 'days':
			time = 24 * 60 * 60 * 1000;
			break;
		case 'hours':
			time = 60 * 60 * 1000;
			break;
		case 'minutes':
			time = 60 * 1000;
			break;
		case 'seconds':
			time = 1000;
			break;
		default:
			time = 1;
			break;
	}

	const fileTime: Date = fs.statSync(file).mtime;
	const now: Date = new Date();

	const result = Math.abs((now.getTime() - fileTime.getTime()) / time);

	if (method == 'ceil') {
		return Math.ceil(result);
	}
	if (method == 'round') {
		return Math.round(result);
	}
	if (method == 'floor') {
		return Math.floor(result);
	}

	return result;
};
export type FileChangedAgo = typeof fileChangedAgo;
globalThis.fileChangedAgo = fileChangedAgo;

/**
 * * Return time in hours ago.
 * @param {Date} date Full path to file.
 * @param {String} notation Days, Hours (default), Minutes, Seconds.
 * @param {String} method Floor (default), Ceil, Round.
 */
export const dateAgo = function (date: Date, notation = 'hours', method = 'floor') {
	let time: number;
	switch (notation) {
		case 'days':
			time = 24 * 60 * 60 * 1000;
			break;
		case 'hours':
			time = 60 * 60 * 1000;
			break;
		case 'minutes':
			time = 60 * 1000;
			break;
		case 'seconds':
			time = 1000;
			break;
		default:
			time = 1;
			break;
	}

	const now: number = new Date().getTime();
	const result = Math.abs((now - date.getTime()) / time);

	if (method == 'ceil') {
		return Math.ceil(result);
	}
	if (method == 'round') {
		return Math.round(result);
	}
	if (method == 'floor') {
		return Math.floor(result);
	}

	return result;
};
export type DateAgo = typeof dateAgo;
globalThis.dateAgo = dateAgo;

/**
 * * Return Array of times starting at 00:00:00.000
 * * createTimeInterval(310,10) Ends at: 00:05:10.000
 * @param {Number} duration Number in seconds
 * @param {Number} interval time between new time
 */
export const createTimeInterval = function (duration: number, interval: number) {
	const d = new Date();
	d.setHours(0, 0, 0, 0);

	const date = d.getDate();
	const timeArr: string[] = [];
	while (date == d.getDate()) {
		const hours = pad(d.getHours(), 2);
		const minute = pad(d.getMinutes(), 2);
		const second = pad(d.getSeconds(), 2);
		const miliSecond = pad(d.getMilliseconds(), 3);

		timeArr.push(`${hours}:${minute}:${second}.${miliSecond}`);

		d.setSeconds(d.getSeconds() + interval);
	}

	return timeArr.splice(0, duration / interval);
};
export type CreateTimeInterval = typeof createTimeInterval;
globalThis.createTimeInterval = createTimeInterval;

/**
 * @param {string} time
 * @return {string}
 */
export const time_ago = (time: any) => {
	time = Date.now() - (Date.now() - time);

	switch (typeof time) {
		case 'number':
			break;
		case 'string':
			time = +new Date(time);
			break;
		case 'object':
			if (time.constructor === Date) {
				time = time.getTime();
			}
			break;
		default:
			time = +new Date();
	}
	const time_formats = [
		[60, 'seconds', 1], // 60
		[120, '1 minute ago', '1 minute from now'], // 60*2
		[3600, 'minutes', 60], // 60*60, 60
		[7200, '1 hour ago', '1 hour from now'], // 60*60*2
		[86400, 'hours', 3600], // 60*60*24, 60*60
		[172800, 'Yesterday', 'Tomorrow'], // 60*60*24*2
		[604800, 'days', 86400], // 60*60*24*7, 60*60*24
		[1209600, 'Last week', 'Next week'], // 60*60*24*7*4*2
		[2419200, 'weeks', 604800], // 60*60*24*7*4, 60*60*24*7
		[4838400, 'Last month', 'Next month'], // 60*60*24*7*4*2
		[29030400, 'months', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
		[58060800, 'Last year', 'Next year'], // 60*60*24*7*4*12*2
		[2903040000, 'years', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
		[5806080000, 'Last century', 'Next century'], // 60*60*24*7*4*12*100*2
		[58060800000, 'centuries', 2903040000], // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
	];
	let seconds = (+new Date() - time) / 1000;
	let token = 'ago';
	let list_choice = 1;

	if (seconds == 0) {
		return 'Just now';
	}
	if (seconds < 0) {
		seconds = Math.abs(seconds);
		token = 'from now';
		list_choice = 2;
	}
	let i = 0;
	let format;
	while ((format = time_formats[(i += 1)])) {
		if (seconds < format[0]) {
			if (typeof format[2] === 'string') {
				return format[list_choice];
			}
			return `${Math.floor(seconds / format[2])} ${format[1]} ${token}`;
		}
	}
	return time;
};
export type TimeAgo = typeof time_ago;
globalThis.time_ago = time_ago;

export const dateFormat = (date: Date | number, format: string) => {
	// @ts-expect-error
	return (new Date(date)).format(format);
};
export type DateFormat = typeof dateFormat;
globalThis.dateFormat = dateFormat;

// @ts-expect-error
Date.prototype.getMonthName = function () {
	const month_names = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	];

	return month_names[this.getMonth()];
};

// Provide month abbreviation
// @ts-expect-error
Date.prototype.getMonthAbbr = function () {
	const month_abbrs = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	return month_abbrs[this.getMonth()];
};

// Provide full day of week name
// @ts-expect-error
Date.prototype.getDayFull = function () {
	const days_full = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	return days_full[this.getDay()];
};

// Provide full day of week name
// @ts-expect-error
Date.prototype.getDayAbbr = function () {
	const days_abbr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
	return days_abbr[this.getDay()];
};

// Provide the day of year 1-365
// @ts-expect-error
Date.prototype.getDayOfYear = function () {
	const onejan = new Date(this.getFullYear(), 0, 1);
	// @ts-expect-error
	return Math.ceil((this - onejan) / 86400000);
};

// Provide the day suffix (st,nd,rd,th)
// @ts-expect-error
Date.prototype.getDaySuffix = function () {
	const d = this.getDate();
	const sfx = ['th', 'st', 'nd', 'rd'];
	const val = d % 100;

	return sfx[(val - 20) % 10] || sfx[val] || sfx[0];
};

// Provide Week of Year
// @ts-expect-error
Date.prototype.getWeekOfYear = function () {
	const onejan = new Date(this.getFullYear(), 0, 1);
	// @ts-expect-error
	return Math.ceil(((this - onejan) / 86400000 + onejan.getDay() + 1) / 7);
};

// Provide if it is a leap year or not
// @ts-expect-error
Date.prototype.isLeapYear = function () {
	const yr = this.getFullYear().toString();

	if (parseInt(yr, 10) % 4 == 0) {
		if (parseInt(yr, 10) % 100 == 0) {
			if (parseInt(yr, 10) % 400 != 0) {
				return false;
			}
			if (parseInt(yr, 10) % 400 == 0) {
				return true;
			}
		}
		if (parseInt(yr, 10) % 100 != 0) {
			return true;
		}
	}
	if (parseInt(yr, 10) % 4 != 0) {
		return false;
	}
};

// Provide Number of Days in a given month
// @ts-expect-error
Date.prototype.getMonthDayCount = function () {
	const month_day_counts = [
		// @ts-expect-error
		31, this.isLeapYear()
			? 29
			: 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31,
	];

	return month_day_counts[this.getMonth()];
};

// format provided date into this.format format
// @ts-expect-error
Date.prototype.format = function (dateFormat: any) {
	const joins = dateFormat.match(/[-/:\s]/gu);
	dateFormat = dateFormat.split(/[-/:\s]/u);

	const pad = (number: string | number, places = 2): string => {
		if (typeof number !== 'undefined') {
			const zero = places - number.toString().length + 1;

			return Array(+(zero > 0 && zero)).join('0') + number;
		}
		return '';
	};

	const date = this.getDate();
	const month = this.getMonth();
	const hours = this.getHours();
	const minutes = this.getMinutes();
	const seconds = this.getSeconds();
	const date_props = {

		Y: this.getFullYear().toString()
			.substring(2, 4),
		YY: this.getFullYear(),

		M: month + 1,
		MM: month < 10
			? `0${month + 1}`
			: month + 1,
		// @ts-expect-error
		MMM: this.getMonthAbbr(),
		// @ts-expect-error
		MMMM: this.getMonthName(),

		D: date < 10
			? `0${date}`
			: date,
		// @ts-expect-error
		DD: this.getDayAbbr(),
		// @ts-expect-error
		DDD: this.getDayFull(),
		// @ts-expect-error
		DDDD: this.getDaySuffix(),

		// @ts-expect-error
		DY: this.getDayOfYear(),
		// @ts-expect-error
		WY: this.getWeekOfYear(),
		// @ts-expect-error
		MD: this.getMonthDayCount(),
		// @ts-expect-error
		L: this.isLeapYear()
			? '1'
			: '0',

		a: hours > 12
			? 'pm'
			: 'am',
		aa: hours > 12
			? 'PM'
			: 'AM',

		h: hours % 12 > 0
			? pad(hours % 12, 2)
			: 12,
		hh: pad(hours, 2),

		m: pad(minutes, 2),
		s: pad(seconds, 2),
	};

	let date_string = '';
	for (let i = 0; i < dateFormat.length; i++) {
		const f = dateFormat[i];
		if (f.match(/[a-zA-Z]/gu)) {
			date_string += date_props[f]
				? (i == dateFormat.length - 1)
					? date_props[f]
					: date_props[f] + joins[i]
				: '';
		} else {
			date_string += f;
		}
	}

	return date_string;
};