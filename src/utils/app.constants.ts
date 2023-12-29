import {CorsOptions} from "cors";
import {USER_TOKEN_TYPE} from "../types/types";

export const USER_TYPE: USER_TOKEN_TYPE = {
    AUTHORIZER: "AUTHORIZER",
    VENDOR: "VENDOR",
    CONSUMER: "CONSUMER"
};

export const TOKEN_SECRET = {
    "AUTHORIZER": process.env.AUTHORIZER_WEB_TOKEN!,
    "VENDOR": process.env.VENDOR_WEB_TOKEN!,
    "CONSUMER": process.env.CONSUMER_WEB_TOKEN!
};

export const LOG_BUFFER_SPACE = 50;
export const LOG_INFO_SPACE = 15;
export const corsConfig: CorsOptions = {
    origin: "http://127.0.0.1:3001",
    optionsSuccessStatus: 200
};

// EXCEPTION TYPES
export const FIELD_VALIDATION_EXCEPTION = "FIELD_VALIDATION_EXCEPTION";
export const INVALID_AUTHORIZATION_EXCEPTION = "INVALID_AUTHORIZATION_EXCEPTION";
export const USER_EXCEPTION = "USER_EXCEPTION";
export const DATABASE_EXCEPTION = "DATABASE_EXCEPTION";
export const RUNTIME_EXCEPTION = "RUNTIME_EXCEPTION";
export const SERVER_EXCEPTION = "SERVER_EXCEPTION";
export const NOT_FOUND_EXCEPTION = "NOT_FOUND_EXCEPTION";