import {Express, Request, Response, NextFunction} from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import {version} from "../../package.json";
import logger from "./logger";
import {DATABASE_EXCEPTION, SERVER_EXCEPTION, USER_EXCEPTION} from "./app.constants";

const log = logger(__filename);

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
        servers: [
            {
                url: "http://localhost:3000",
                description: "Local Development Server"
            },
        ],
        tags: [
            {
                name: "Health Check",
            }, {
                name: "Authorizer"
            }, {
                name: "Vendor"
            }
        ],
        paths: {
            '/healthcheck': {
                get: {
                    tags: ['Health Check'],
                    description: 'Check if server is up and running',
                    responses: {
                        '200': {
                            description: "Server is up and running",
                        },
                        '500': {
                            description: "Failed to start server"
                        }
                    }
                }
            },
            '/authorize/register': {
                post: {
                    tags: ['Authorizer'],
                    description: 'Register Authorizer',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: Object,
                                    properties: {
                                        name: {
                                            type: 'string',
                                            example: "abcd",
                                        },
                                        contact: {
                                            type: 'string',
                                            length: 10,
                                            example: 'xxxxxxxxxx',
                                        },
                                        password: {
                                            type: 'string',
                                            min: 8,
                                            format: 'password',
                                            example: 'xxxxxxxx',
                                        }
                                    },
                                    required: ['name', 'contact', 'password']
                                }
                            }
                        }
                    },
                    responses: {
                        '201': {
                            description: "User Registration Successful",
                            content: {
                                'application/json': {
                                    example: {
                                        value: {
                                            message: "SUCCESSFULLY CREATED AUTHORIZER",
                                            data: {
                                                success: true,
                                                message: "SUCCESSFULLY CREATED AUTHORIZER",
                                                token: "zxgsdagyhasfghsniasmichawdf"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        '401': {
                            description: "Invalid Authorizer Registration",
                            content: {
                                'application/json': {
                                    example: {
                                        value: {
                                            message: "Unauthorized Contact Number",
                                            data: {
                                                success: false,
                                                name: "INVALID_AUTHORIZATION_EXCEPTION",
                                                message: "Unauthorized Contact Number"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        '403': {
                            description: "Existing User",
                            content: {
                                'application/json': {
                                    example: {
                                        value: {
                                            message: "Already Registered, Please login",
                                            data: {
                                                success: false,
                                                name: "USER_EXCEPTION",
                                                message: "Already Registered, Please login"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        '422': {
                            description: "Invalid Field/Payload provided",
                            content: {
                                'application/json': {
                                    example: {
                                        value: {
                                            message: "Invalid/Missing value provided",
                                            data: {
                                                success: false,
                                                name: "FIELD_VALIDATION_EXCEPTION",
                                                message: "Invalid/Missing value provided"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        '500': {
                            description: "Something went wrong",
                            content: {
                                'application/json': {
                                    examples: {
                                        DatabaseError: {
                                            value: {
                                                data: {
                                                    success: false,
                                                    name: "DATABASE_EXCEPTION",
                                                    message: "Something went wrong"
                                                }
                                            }
                                        },
                                        ServerError: {
                                            value: {
                                                data: {
                                                    success: false,
                                                    name: "SERVER_EXCEPTION",
                                                    message: "Something went wrong, please try again."
                                                }
                                            }
                                        },
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        components: {
            securitySchemas: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: ["./src/app.ts", "./src/routes/*.ts"]
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app: Express, port: number) => {
//     Swagger Page
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//     Docs in JSON format
    app.get("docs.json", (req: Request, res: Response, next: NextFunction) => {
        res.setHeader('Content-Type', "application/json");
        res.send(swaggerSpec);
    });

    log.info(`Docs available at http://localhost:${port}/docs`);
};

export default swaggerDocs;