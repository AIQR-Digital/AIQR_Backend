import {Request, Response, NextFunction} from "express";
import {PopulatedDoc, Schema, Types, Document} from "mongoose";
import {ValidationChain} from "express-validator";

declare module "jsonwebtoken" {
    export interface JwtPayload {
        id: Types.ObjectId
        timeStamp: string
        generatedBy: JSON_TOKEN_TYPE
    }
}

export interface Route {
    method: 'get' | 'post' | 'put' | 'patch' | 'delete'
    path: string
    middleware?: ValidationChain[] | ((req: Request, res: Response, next: NextFunction) => void)[];
    handler: (req: Request, res: Response, next: NextFunction) => void;
}

export type JSON_TOKEN_TYPE = "AUTHORIZER" | "VENDOR" | "CONSUMER";

export interface USER_TOKEN_TYPE {
    AUTHORIZER: "AUTHORIZER"
    VENDOR: "VENDOR"
    CONSUMER: "CONSUMER"
}

// VENDOR DATA TYPE

export interface VendorRegisterData {
    restaurantName: string
    vendorContact: string
    password: string
    passkey: string
    image?: string
}

export interface VendorLoginData {
    contact: string
    password: string
}

export interface VendorUpdateData {
    contact: string
    restaurantName: string
    vendorName: string
    vendorAddress: string
}

export interface TableData {
    tableId: number
}

export interface VendorTableData {
    contact: string
    tables: TableData[]
}

export interface VendorUpdateTableData {
    tableId: string
}

export interface VendorMenuCategoryData {
    categoryName: string
}

export interface VendorMenuItemData {
    itemName: string,
    itemPrice: number,
    itemDiscount?: number,
    itemDescription?: string,
    itemIngredients?: string[],
    itemImage?: string,
    chefSpecial?: boolean,
    isSpicy?: boolean,
    mustTry?: boolean
}

// AUTHORIZER DATA TYPE

export interface AuthorizerRegisterData {
    name: string
    contact: string
    password: string
}

export interface AuthorizerLoginData {
    contact: string
    password: string
}

export interface AuthorizerVendorRegisterData {
    vendorName: string
    vendorContact: string
    vendorAddress: string
    contact: string
}

// DATABASE SCHEMA INTERFACES

export interface TableSchemaData extends Document {
    table_no: number,
    tablePassKey: number,
    insertTimestamp: string,
    updateTimestamp: string,
}

export interface MenuItemSchemaData extends Document {
    itemName: string,
    itemPrice: number,
    itemDiscount: number,
    itemDescription: string,
    itemIngredients: string[],
    itemImage: string,
    chefSpecial: boolean,
    isSpicy: boolean,
    mustTry: boolean,
    insertTimestamp: string,
    updateTimestamp: string,
}

export interface RestaurantMenuCategorySchemaData extends Document {
    categoryName: string,
    categoryItems: MenuItemSchemaData[],
    insertTimestamp: string,
    updateTimestamp: string,
}


export interface RestaurantSchemaData extends Document {
    vendorName: string,
    restaurantName: string,
    password: string,
    contact: number,
    address: string,
    image: string,
    isContactVerified: boolean,
    insertTimestamp: string,
    updateTimestamp: string,
    tables: TableSchemaData[],
    categories: RestaurantMenuCategorySchemaData[]
}



