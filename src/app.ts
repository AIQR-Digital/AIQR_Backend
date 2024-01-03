import express, {NextFunction, Request, Response} from "express";
import cors from "cors";

import {corsConfig, NOT_FOUND_EXCEPTION, RUNTIME_EXCEPTION, USER_TYPE} from "./utils/app.constants";
import vendorRoutes from "./routes/vendorRoutes";
import authorizerRouter from "./routes/authorizeRoutes";
import {errorLogger, logRequest, logResponse} from "./middlewares/logHandler";
import {authenticateAccess} from "./middlewares/jwtValidation";
import {ErrorWithCode} from "./utils/ErrorWithCode"
import swaggerDocs from "./utils/swagger";

const app = express();

app.use(cors(corsConfig));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(logRequest);
app.use(logResponse);

// SWAGGER OPENAPI - DOCUMENTATION
swaggerDocs(app, Number(process.env.PORT ?? 3000));
app.get("/healthcheck", (req: Request, res: Response, next: NextFunction) => res.sendStatus(200));

app.use("/authorize", authorizerRouter);
app.use("/vendor", vendorRoutes);

// USE VALIDATION FOR BEARER TOKEN FROM REQ.
app.use((req: Request, res: Response, next: NextFunction) => authenticateAccess(req, res, next, USER_TYPE.CONSUMER));
app.get('/', (req, res, next) => {
    res.status(200).send('Express + TypeScript Server!!');
});
app.all("*", (req: Request, res: Response, next: NextFunction) => {
    throw new ErrorWithCode("URL not found", 404, NOT_FOUND_EXCEPTION, (new Error()).stack);
});

app.use(errorLogger, (error: ErrorWithCode, req: Request, res: Response, next: NextFunction) => {
    res.status(error.code || 500).json({
        success: false,
        name: error.name || RUNTIME_EXCEPTION,
        message: error.message || "Something went wrong, Please try again later."
    });
});

export default app;