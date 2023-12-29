import {NextFunction, Request, Response, Router} from "express";

import {
    validateAddTablesData,
    validateUpdateTableData,
    validateVendorLogin,
    validateVendorRegistration,
    validateVendorUpdate
} from "../middlewares/validateVendor";
import {
    vendorAddTableController, vendorDataController, vendorDeleteTableController,
    vendorLoginController,
    vendorRegistrationController, vendorUpdateController, vendorUpdateTableController
} from "../controllers/VendorControllers";
import {authenticateAccess} from "../middlewares/jwtValidation";
import {NOT_FOUND_EXCEPTION, USER_TYPE} from "../utils/app.constants";
import {ErrorWithCode} from "../utils/ErrorWithCode";

const router = Router();

router.post("/login", validateVendorLogin, vendorLoginController);
router.post("/register", validateVendorRegistration, vendorRegistrationController);

router.use((req: Request, res: Response, next: NextFunction) => authenticateAccess(req, res, next, USER_TYPE.VENDOR));
router.get("/data", vendorDataController);
router.put("/update", validateVendorUpdate, vendorUpdateController);
router.post("/addtables", validateAddTablesData, vendorAddTableController);
router.patch("/updatetable/:tableId", validateUpdateTableData, vendorUpdateTableController);
router.delete("/deletetable/:tableId", vendorDeleteTableController);

router.all("*", () => {
    throw new ErrorWithCode("URL not found", 404, NOT_FOUND_EXCEPTION, (new Error()).stack);
});
export default router;
