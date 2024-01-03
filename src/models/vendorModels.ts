import mongoose, {Schema} from "mongoose";
import {timeZoned} from "../utils/logger";
import {
    MenuItemSchemaData,
    RestaurantMenuCategorySchemaData,
    RestaurantSchemaData,
    TableSchemaData
} from "../types/types";

const tableSchema = new Schema({
    table_no: Number,
    tablePassKey: {
        type: Number,
        default: null
    },
    insertTimestamp: {
        type: String,
        default: timeZoned(),
    },
    updateTimestamp: {
        type: String,
        default: timeZoned()
    },
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
    tables: [{type: Schema.Types.ObjectId, ref: "Table_Data"}],
    categories: [{type: Schema.Types.ObjectId, ref: "Menu_Category_Data"}]
});

const menuItemsSchema = new Schema({
    itemName: {type: String, required: true},
    itemPrice: {type: Number, required: true},
    itemDiscount: Number,
    itemDescription: String,
    itemIngredients: [String],
    itemImage: String,
    chefSpecial: {
        type: Boolean,
        default: false
    },
    isSpicy: {
        type: Boolean,
        default: false
    },
    mustTry: {
        type: Boolean,
        default: false
    },
    insertTimestamp: {
        type: String,
        default: timeZoned(),
    },
    updateTimestamp: {
        type: String,
        default: timeZoned()
    },
});

const restaurantMenuCategorySchema = new Schema({
    categoryName: {type: String, required: true},
    categoryItems: [{type: Schema.Types.ObjectId, ref: "Menu_Item_Data"}],
    insertTimestamp: {
        type: String,
        default: timeZoned(),
    },
    updateTimestamp: {
        type: String,
        default: timeZoned()
    },
});

export const TableDataModel = mongoose.model<TableSchemaData>("Table_Data", tableSchema);
export const RestaurantDataModel = mongoose.model<RestaurantSchemaData>("Restaurant_Data", restaurantSchema);
export const MenuItemDataModel = mongoose.model<MenuItemSchemaData>("Menu_Item_Data", menuItemsSchema);
export const RestaurantMenuCategoryDataModel = mongoose.model<RestaurantMenuCategorySchemaData>("Menu_Category_Data", restaurantMenuCategorySchema);
