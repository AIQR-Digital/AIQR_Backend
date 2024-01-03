import {Request} from "express";
import {validationResult} from "express-validator";

import {ErrorWithCode} from "./ErrorWithCode";
import {FIELD_VALIDATION_EXCEPTION} from "./app.constants";

export const ErrorCheck = (req: Request) => {
    const contact = req.body.contact;
    const vendorContact = req.body.vendorContact;
    const errors = validationResult(req);
    if (!errors.isEmpty())
        throw new ErrorWithCode(errors.array()[0].msg, 422, FIELD_VALIDATION_EXCEPTION);
    else if (contact?.startsWith("0"))
        throw new ErrorWithCode("Contact cannot start with 0", 422, FIELD_VALIDATION_EXCEPTION);
    else if (vendorContact?.startsWith("0"))
        throw new ErrorWithCode("Vendor Contact cannot start with 0", 422, FIELD_VALIDATION_EXCEPTION);
}