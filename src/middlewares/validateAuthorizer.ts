import {body} from "express-validator";

export const validateAuthLogin = [
    body("contact")
        .notEmpty()
        .withMessage("Authorizer Contact Cannot be Empty")
        .exists()
        .withMessage("Authorizer Contact Number is Required.")
        .isNumeric()
        .withMessage("Authorizer Contact Number should be numeric")
        .isLength({
            min: 10,
            max: 10
        })
        .withMessage("Authorizer Contact Number should be exactly 10 digits")
        .escape(),
    body("password")
        .notEmpty()
        .withMessage("Authorizer Password Cannot be Empty")
        .exists()
        .withMessage("Authorizer Password is Mandatory")
        .isAlphanumeric()
        .withMessage("Authorizer Password needs to be AlphaNumeric")
        .isLength({
            min: 8
        })
        .withMessage("Authorizer Password needs to be at least 8 digits")
        .escape()
];

export const validateAuthRegister = [
    body("name")
        .notEmpty()
        .withMessage("Authorizer Name Cannot be Empty")
        .exists()
        .withMessage("Authorizer Name is Required.")
        .isString()
        .withMessage("Authorizer Name should be String")
        .escape(),
    body("contact")
        .notEmpty()
        .withMessage("Authorizer Contact Cannot be Empty")
        .exists()
        .withMessage("Authorizer Contact Number is Required.")
        .isNumeric()
        .withMessage("Authorizer Contact Number should be numeric")
        .isLength({
            min: 10,
            max: 10
        })
        .withMessage("Authorizer Contact Number should be exactly 10 digits")
        .escape(),
    body("password")
        .notEmpty()
        .withMessage("Authorizer Password Cannot be Empty")
        .exists()
        .withMessage("Authorizer Password is Mandatory")
        .isAlphanumeric()
        .withMessage("Authorizer Password needs to be AlphaNumeric")
        .isLength({
            min: 8
        })
        .withMessage("Authorizer Password needs to be at least 8 digits")
        .escape()
];


export const validateAuthVendor = [
    body("vendorName")
        .notEmpty()
        .withMessage("Vendor Name Cannot be Empty")
        .exists()
        .withMessage("Vendor Name is Required.")
        .isString()
        .withMessage("Vendor Name should be String")
        .escape(),
    body("vendorContact")
        .notEmpty()
        .withMessage("Vendor Contact Cannot be Empty")
        .exists()
        .withMessage("Vendor Contact Number is Required.")
        .isNumeric()
        .withMessage("Vendor Contact Number should be numeric")
        .isLength({
            min: 10,
            max: 10
        })
        .withMessage("Vendor Contact Number should be exactly 10 digits")
        .escape(),
    body("vendorAddress")
        .notEmpty()
        .withMessage("Vendor Address Cannot be Empty")
        .exists()
        .withMessage("Vendor Address Should not be empty")
        .escape(),
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
];