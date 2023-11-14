import { parentPort, workerData } from 'worker_threads';
require('@framework/Foundation/Helpers');

const view = (data, headers = {}) => {
	return {
		type: 'view',
		data,
		headers
	};
}
globalThis.view = view;
const redirect = (data, headers = {}) => {
	return {
		type: 'redirect',
		data,
		headers
	};
}
globalThis.redirect = redirect;
const json = (data, headers = {}) => {
	return {
		type: 'json',
		data,
		headers
	};
}
globalThis.json = json;
const send = (data, headers = {}) => {
	return {
		type: 'send',
		data,
		headers
	};
}
globalThis.send = send;

const callback = workerData.callback;
if(callback) {

	const fn = new Function('return ' + callback);
	const result = fn()();

	parentPort?.postMessage(result);

} else {   
	const exec = new (require(workerData.controller));
	const result = exec[workerData.action]();

	parentPort?.postMessage(result);
    parentPort?.postMessage(result);
}
