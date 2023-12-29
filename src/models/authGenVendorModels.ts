import mongoose, {Schema} from "mongoose";
import {timeZoned} from "../utils/logger";

const authVendorSchema = new Schema({
    authorizer_id: {type: Schema.Types.ObjectId, ref: 'Authorizer_Data'},
    vendorName: {type: String, required: true},
    vendorAddress: {type: String, required: true},
    vendorContact: {type: Number, length: 10, required: true},
    insertTimestamp: {
        type: String,
        default: timeZoned(),
    },
    updateTimestamp: {
        type: String,
        default: timeZoned(),
    },
    vendorPassKey: String,
    vendorHasUsedKey: {
        type: Boolean,
        default: false
    }
});

export const Authorized_Vendor_Model = mongoose.model("Authorized_Vendor", authVendorSchema);
