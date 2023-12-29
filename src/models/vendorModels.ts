import mongoose, {Schema} from "mongoose";
import {timeZoned} from "../utils/logger";

const tableSchema = new Schema({
    table_no: Number,
    tablePassKey: {
        type: Number,
        default: null
    }
});

const restaurantSchema = new Schema({
    vendorName: {type: String, required: true},
    restaurantName: {type: String, required: true},
    password: {type: String, required: true},
    contact: {type: Number, length: 10, required: true},
    address: {type: String, required: true},
    image: String,
    isContactVerified: {type: Boolean, default: false},
    insertTimestamp: {
        type: String,
        default: timeZoned(),
    },
    updateTimestamp: {
        type: String,
        default: timeZoned()
    },
    tables: [{type: Schema.Types.ObjectId, ref: 'Table_Data'}]
});

export const TableData = mongoose.model("Table_Data", tableSchema);
export const RestaurantData = mongoose.model("Restaurant_Data", restaurantSchema);

