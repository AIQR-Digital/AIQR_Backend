import {NextFunction, Request, Response} from "express";

import {RestaurantData, TableData} from "../models/vendorModels";
import {
    VendorRegisterData,
    VendorLoginData,
    VendorUpdateData,
    VendorTableData,
    VendorUpdateTableData
} from "../types/types";
import {hashCompare, hashGenerator} from "../utils/hashGenerator";
import {ErrorCheck} from "../utils/ErrorCheck";
import {generateAccessToken} from "../middlewares/jwtValidation";
import {ErrorWithCode} from "../utils/ErrorWithCode";
import {
    DATABASE_EXCEPTION, FIELD_VALIDATION_EXCEPTION,
    INVALID_AUTHORIZATION_EXCEPTION,
    NOT_FOUND_EXCEPTION,
    SERVER_EXCEPTION,
    USER_TYPE
} from "../utils/app.constants";
import logger, {timeZoned} from "../utils/logger";
import {Authorized_Vendor_Model} from "../models/authGenVendorModels";
import mongoose from "mongoose";

const log = logger(__filename);

const validatePassKey = async (passKey: string, contact: string) => {
    const vendorExists = await Authorized_Vendor_Model.findOneAndUpdate({
        vendorContact: Number(contact.trim()),
        vendorPassKey: passKey
    }, {
        vendorPassKey: null,
        vendorHasUsedKey: true,
        updateTimestamp: timeZoned()
    }, {
        new: true
    });
    if (!vendorExists) {
        log.error(`Invalid PassKey/Contact ${passKey}/${contact}`);
        throw new ErrorWithCode("Invalid Combination of PassKey & Contact, Please Contact Team", 401, INVALID_AUTHORIZATION_EXCEPTION);
    }

    return vendorExists;
};

export const vendorRegistrationController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        ErrorCheck(req, res, next);

        const body: VendorRegisterData = req.body;

        const vendorPayload = await validatePassKey(body.passkey, body.vendorContact);

        if (vendorPayload === undefined) {
            log.error(`Vendor Payload Not Found`);
            return next(new ErrorWithCode("Invalid PassKey, Please contact Authorizer", 401, INVALID_AUTHORIZATION_EXCEPTION));
        }

        const existingVendor = await RestaurantData.findOne({
            contact: vendorPayload.vendorContact
        });
        if (existingVendor) {
            log.error(`Vendor Already Exists`);
            return next(new ErrorWithCode("Vendor Already Exists, Please Login", 400, INVALID_AUTHORIZATION_EXCEPTION));
        }

        // HASHING PASSWORD
        const hash = await hashGenerator(body.password);

        // SMS TRIGGER FOR OTP VERIFICATION


        const restaurantData = new RestaurantData({
            vendorName: vendorPayload.vendorName,
            restaurantName: body.restaurantName,
            contact: vendorPayload.vendorContact,
            address: vendorPayload.vendorAddress,
            image: body.image?.trim(),
            password: hash,
            isContactVerified: false,
            insertTimestamp: timeZoned(),
            updateTimestamp: timeZoned(),
        });

        const dataSaved = await restaurantData.save();
        if (dataSaved) {

            // CREATE JSON WEB TOKEN FOR LOGGED IN SESSION
            const token: string = generateAccessToken({
                id: dataSaved.id,
                timeStamp: timeZoned(),
                generatedBy: USER_TYPE.VENDOR
            });

            log.info("SUCCESSFULLY CREATED VENDOR");
            res.status(201).json({
                success: true,
                token: token,
                message: "An OTP has been shared to your contact, Please Verify your registration"
            })
        } else {
            log.error("Failed to save data");
            return next(new ErrorWithCode("Something went Wrong, please try again later", 500, DATABASE_EXCEPTION));
        }

    } catch (error: any) {
        if (!(error instanceof ErrorWithCode)) {
            throw new ErrorWithCode(error.message || "Something went wrong, please try again later", 500, SERVER_EXCEPTION, error.stack);
        }
        next(error);
    }
};


export const vendorLoginController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        ErrorCheck(req, res, next);

        const body: VendorLoginData = req.body;

        const restaurantData = await RestaurantData.findOne({
            contact: Number(body.contact.trim())
        }).select("password id");
        if (!restaurantData) {
            log.error("Vendor Contact Not Found");
            return next(new ErrorWithCode("Invalid Contact or Password", 404, INVALID_AUTHORIZATION_EXCEPTION));
        }

        const isValidPassword = await hashCompare(body.password, restaurantData.password);
        if (!isValidPassword) {
            log.error(body.contact + ": Invalid Password");
            return next(new ErrorWithCode("Invalid Contact or Password", 404, INVALID_AUTHORIZATION_EXCEPTION));
        }

        // CREATE JSON WEB TOKEN FOR LOGGED IN SESSION
        const token: string = generateAccessToken({
            id: restaurantData.id,
            timeStamp: timeZoned(),
            generatedBy: USER_TYPE.VENDOR
        });

        res.status(200).json({
            success: true,
            token: token,
            message: "LOGGED IN SUCCESSFULLY"
        });

    } catch (error: any) {
        if (!(error instanceof ErrorWithCode)) {
            throw new ErrorWithCode(error.message || "Something went wrong, please try again later", 500, SERVER_EXCEPTION, error.stack);
        }
        next(error);
    }
};

export const vendorDataController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const restaurantData =
            await RestaurantData.findById(req.tokenData.id)
                .populate({
                    path: "tables",
                    select: "-tablePassKey -__v"
                })
                .select("-password -__v -insertTimestamp -updateTimestamp");

        if (!restaurantData) {
            log.error(`Vendor Not Found for id: ${req.tokenData.id}`);
            return next(new ErrorWithCode("Unauthorized Access, Please Login/Register first", 401, INVALID_AUTHORIZATION_EXCEPTION));
        }

        log.info("Successfully Fetched Restaurant Details");
        res.status(200).json({
            success: true,
            message: "SUCCESSFULLY FETCHED DETAILS",
            data: restaurantData
        });
    } catch (error: any) {
        log.info("Failed to fetch Restaurant Details");
        if (!(error instanceof ErrorWithCode)) {
            throw new ErrorWithCode(error.message || "Something went wrong, please try again later", 500, SERVER_EXCEPTION, error.stack);
        }
        next(error);
    }
};

export const vendorUpdateController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        ErrorCheck(req, res, next);

        const body: VendorUpdateData = req.body;

        const restaurantData = await RestaurantData.findById(req.tokenData.id);
        if (!restaurantData) {
            log.error(`Vendor Not Found for id: ${req.tokenData.id}`);
            return next(new ErrorWithCode("Unauthorized Access, Please Login/Register first", 401, INVALID_AUTHORIZATION_EXCEPTION));
        }

        const savedData = await RestaurantData.findByIdAndUpdate(req.tokenData.id, {
            vendorName: body.vendorName,
            restaurantName: body.restaurantName,
            contact: body.contact,
            address: body.vendorAddress,
            updateTimestamp: timeZoned(),
            isContactVerified: Number(restaurantData.contact) === Number(body.contact)
        });
        if (!savedData) {
            log.error(`Failed to Update Vendor Data for ID: ${req.tokenData.id} - ${restaurantData.vendorName}`);
            return next(new ErrorWithCode("Failed to Update Data", 500, DATABASE_EXCEPTION));
        }

        res.status(200).json({
            success: true,
            message: "SUCCESSFULLY UPDATED DETAILS"
        });

    } catch (error: any) {
        if (!(error instanceof ErrorWithCode)) {
            throw new ErrorWithCode(error.message || "Something went wrong, please try again later", 500, SERVER_EXCEPTION, error.stack);
        }
        next(error);
    }
};

export const vendorAddTableController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        ErrorCheck(req, res, next);

        const body: VendorTableData = req.body;

        const restaurantData = await RestaurantData.findById(req.tokenData.id).select("id restaurantName");
        if (!restaurantData) {
            log.error(`Vendor Not Found for id: ${req.tokenData.id}`);
            return next(new ErrorWithCode("Unauthorized Access, Please Login/Register first", 401, INVALID_AUTHORIZATION_EXCEPTION));
        }

        const tablesMappedData = body.tables.map(table => ({
            table_no: table.tableId,
            tablePassKey: null
        }));
        const tablesCreated = await TableData.create(tablesMappedData);
        if (!tablesCreated) {
            return next(new ErrorWithCode("Failed to save tables", 500, DATABASE_EXCEPTION));
        }

        const createdTableIds = tablesCreated.map(table => table.id);

        const updateRestaurantFields = await RestaurantData.findByIdAndUpdate(restaurantData, {
            $push: {
                tables: {
                    $each: createdTableIds
                }
            }
        }, {
            new: true
        }).select("id");

        if (!updateRestaurantFields) {
            log.error(`Failed to Map Table Ids with the Restaurant - ${restaurantData.restaurantName} Data Fields`);
            return next(new ErrorWithCode("Failed to Update Database", 500, DATABASE_EXCEPTION));
        }

        res.status(200).json({
            success: true,
            message: "SUCCESSFULLY ADDED TABLE DETAILS"
        })

    } catch (error: any) {
        if (!(error instanceof ErrorWithCode)) {
            throw new ErrorWithCode(error.message || "Something went wrong, please try again later", 500, SERVER_EXCEPTION, error.stack);
        }
        next(error);
    }
};

export const vendorUpdateTableController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        ErrorCheck(req, res, next);

        const body: VendorUpdateTableData = req.body;
        const tableId = req.params.tableId;
        const restaurantData = await RestaurantData.findById(req.tokenData.id).select("id").exec();
        if (!restaurantData) {
            log.error(`Vendor Not Found for id: ${req.tokenData.id}`);
            return next(new ErrorWithCode("Unauthorized Access, Please Login/Register first", 401, INVALID_AUTHORIZATION_EXCEPTION));
        }

        if (!mongoose.Types.ObjectId.isValid(tableId)) {
            return next(new ErrorWithCode("Invalid Table Id", 400, FIELD_VALIDATION_EXCEPTION));
        }

        const tableData = await TableData.findByIdAndUpdate(tableId, {
            table_no: body.tableId
        }, {
            new: true
        }).select("id").exec();
        if (!tableData) {
            log.error(`Table Not Found for id: ${tableId}`);
            return next(new ErrorWithCode("Unable to find the table Id", 404, NOT_FOUND_EXCEPTION));
        }

        res.status(200).json({
            success: true,
            message: "SUCCESSFULLY UPDATED TABLE DETAILS"
        })

    } catch (error: any) {
        if (!(error instanceof ErrorWithCode)) {
            throw new ErrorWithCode(error.message || "Something went wrong, please try again later", 500, SERVER_EXCEPTION, error.stack);
        }
        next(error);
    }
};

export const vendorDeleteTableController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        ErrorCheck(req, res, next);

        const tableId = req.params.tableId;

        if (!mongoose.Types.ObjectId.isValid(tableId)) {
            return next(new ErrorWithCode("Invalid Table Id", 400, FIELD_VALIDATION_EXCEPTION));
        }

        const restaurantData = await RestaurantData.findByIdAndUpdate(req.tokenData.id, {
            $pull: {
                tables: tableId
            }
        }).select("id").exec();
        if (!restaurantData) {
            log.error(`Vendor Not Found for id: ${req.tokenData.id}`);
            return next(new ErrorWithCode("Unauthorized Access, Please Login/Register first", 401, INVALID_AUTHORIZATION_EXCEPTION));
        }

        const tableData = await TableData.findByIdAndDelete(tableId).exec();
        if (!tableData) {
            log.error(`Table Not Found for id: ${tableId}`);
            return next(new ErrorWithCode("Unable to find the table Id", 404, NOT_FOUND_EXCEPTION));
        }

        res.status(200).json({
            success: true,
            message: "SUCCESSFULLY DELETED TABLE DETAILS"
        });

    } catch (error: any) {
        if (!(error instanceof ErrorWithCode)) {
            throw new ErrorWithCode(error.message || "Something went wrong, please try again later", 500, SERVER_EXCEPTION, error.stack);
        }
        next(error);
    }
};