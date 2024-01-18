import cors from "cors";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import express, {NextFunction, Request, Response} from "express";

import {corsConfig, NOT_FOUND_EXCEPTION, RUNTIME_EXCEPTION, USER_TYPE} from "./utils/app.constants";
import vendorRoutes from "./routes/vendorRoutes";
import authorizerRouter from "./routes/authorizeRoutes";
import {errorLogger, logRequestResponse} from "./middlewares/logHandler";
import {authenticateAccess} from "./middlewares/jwtValidation";
import {ErrorWithCode} from "./utils/ErrorWithCode"
import {version} from "../package.json";

const app = express();

app.use(cors(corsConfig));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(logRequestResponse);


// SWAGGER OPENAPI - DOCUMENTATION
const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "AIQR REST API Docs",
            description: "AIQR makes Hotel Management Easy and Quick",
            version: version
        },
        contact: {
            name: "AIQR Team",
            url: "https://www.temp-aiqr.com",
            email: "info@aiqr.com"
        },
        tags: [
            {
                name: "Vendor Data(Restaurant Data)"
            }, {
                name: "Members Data(Authorizers)"
            }, {
                name: "Client Data(Customer Data)"
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        },
        security: [{bearerAuth: []}]
    },
    apis: ["./src/*.ts", "./src/routes/*.ts"]
};
const swaggerSpec = swaggerJsdoc(options);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/healthcheck", (req: Request, res: Response, next: NextFunction) => res.sendStatus(200));

app.use("/authorize", authorizerRouter);
app.use("/vendor", vendorRoutes);

// vendorRoutes.forEach(route => {
//     const routeHandlers = route.middleware ?
//         [...route.middleware, route.handler] :
//         [route.handler]
//
//     app[route.method](route.path, routeHandlers);
// })

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