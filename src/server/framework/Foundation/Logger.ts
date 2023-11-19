import winston from 'winston';
import chalk from 'chalk';

class Logger {
    fileLogger: winston.transports.FileTransportInstance;
    consoleLogger: winston.transports.ConsoleTransportInstance;
    myCustomLevels = {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        verbose: 4,
        debug: 5,
        silly: 6,
        socket: 3,
        cyan: 2,
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
                return chalk.black(msg);
            case 'red':
                return chalk.red(msg);
            case 'green':
                return chalk.green(msg);
            case 'yellow':
                return chalk.yellow(msg);
            case 'blue':
                return chalk.blue(msg);
            case 'magenta':
                return chalk.magenta(msg);
            case 'cyan':
                return chalk.cyan(msg);
            case 'blackBright':
                return chalk.blackBright(msg);
            case 'redBright':
                return chalk.redBright(msg);
            case 'greenBright':
                return chalk.greenBright(msg);
            case 'yellowBright':
                return chalk.yellowBright(msg);
            case 'blueBright':
                return chalk.blueBright(msg);
            case 'magentaBright':
                return chalk.magentaBright(msg);
            case 'cyanBright':
                return chalk.cyanBright(msg);
            case 'whiteBright':
                return chalk.whiteBright(msg);
            default:
                return chalk.white(msg);
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