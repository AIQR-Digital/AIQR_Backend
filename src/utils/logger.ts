import winston, {Logform, LoggerOptions} from "winston";
import path from "path";
import {LOG_BUFFER_SPACE} from "./app.constants";

const getLabel = function (callingModule: string) {
    const dirname = path.dirname(callingModule).split("\\").pop() || "Utils";
    const filename = path.basename(callingModule);
    const location = `${dirname}/${filename}`
    return `(${location})${new Array(LOG_BUFFER_SPACE - location.length).join(" ")}`;
};

export const timeZoned = () => {
    return new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Kolkata'
    });
};

const getWinstonOptions = (callingModule: string) => {
    const filePath = getLabel(callingModule);
    const winstonOptions: LoggerOptions = {
        level: "info",
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.label({
                label: `${filePath}`,
            }),
            winston.format.align(),
            winston.format.timestamp({format: timeZoned}),
            winston.format.printf(
                (info: Logform.TransformableInfo) => `${info.timestamp} ${info.level}: ${info.label}: ${info.message.trim()}`
            )
        ),
        defaultMeta: {service: 'user-service'},
        transports: [
            new winston.transports.Console(),
            new winston.transports.File({filename: 'logs/error.log', level: 'error'}),
            new winston.transports.File({filename: 'logs/app.log'}),
        ],
    };
    return winstonOptions;
};

const logger = (callingModule: string) => winston.createLogger(getWinstonOptions(callingModule));
const logAllArgs = (args: any[], logMethod: winston.LeveledLogMethod) => {
    args.forEach(arg => {
        logMethod(arg);
    })
};

// Override the default logging functions with a call to the loggers respective method
// const log = logger(__filename);
// console.log = (message, ...args) => log.info(message) && args && logAllArgs(args, log.info);
// console.info = (message, ...args) => log.info(message) && args && logAllArgs(args, log.info);
// console.warn = (message, ...args) => log.warn(message) && args && logAllArgs(args, log.warn);
// console.error = (message, ...args) => log.error(message) && args && logAllArgs(args, log.error);
// console.debug = (message, ...args) => log.debug(message) && args && logAllArgs(args, log.debug);

export default logger;
