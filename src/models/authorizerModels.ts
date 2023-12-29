import mongoose, {Schema} from "mongoose";
import {timeZoned} from "../utils/logger";

const AuthorizerSchema = new Schema({
    name: {type: String, required: true},
    password: {type: String, required: true},
    contact: {type: Number, length: 10, required: true},
    timestamp: {
        type: String,
        default: timeZoned(),
    }
});


export const AuthorizerData = mongoose.model("Authorizer_Data", AuthorizerSchema);