import {NextFunction, Request, Response, Router} from "express";

import {
    validateAddTablesData,
    validateMenuCategoryName,
    validateMenuItem,
    validateUpdateTableData,
    validateVendorLogin,
    validateVendorRegistration,
    validateVendorUpdate
} from "../middlewares/validateVendor";
import {
    vendorAddMenuItemController,
    vendorAddTableController,
    vendorDataController,
    vendorDeleteMenuCategoryController, vendorDeleteMenuItemController,
    vendorDeleteTableController,
    vendorGetAllMenuCategoryController, vendorGetAllMenuItemController,
    vendorGetAllTableController,
    vendorLoginController,
    vendorMenuAddCategoryController,
    vendorMenuCategoryUpdateController,
    vendorRegistrationController,
    vendorUpdateController, vendorUpdateMenuItemController,
    vendorUpdateTableController
} from "../controllers/VendorControllers";
import {authenticateAccess} from "../middlewares/jwtValidation";
import {NOT_FOUND_EXCEPTION, USER_TYPE} from "../utils/app.constants";
import {ErrorWithCode} from "../utils/ErrorWithCode";
import {Route} from "../types/types";

const router = Router();

/**
 * @swagger
 * /vendor/login:
 *  post:
 *      summary: Login Vendor
 *      tags:
 *          - Vendor Data(Restaurant Data)
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required:
 *                          - contact
 *                          - password
 *                      properties:
 *                          contact:
 *                              type: integer
 *                              example: XXXXXXXXXX
 *                          password:
 *                              type: string
 *                              example: XXXXXXXX
 *      responses:
 *          200:
 *              description: Successful Response
 *              content:
 *                  application/json:
 *                      example:
 *                          data:
 *                              success: boolean
 *                              token: <BEARER TOKEN>
 *                              message: string
 *
 */
router.post("/login", validateVendorLogin, vendorLoginController);


/**
 * @swagger
 * /vendor/register:
 *  post:
 *      summary: Register Vendor
 *      tags:
 *          - Vendor Data(Restaurant Data)
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required:
 *                          - restaurantName
 *                          - vendorContact
 *                          - password
 *                          - passkey
 *                      properties:
 *                          restaurantName:
 *                              type: string
 *                          vendorContact:
 *                              type: integer
 *                              example: XXXXXXXXXX
 *                          password:
 *                              type: string
 *                              example: XXXXXXXX
 *                          passkey:
 *                              type: string
 *                              example: XXXXXX
 *      responses:
 *          200:
 *              description: Successful Response
 *              content:
 *                  application/json:
 *                      example:
 *                          data:
 *                              success: boolean
 *                              token: <BEARER TOKEN>
 *                              message: string
 *
 */
router.post("/register", validateVendorRegistration, vendorRegistrationController);

router.use((req: Request, res: Response, next: NextFunction) => authenticateAccess(req, res, next, USER_TYPE.VENDOR));

/**
 * @swagger
 * /vendor/getvendordata:
 *  get:
 *      summary: Gets the Vendor Data
 *      tags:
 *          - Vendor Data(Restaurant Data)
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: Successful Response
 *              content:
 *                  application/json:
 *                      example:
 *                          data: {}
 */
router.get("/getvendordata", vendorDataController);
router.put("/update", validateVendorUpdate, vendorUpdateController);

router.get("/getalltables", vendorGetAllTableController);
router.post("/addtables", validateAddTablesData, vendorAddTableController);
router.patch("/updatetable/:tableId", validateUpdateTableData, vendorUpdateTableController);
router.delete("/deletetable/:tableId", vendorDeleteTableController);

router.get("/getallcategories", vendorGetAllMenuCategoryController);
router.post("/addcategory", validateMenuCategoryName, vendorMenuAddCategoryController);
router.put("/updatecategory/:categoryId", validateMenuCategoryName, vendorMenuCategoryUpdateController);
router.delete("/deletecategory/:categoryId", vendorDeleteMenuCategoryController);

router.get("/getallmenuitems", vendorGetAllMenuItemController);
router.post("/addmenuitem/:categoryId", validateMenuItem, vendorAddMenuItemController);
router.put("/updatemenuitem/:menuItemId", validateMenuItem, vendorUpdateMenuItemController);
router.delete("/deletemenuitem/:categoryId/:menuItemId", vendorDeleteMenuItemController);

router.all("*", () => {
    throw new ErrorWithCode("URL not found", 404, NOT_FOUND_EXCEPTION, (new Error()).stack);
});
export default router;
