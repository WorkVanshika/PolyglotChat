import { ValidationChain, body, param, query } from "express-validator";
import { LANGUAGE_ENUM } from "../helpers/user.helper";

export const registerUserValidator = (): ValidationChain[] => {
  return [
    body("fullName")
      .not()
      .isEmpty()
      .withMessage({ error_code: "fullName is compulsory" })
      .bail()
      //   .custom((value) => typeof value === "string")
      .isString()
      .withMessage({ error_code: "fullName must be string" }),
    body("email")
      .not()
      .isEmpty()
      .withMessage({ error_code: "please enter email" })
      .trim()
      .isEmail()
      .withMessage({ error_code: "Please enter proper email" }),
    body("password")
      .not()
      .isEmpty()
      .withMessage({ error_code: "please enter password" })
      .isString()
      .withMessage({ error_code: "Password must be string" }),
    body("preferredLanguage")
      .not()
      .isEmpty()
      .withMessage({ error_code: "preferredLanguage is compulsory" })
      .isIn(Object.values(LANGUAGE_ENUM))
      .withMessage({
        error_code: "preferred Language must be one from the given options",
      }),
  ];
};

export const loginValidator = (): ValidationChain[] => {
  return [
    body("email")
      .not()
      .isEmpty()
      .withMessage({ error_code: "please enter email" })
      .bail()
      .isEmail()
      .withMessage({ error_code: "Please enter proper email" }),
    body("password")
      .not()
      .isEmpty()
      .withMessage({ error_code: "please enter password" })
      .bail()
      .isString()
      .withMessage({ error_code: "Password must be string" }),
  ];
};

export const changePasswordValidator = (): ValidationChain[] => {
  return [
    body("oldPassword")
      .not()
      .isEmpty()
      .withMessage({ error_code: "please enter old password" })
      .isString()
      .withMessage({ error_code: "Old Password must be string" }),
    body("newPassword")
      .not()
      .isEmpty()
      .withMessage({ error_code: "please enter new password" })
      .isString()
      .withMessage({ error_code: "New Password must be string" }),
  ];
};

export const changeUserDetailsValidator = (): ValidationChain[] => {
  return [
    body("fullName")
      .optional()
      .isString()
      .withMessage({ error_code: "Full Name must be string" }),
    body("preferredLanguage")
      .optional()
      .isIn(Object.values(LANGUAGE_ENUM))
      .withMessage({
        error_code: "preferred Language must be one from the given options",
      }),
  ];
};
