import {NextFunction, Request, Response} from "express";

import {ErrorWithCode} from "../utils/ErrorWithCode";
import logger from "../utils/logger";

const log = logger(__filename);

export const logRequest = (req: Request, res: Response, next: NextFunction) => {
    log.log("info", `Request Received ${req.route?.path || req.originalUrl}`);
    next();
};

export const logResponse = (req: Request, res: Response, next: NextFunction) => {
    const startTime = process.hrtime();
    res.on("finish", () => {
        const totalTime = process.hrtime(startTime);
        const totalTimeInMs = totalTime[0] * 1000 + totalTime[1] / 1e6;
        log.log("info", `Response ${res.statusCode} Sent to ${req.originalUrl} in ${totalTimeInMs}ms`);
    });
    next();
};

export const errorLogger = (error: ErrorWithCode, req: Request, res: Response, next: NextFunction) => {
    log.log("info", `${error.message} : ${error.name} : ${error.code}`);
    error.stack && log.error(error.stack);
    next(error);
};