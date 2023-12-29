import {Request, Response, NextFunction, Router} from "express";

import {
    validateAuthLogin,
    validateAuthRegister,
    validateAuthVendor
} from "../middlewares/validateAuthorizer";
import {
    authLoginController,
    authCreateVendor,
    authRegistrationController
} from "../controllers/authorizeControllers";
import {authenticateAccess} from "../middlewares/jwtValidation";
import {NOT_FOUND_EXCEPTION, USER_TYPE} from "../utils/app.constants";
import {ErrorWithCode} from "../utils/ErrorWithCode";

const router = Router();

router.post("/login", validateAuthLogin, authLoginController);
router.post("/register", validateAuthRegister, authRegistrationController);
router.use((req: Request, res: Response, next: NextFunction) => authenticateAccess(req, res, next, USER_TYPE.AUTHORIZER));
// CREATING VENDOR TO GENERATE PASSKEY
router.post("/createvendor", validateAuthVendor, authCreateVendor);

router.all("*", () => {
    throw new ErrorWithCode("URL not found", 404, NOT_FOUND_EXCEPTION, (new Error()).stack);
});
export default router;