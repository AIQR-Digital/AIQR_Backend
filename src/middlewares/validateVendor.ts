import {body} from "express-validator";

export const validateVendorRegistration = [
    body("restaurantName")
        .notEmpty()
        .withMessage("Restaurant Name Cannot be Empty")
        .exists()
        .withMessage("Restaurant Name is Required.")
        .isString()
        .withMessage("Restaurant Name should be String")
        .escape(),
    body("vendorContact")
        .notEmpty()
        .withMessage("Contact Cannot be Empty")
        .exists()
        .withMessage("Contact Number is Required.")
        .isNumeric()
        .withMessage("Contact Number should be numeric")
        .isLength({
            min: 10,
            max: 10
        })
        .withMessage("Contact Number should be exactly 10 digits")
        .escape(),
    body("password")
        .notEmpty()
        .withMessage("Password Cannot be Empty")
        .exists()
        .withMessage("Password is Mandatory")
        .isAlphanumeric()
        .withMessage("Password needs to be AlphaNumeric")
        .isLength({
            min: 8
        })
        .withMessage("Password needs to be at least 8 digits")
        .escape(),
    body("passkey")
        .notEmpty()
        .withMessage("PassKey is Mandatory while registering")
        .exists()
        .withMessage("Vendor PassKey is Missing.")
        .isString()
        .withMessage("PassKey should be String")
        .escape()
];

export const validateVendorLogin = [
    body("contact")
        .notEmpty()
        .withMessage("Contact Cannot be Empty")
        .exists()
        .withMessage("Contact Number is Required.")
        .isNumeric()
        .withMessage("Contact Number should be numeric")
        .isLength({
            min: 10,
            max: 10
        })
        .withMessage("Contact Number should be exactly 10 digits")
        .escape(),
    body("password")
        .notEmpty()
        .withMessage("Password Cannot be Empty")
        .exists()
        .withMessage("Password is Mandatory")
        .isAlphanumeric()
        .withMessage("Password needs to be AlphaNumeric")
        .isLength({
            min: 8
        })
        .withMessage("Password needs to be at least 8 digits")
        .escape()
];

export const validateVendorUpdate = [
    body("contact")
        .notEmpty()
        .withMessage("Contact Cannot be Empty")
        .exists()
        .withMessage("Contact Number is Required.")
        .isNumeric()
        .withMessage("Contact Number should be numeric")
        .isLength({
            min: 10,
            max: 10
        })
        .withMessage("Contact Number should be exactly 10 digits")
        .escape(),
    body("restaurantName")
        .notEmpty()
        .withMessage("Restaurant Name Cannot be Empty")
        .exists()
        .withMessage("Restaurant Name is Required.")
        .isString()
        .withMessage("Restaurant Name should be String")
        .escape(),
    body("vendorName")
        .notEmpty()
        .withMessage("Vendor Name Cannot be Empty")
        .exists()
        .withMessage("Vendor Name is Required.")
        .isString()
        .withMessage("Vendor Name should be String")
        .escape(),
    body("vendorAddress")
        .notEmpty()
        .withMessage("Vendor Address Cannot be Empty")
        .exists()
        .withMessage("Vendor Address Should not be empty")
        .escape()
];

export const validateAddTablesData = [
    body("tables")
        .notEmpty()
        .withMessage("Tables Cannot Be Empty")
        .isArray({
            min: 1
        })
        .withMessage("Atleast One Table Needs to be added"),
    body("tables.*.tableId")
        .notEmpty()
        .withMessage("Table Id Cannot be Empty")
        .exists()
        .withMessage("Table Id is Required.")
        .isNumeric()
        .withMessage("Table Id should be numeric")
        .escape()
];

export const validateUpdateTableData = [
    body("tableId")
        .notEmpty()
        .withMessage("Table Id Cannot be Empty")
        .exists()
        .withMessage("Table Id is Required.")
        .isNumeric()
        .withMessage("Table Id should be numeric")
        .escape()
];