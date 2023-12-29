import {jwt} from "./types";

export {};

declare global {
    namespace Express {
        import JwtPayload = jwt.JwtPayload;

        export interface Request {
            tokenData?: JwtPayload | undefined;
        }
    }
}