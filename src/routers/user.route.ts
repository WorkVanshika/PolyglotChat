import express, { Request, Response } from "express";
import { UserController } from "../controllers/user.controller";
import { UserMiddleware } from "../middlewares/user.middleware";
import * as UserValidators from "../validators/user.validator";
import { customValidate } from "../helpers/common.helper";

const router = express.Router();

router.post(
  "/register",
  customValidate(UserValidators.registerUserValidator()),
  async function (req: Request, res: Response) {
    const responseOfUserCreation = await UserController.registerUser(req.body);
    return res.status(responseOfUserCreation.status).json({
      message: responseOfUserCreation.message,
    });
  }
);

router.post(
  "/login",
  customValidate(UserValidators.loginValidator()),
  async function (req: Request, res: Response) {
    const responseOfUserLogin = await UserController.login(
      req.body.email,
      req.body.password
    );
    return res.status(responseOfUserLogin.status).json({
      message: responseOfUserLogin.message,
      data: responseOfUserLogin.data,
    });
  }
);

router.get(
  "/logout",
  UserMiddleware.authenticateUser,
  async function (req: Request, res: Response) {
    const responseOfLoggingOut = await UserController.logout(req.user);
    return res.status(responseOfLoggingOut.status).json({
      message: responseOfLoggingOut.message,
    });
  }
);

router.get(
  "/profile",
  UserMiddleware.authenticateUser,
  async function (req: Request, res: Response) {
    const getUserDetailsResponse = await UserController.getUserDetails(
      req.user
    );
    return res.status(getUserDetailsResponse.status).json({
      message: getUserDetailsResponse.message,
      data: getUserDetailsResponse.data,
    });
  }
);

router.put(
  "/changePassword",
  customValidate(UserValidators.changePasswordValidator()),
  UserMiddleware.authenticateUser,
  async function (req: Request, res: Response) {
    const changeUserPasswordResult = await UserController.changePassword(
      req.user,
      req.body.oldPassword,
      req.body.newPassword
    );
    return res.status(changeUserPasswordResult.status).json({
      message: changeUserPasswordResult.message,
    });
  }
);

router.put(
  "/changeUserDetails",
  customValidate(UserValidators.changeUserDetailsValidator()),
  UserMiddleware.authenticateUser,
  async function (req: Request, res: Response) {
    const changeUserDetailsResult = await UserController.changeUserDetails(
      req.user,
      req.body
    );
    return res.status(changeUserDetailsResult.status).json({
      message: changeUserDetailsResult.message,
    });
  }
);
module.exports = router;
