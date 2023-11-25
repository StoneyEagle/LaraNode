import { AxiosRequestConfig, AxiosResponse } from "axios";
import Queue from "queue-promise";
import promiseRetry from "promise-retry";

import Connector from "@framework/Http/Connector";
import Logger from "@framework/Foundation/Logger";

/**
 * A client for making requests to The Movie Database (Fanart).
 */
class FanartClient extends Connector {
    id: number = 0;

    /**
     * Object containing rate limit configuration for FanartClient requests.
     * @property {number} concurrent - The maximum number of concurrent requests allowed.
     * @property {number} interval - The interval in milliseconds between each request.
     * @property {boolean} start - Whether to start the rate limiting immediately.
     */
    protected static rateLimit = {
        concurrent: 3,
        interval: 1000,
        start: true,
    };

    /**
     * Creates a new instance of the FanartClient class.
     * @constructor
     */
    constructor() {
        super();

        this.setHeaders({
            'Accept': 'application/json',
        });

        this.setBaseUrl('http://webservice.fanart.tv/v3');

        this.setParams({
            api_key: config('apiKeys.FANART_API_KEY'),
            client_key: config('apiKeys.FANART_CLIENT_KEY'),
        });
    }

    /**
     * Returns the queue used for rate limiting requests to the FANART API.
     * If the queue does not exist, it will be created with the rate limit specified in FanartClient.rateLimit.
     * @returns The queue used for rate limiting requests to the FANART API.
     */
    protected static getQueue() {
        if (!FanartClient.queue) {
            FanartClient.queue = new Queue(FanartClient.rateLimit);
        }
        return FanartClient.queue;
    }

    /**
     * Enqueues a function that returns a Promise to be executed in a queue.
     * @param func The function to be executed in the queue.
     * @returns A Promise that resolves with the result of the function.
     */
    public static enqueue<T>(func: () => Promise<T>): Promise<T> {
        const queue = FanartClient.getQueue();
        const key = `${FanartClient.name}_${Math.random().toString(36).substring(3)}`;

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
            name: 'fanart',
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
            name: 'fanart',
            color: 'blue',
            message: message,
        });
    }

    /**
     * Logs a debug message to the console using the `fanart` logger with blue color.
     * @param message - The message to log.
     */
    protected static debug(message: string) {
        Logger.log({
            level: 'debug',
            name: 'fanart',
            color: 'blue',
            message: message,
        });
    }

    /**
     * Logs an error message using the fanart logger.
     * @param message - The error message to log.
     */
    protected static error(message: string) {
        Logger.log({
            level: 'error',
            name: 'fanart',
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
        const res = await FanartClient.enqueue(() => this.axios.get<T>(url, params));
        return res;
    }

}

export default FanartClient;
