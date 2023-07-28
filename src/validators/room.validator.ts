import { ValidationChain, body, query } from "express-validator";

export const createRoomValidator = (): ValidationChain[] => {
  return [
    body("roomName")
      .not()
      .isEmpty()
      .withMessage({ error_code: "please enter room name" })
      .bail()
      .isString()
      .withMessage({ error_code: "Room name must be string" }),
  ];
};

export const getRoomsListValidator = (): ValidationChain[] => {
  return [
    query("limit")
      .optional()
      .bail()
      .isNumeric()
      .withMessage({ error_code: "limit must be number" }),
    query("page")
      .optional()
      .bail()
      .isNumeric()
      .withMessage({ error_code: "page must be number" }),
  ];
};

export const deleteRoomValidator = (): ValidationChain[] => {
  return [
    query("roomName")
      .not()
      .isEmpty()
      .withMessage({ error_code: "please add room name query parameter" })
      .bail()
      .isString()
      .withMessage({ error_code: "Room name must be string" }),
  ];
};
