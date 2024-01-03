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

export const validateMenuCategoryName = [
    body("categoryName")
        .notEmpty()
        .withMessage("Category Name Cannot be Empty")
        .exists()
        .withMessage("Category Name is Required.")
        .isString()
        .withMessage("Category Name should be String")
        .escape()
];

export const validateMenuItem = [
    body("itemName")
        .notEmpty()
        .withMessage("Menu Item Name Cannot be Empty")
        .exists()
        .withMessage("Menu Item Name is Required.")
        .isString()
        .withMessage("Menu Item Name should be String")
        .escape(),
    body("itemPrice")
        .notEmpty()
        .withMessage("Menu Item Price Cannot be Empty")
        .exists()
        .withMessage("Menu Item Price is Required.")
        .isNumeric()
        .withMessage("Menu Item Price should be numeric")
        .escape(),
    body("itemDiscount")
        .if(body("itemDiscount").exists())
        .notEmpty()
        .withMessage("Menu Item Price Cannot be Empty")
        .exists()
        .withMessage("Menu Item Price is Required.")
        .isNumeric()
        .withMessage("Menu Item Price should be numeric")
        .escape(),
    body("itemDescription")
        .if(body("itemDescription").exists())
        .notEmpty()
        .withMessage("Menu Item Description Cannot be Empty")
        .exists()
        .withMessage("Menu Item Description is Required.")
        .isString()
        .withMessage("Menu Item Description should be String")
        .escape(),
    body("itemIngredients")
        .if(body("itemIngredients").exists())
        .notEmpty()
        .withMessage("Menu Item Ingredients Cannot be Empty")
        .exists()
        .withMessage("Menu Item Ingredients is Required.")
        .isArray({
            min: 1
        })
        .withMessage("Menu Item Ingredients should contain atleast 1 item")
        .escape(),
    body("itemImage")
        .if(body("itemImage").exists())
        .notEmpty()
        .withMessage("Menu Item Image Cannot be Empty")
        .exists()
        .withMessage("Menu Item Image is Required.")
        .isString()
        .withMessage("Menu Item Image should be String")
        .escape(),
    body("chefSpecial")
        .if(body("chefSpecial").exists())
        .notEmpty()
        .withMessage("Chef Special Cannot be Empty")
        .exists()
        .withMessage("Chef Special is Required.")
        .isBoolean()
        .withMessage("Chef Special should be Boolean")
        .escape(),
    body("isSpicy")
        .if(body("isSpicy").exists())
        .notEmpty()
        .withMessage("Item Is Spicy Cannot be Empty")
        .exists()
        .withMessage("Item Is Spicy is Required.")
        .isBoolean()
        .withMessage("Item Is Spicy should be Boolean")
        .escape(),
    body("mustTry")
        .if(body("mustTry").exists())
        .notEmpty()
        .withMessage("Item Must Try Cannot be Empty")
        .exists()
        .withMessage("Item Must Try is Required.")
        .isBoolean()
        .withMessage("Item Must Try should be Boolean")
        .escape(),
];
