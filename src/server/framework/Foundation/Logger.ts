import winston from 'winston';
import colors from "cli-color";
import { logLevelEnums } from '@/app/Helper/paths';

class Logger {
    fileLogger: winston.transports.FileTransportInstance;
    consoleLogger: winston.transports.ConsoleTransportInstance;

    myCustomLevels: { [key: string]: logLevelEnums; } = {
        error: logLevelEnums.error,
        warn: logLevelEnums.warn,
        info: logLevelEnums.info,
        http: logLevelEnums.http,
        verbose: logLevelEnums.verbose,
        debug: logLevelEnums.debug,
        silly: logLevelEnums.silly,
        socket: logLevelEnums.socket,
    };

    constructor() {

        winston.addColors({
            socket: 'magenta',
            cyan: 'cyan',
        });

        this.fileLogger = new winston.transports.File({
            // filename: winstonLog,
            filename: 'logs/app.log',
            maxsize: 1024 * 1024 * 1024,
            tailable: true,
            maxFiles: 20,
            format: winston.format.combine(
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                winston.format.prettyPrint(),
                winston.format.json()
            ),
            // silent: true,
            // handleExceptions: true,
            // handleRejections: true,
        });

        this.consoleLogger = new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                winston.format.splat(),
                winston.format.json(),

                winston.format.printf(
                    info =>
                        `${this.spacer(`${this.spacer(this.color(info.color, info.name), 20)} ${this.dateFormat(Date.now(), 'Y-M-D hh:m')}: ${info.user
                            ? (`${info.user} `)
                            : ''}${info.message}`, 20)}`
                )
            ),
        });

    }

    static make() {
        const instance = new Logger();

        return winston.createLogger({
            level: process.env.LOG_LEVEL || 'http',
            levels: instance.myCustomLevels,
            transports: [
                instance.fileLogger,
                instance.consoleLogger,
            ],
            exitOnError: false,
        });
    }

    dateFormat(date: Date | number, format: string) {
        // @ts-expect-error
        return (new Date(date)).format?.(format);
    };

    color(color: string, msg: string) {
        switch (color) {
            case 'black':
                return colors.black(msg);
            case 'red':
                return colors.red(msg);
            case 'green':
                return colors.green(msg);
            case 'yellow':
                return colors.yellow(msg);
            case 'blue':
                return colors.blue(msg);
            case 'magenta':
                return colors.magenta(msg);
            case 'cyan':
                return colors.cyan(msg);
            case 'blackBright':
                return colors.blackBright(msg);
            case 'redBright':
                return colors.redBright(msg);
            case 'greenBright':
                return colors.greenBright(msg);
            case 'yellowBright':
                return colors.yellowBright(msg);
            case 'blueBright':
                return colors.blueBright(msg);
            case 'magentaBright':
                return colors.magentaBright(msg);
            case 'cyanBright':
                return colors.cyanBright(msg);
            case 'whiteBright':
                return colors.whiteBright(msg);
            default:
                return colors.white(msg);
        }
    };

    spacer(text: string, rightPadding: number) {
        const spacing: string[] = [];
        spacing.push(text);
        for (let i = 0; i < rightPadding - text.length; i++) {
            spacing.push('');
        }
        return spacing.join(' ');
    };
}

export default Logger.make();