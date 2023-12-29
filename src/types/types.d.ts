import {Types} from "mongoose";

declare module "jsonwebtoken" {
    export interface JwtPayload {
        id: Types.ObjectId
        timeStamp: string
        generatedBy: JSON_TOKEN_TYPE
    }
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