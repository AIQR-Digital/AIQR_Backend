import {NextFunction, Request, Response} from "express";

import {AuthorizerLoginData, AuthorizerRegisterData, AuthorizerVendorRegisterData} from "../types/types";
import {AuthorizerData} from "../models/authorizerModels";
import {hashCompare, hashGenerator} from "../utils/hashGenerator";
import {ErrorCheck} from "../utils/ErrorCheck";
import {Authorized_Vendor_Model} from "../models/authGenVendorModels";
import {generateAccessToken} from "../middlewares/jwtValidation";
import {ErrorWithCode} from "../utils/ErrorWithCode";
import {
    DATABASE_EXCEPTION,
    INVALID_AUTHORIZATION_EXCEPTION,
    SERVER_EXCEPTION,
    USER_EXCEPTION, USER_TYPE
} from "../utils/app.constants";
import logger, {timeZoned} from "../utils/logger";

const log = logger(__filename);

const contactIsValid = (contact: string) => {
    const defaultContacts = process.env.CONTACTS?.split(",");

    if (!defaultContacts)
        return false;
    const contacts = defaultContacts.map(contact => Number(contact));

    return contacts.includes(Number(contact.trim()));
};

export const authRegistrationController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        ErrorCheck(req);

        const body: AuthorizerRegisterData = req.body;

        // VALIDATING USER CONTACT
        const isValidContact = contactIsValid(body.contact);
        if (!isValidContact)
            return next(new ErrorWithCode("Unauthorized Contact Number", 401, INVALID_AUTHORIZATION_EXCEPTION));

        // CHECKING IF EXISTING USER
        const existingAuthorizer = await AuthorizerData.findOne({
            contact: Number(body.contact.trim())
        }).select("name");
        if (existingAuthorizer) {
            return next(new ErrorWithCode("Already Registered, Please login!", 403, USER_EXCEPTION));
        }

        // HASHING USER PASSWORD
        const hash = await hashGenerator(body.password);

        const authorizerData = new AuthorizerData({
            name: body.name.trim(),
            contact: Number(body.contact.trim()),
            password: hash,
            timestamp: timeZoned()
        }, {});

        const savedData = await authorizerData.save();
        if (savedData) {

            // CREATE JSON WEB TOKEN FOR LOGGED IN SESSION
            const token: string = generateAccessToken({
                id: savedData.id,
                timeStamp: timeZoned(),
                generatedBy: USER_TYPE.AUTHORIZER
            });

            log.info(`SUCCESSFULLY CREATED AUTHORIZER - ${savedData.name}: ${savedData.contact}`);
            res.status(201).json({
                success: true,
                message: "AUTHORIZER CREATED SUCCESSFULLY",
                token: token,
            })
        } else {
            log.error("Failed to save data");
            return next(new ErrorWithCode("Something went Wrong", 500, DATABASE_EXCEPTION));
        }

    } catch (error: any) {
        if (!(error instanceof ErrorWithCode)) {
            throw new ErrorWithCode(error.message || "Something went wrong, please try again", 500, SERVER_EXCEPTION, error.stack);
        }
        next(error);
    }
};

export const authLoginController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        ErrorCheck(req);

        const body: AuthorizerLoginData = req.body;

        // VALIDATING USER CONTACT
        const existingAuthorizer = await AuthorizerData.findOne({
            contact: Number(body.contact.trim())
        }).select("password id name");
        if (!existingAuthorizer) {
            return next(new ErrorWithCode("Invalid Contact or Password", 400, INVALID_AUTHORIZATION_EXCEPTION));
        }

        const isValidPassword = await hashCompare(body.password, existingAuthorizer.password);

        if (!isValidPassword) {
            return next(new ErrorWithCode("Invalid Contact or Password", 400, INVALID_AUTHORIZATION_EXCEPTION));
        }

        // CREATE JSON WEB TOKEN FOR LOGGED IN SESSION
        const token: string = generateAccessToken({
            id: existingAuthorizer.id,
            timeStamp: timeZoned(),
            generatedBy: USER_TYPE.AUTHORIZER
        });

        log.info(`USER: ${existingAuthorizer.name.toUpperCase()} LOGGED IN SUCCESSFULLY`);

        res.status(200).json({
            success: true,
            token: token,
            message: `LOGGED IN SUCCESSFULLY`
        });

    } catch (error: any) {
        if (!(error instanceof ErrorWithCode)) {
            throw new ErrorWithCode(error.message || "Something went wrong, please try again later", 500, SERVER_EXCEPTION, error.stack);
        }
        next(error);
    }
};

const generatePassKey = async () => {
    let vendorPassKey = String(Math.floor(100000 + Math.random() * 900000));
    while (true) {
        const isPresent = await Authorized_Vendor_Model.findOne({
            vendorPassKey: vendorPassKey
        });
        if (!isPresent) break;
        vendorPassKey = String(Math.floor(100000 + Math.random() * 900000));
    }
    return vendorPassKey;
};

export const authCreateVendor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        ErrorCheck(req);

        const body: AuthorizerVendorRegisterData = req.body;

        // VALIDATING USER CONTACT
        const authorizerExists = await AuthorizerData.findById(req.tokenData.id).select("contact _id");
        if (!authorizerExists) {
            log.error(`Authorizer Not Found ${req.tokenData.id}`);
            return next(new ErrorWithCode("Invalid Authorizer", 400, INVALID_AUTHORIZATION_EXCEPTION));
        }

        const contact = authorizerExists.contact;
        if (contact !== Number(body.contact.trim())) {
            log.error(`Contact MisMatch ${contact} != ${body.contact}`);
            return next(new ErrorWithCode("Unauthorized Access, Please Login/Register first", 401, INVALID_AUTHORIZATION_EXCEPTION));
        }

        const existingVendor = await Authorized_Vendor_Model.findOne({
            vendorContact: Number(body.vendorContact.trim())
        });
        if (existingVendor) {
            log.error(`Vendor Already Exists ${body.vendorContact}`);
            return next(new ErrorWithCode("Vendor Already Exists", 400, USER_EXCEPTION))
        }

        let vendorHashKey = await generatePassKey();

        const authVendorData = new Authorized_Vendor_Model({
            authorizer_id: authorizerExists._id,
            vendorName: body.vendorName.trim(),
            vendorContact: Number(body.vendorContact.trim()),
            vendorAddress: body.vendorAddress.trim(),
            vendorPassKey: vendorHashKey,
            vendorHasUsedKey: false
        });

        const savedData = await authVendorData.save();
        if (savedData) {
            log.info(`SUCCESSFULLY CREATED VENDOR - ${savedData.vendorName}: ${savedData.vendorContact} by Authorizer Id ${savedData.authorizer_id}`);
            res.status(201).json({
                success: true,
                message: "VENDOR ADDED SUCCESSFULLY - This Token Key will expire in 2hrs",
                passkey: vendorHashKey
            })
        } else {
            log.error("Failed to save data");
            return next(new ErrorWithCode("Something went wrong, please try again later", 500, DATABASE_EXCEPTION));
        }

    } catch (error: any) {
        if (!(error instanceof ErrorWithCode)) {
            throw new ErrorWithCode(error.message || "Something went wrong, please try again later", 500, SERVER_EXCEPTION, error.stack);
        }
        next(error);
    }
};
