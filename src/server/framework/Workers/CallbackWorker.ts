import { parentPort, workerData } from 'worker_threads';
require('@framework/Foundation/Helpers');

const view = <T>(data: T, headers: Partial<Headers> = {}) => {
	return {
		type: 'view',
		data,
		headers
	};
};
globalThis.view = view;
const redirect = <T>(data: T, headers: Partial<Headers> = {}) => {
	return {
		type: 'redirect',
		data,
		headers
	};
};
globalThis.redirect = redirect;
const json = <T>(data: T, headers: Partial<Headers> = {}) => {
	return {
		type: 'json',
		data,
		headers
	};
};
globalThis.json = json;
const send = <T>(data: T, headers: Partial<Headers> = {}) => {
	return {
		type: 'send',
		data,
		headers
	};
};
globalThis.send = send;

const callback = workerData.callback;
if (callback) {

	const fn = new Function('return ' + callback);
	const result = fn()();

	parentPort?.postMessage(result);

} else {
	// @ts-expect-error - Electron gets in my way!
	const exec = new (require(workerData.controller));
	const result = exec[workerData.action]();

	parentPort?.postMessage(result);
	parentPort?.postMessage(result);
}
