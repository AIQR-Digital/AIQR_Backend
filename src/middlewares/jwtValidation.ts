import {Request, Response, NextFunction} from "express";

import {ErrorWithCode} from "../utils/ErrorWithCode";
import {INVALID_AUTHORIZATION_EXCEPTION, TOKEN_SECRET} from "../utils/app.constants";
import jwt, {JwtPayload} from "jsonwebtoken";
import {JSON_TOKEN_TYPE} from "../types/types";

export const generateAccessToken = (data: JwtPayload) => {
    let secret = null;
    switch (data.generatedBy) {
        case 'AUTHORIZER':
            secret = TOKEN_SECRET.AUTHORIZER;
            break;
        case 'VENDOR':
            secret = TOKEN_SECRET.VENDOR;
            break;
        case 'CONSUMER':
            secret = TOKEN_SECRET.CONSUMER;
            break;
    }
    return jwt.sign(data, secret, {
        expiresIn: "2h"
    });
};

export const authenticateAccess = (req: Request, res: Response, next: NextFunction, user: JSON_TOKEN_TYPE) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    let secret = null;
    switch (user) {
        case 'AUTHORIZER':
            secret = TOKEN_SECRET.AUTHORIZER;
            break;
        case 'VENDOR':
            secret = TOKEN_SECRET.VENDOR;
            break;
        case 'CONSUMER':
            secret = TOKEN_SECRET.CONSUMER;
            break;
    }

    if (!token) {
        throw new ErrorWithCode("Unauthorized Access, Please Login/Register first", 401, INVALID_AUTHORIZATION_EXCEPTION);
    }

    jwt.verify(token, secret, (error, data) => {
        if (error) {
            throw new ErrorWithCode("Unauthorized Access, Please Login/Register first", 401, INVALID_AUTHORIZATION_EXCEPTION);
        }
        req.tokenData = data;
        next();
    });
};