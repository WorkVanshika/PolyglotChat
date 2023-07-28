import { Document } from "mongoose";
import { IUser } from "../models/user.model";
import { UserService } from "../services/user.service";
import { IUpdateUserDetails } from "../helpers/user.helper";

export class UserController {
  public static async registerUser(userObject: IUser) {
    return await UserService.registerUserInDatabase(userObject);
  }

  public static async login(email: string, password: string) {
    return await UserService.login(email, password);
  }

  public static async logout(user: IUser & Document) {
    return await UserService.logout(user);
  }

  public static async getUserDetails(user: IUser & Document) {
    return await UserService.getUserDetails(user);
  }

  public static async changePassword(
    user: IUser & Document,
    oldPassword: string,
    newPassword: string
  ) {
    return await UserService.changeUserCredentials(
      user,
      oldPassword,
      newPassword
    );
  }

  public static async changeUserDetails(
    user: IUser & Document,
    updatedUserDetails: IUpdateUserDetails
  ) {
    return await UserService.changeUserDetails(user, updatedUserDetails);
  }

  public static async listOfAllUsers(limit: number, page: number) {
    return await UserService.usersList(limit, page);
  }

  public static async deleteUser(userEmail: string, user: IUser & Document) {
    return await UserService.deleteUser(userEmail, user);
  }
}
