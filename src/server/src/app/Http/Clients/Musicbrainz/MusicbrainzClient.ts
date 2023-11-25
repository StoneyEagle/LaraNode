import { AxiosRequestConfig, AxiosResponse } from "axios";
import Queue from "queue-promise";
import promiseRetry from "promise-retry";

import Connector from "@framework/Http/Connector";
import Logger from "@framework/Foundation/Logger";

/**
 * A client for making requests to the Musicbrainz API.
 */
class MusicbrainzClient extends Connector {
    /**
     * Object containing rate limit configuration for MusicbrainzClient requests.
     * @property {number} concurrent - The maximum number of concurrent requests allowed.
     * @property {number} interval - The interval in milliseconds between each request.
     * @property {boolean} start - Whether to start the rate limiting immediately.
     */
    protected static rateLimit = {
        concurrent: 5,
        interval: 2000,
        start: true,
    };

    constructor() {
        super();

        this.setHeaders({
            'Accept': 'application/json',
        });

        this.setBaseUrl('https://musicbrainz.org/ws/2');

        this.setParams({
            fmt: 'json',
        });

    }

    /**
     * Returns the queue used for rate limiting requests to the TMDB API.
     * If the queue does not exist, it will be created with the rate limit specified in MusicbrainzClient.rateLimit.
     * @returns The queue used for rate limiting requests to the TMDB API.
     */
    protected static getQueue() {
        if (!MusicbrainzClient.queue) {
            MusicbrainzClient.queue = new Queue(MusicbrainzClient.rateLimit);
        }
        return MusicbrainzClient.queue;
    }

    /**
     * Enqueues a function that returns a Promise to be executed in a queue.
     * @param func The function to be executed in the queue.
     * @returns A Promise that resolves with the result of the function.
     */
    public static enqueue<T>(func: () => Promise<T>): Promise<T> {
        const queue = MusicbrainzClient.getQueue();
        const key = `${MusicbrainzClient.name}_${Math.random().toString(36).substring(3)}`;

        return promiseRetry<T>((retry, number) => {
            queue.enqueue(async () => {
                return {
                    key: key,
                    data: await func(),
                };
            });

            return new Promise((resolve, reject) => {
                queue.on("resolve", result => {
                    if (result.key && key === result.key) {
                        return resolve(result.data);
                    }
                });
                queue.on("reject", result => {
                    if (result.key && key === result.key) {
                        return retry(result.data);
                    }
                });
            });
        })
            .then((value) => {
                return value;
            }, (err) => {
                this.error(err);
                // TODO: store error in database ${number}
                return Promise.reject(err);
            });
    }

    /**
     * Returns the maximum number of items that can be retrieved based on the available items, the desired number of items, and a constraint.
     * @param available The total number of items available.
     * @param wanted The desired number of items.
     * @param constraint The maximum number of items that can be retrieved.
     * @returns The maximum number of items that can be retrieved.
     */
    public static max(available: number, wanted: number, constraint: number): number {
        return wanted < available
            ? wanted > constraint
                ? constraint
                : wanted
            : available;
    }

    /**
     * Logs an info message with the specified message.
     * @param message - The message to log.
     */
    protected static info(message: string) {
        Logger.log({
            level: 'info',
            name: 'moviedb',
            color: 'blue',
            message: message,
        });
    }

    /**
     * Logs a verbose message to the console.
     * @param message - The message to log.
     */
    protected static verbose(message: string) {
        Logger.log({
            level: 'verbose',
            name: 'moviedb',
            color: 'blue',
            message: message,
        });
    }

    /**
     * Logs a debug message to the console using the `moviedb` logger with blue color.
     * @param message - The message to log.
     */
    protected static debug(message: string) {
        Logger.log({
            level: 'debug',
            name: 'moviedb',
            color: 'blue',
            message: message,
        });
    }

    /**
     * Logs an error message using the moviedb logger.
     * @param message - The error message to log.
     */
    protected static error(message: string) {
        Logger.log({
            level: 'error',
            name: 'moviedb',
            color: 'red',
            message: message,
        });
    }

    /**
     * Sends a GET request to the specified URL with optional parameters.
     * @param url - The URL to send the request to.
     * @param params - Optional parameters to include in the request.
     * @returns A Promise that resolves with the AxiosResponse object containing the response data.
     */
    protected async get<T>(url: string, params?: AxiosRequestConfig<any> | undefined): Promise<AxiosResponse<T, any>> {
        const res = await MusicbrainzClient.enqueue(() => this.axios.get<T>(url, params));
        return res;
    }

    /**
     * Sends a POST request to the specified URL with optional parameters.
     * @param url - The URL to send the request to.
     * @param params - Optional parameters to include in the request.
     * @returns A Promise that resolves with the AxiosResponse object containing the response data.
     */
    protected async post<T>(url: string, params?: AxiosRequestConfig<any> | undefined): Promise<AxiosResponse<T, any>> {
        const res = await MusicbrainzClient.enqueue(() => this.axios.post<T>(url, params));
        return res;
    }

}

export default MusicbrainzClient;
