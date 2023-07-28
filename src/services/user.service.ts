import { IUser, User, userSchema } from "../models/user.model";
import jwt from "jsonwebtoken";
import { Document } from "mongoose";
import * as bcrypt from "bcrypt";
import { UserRepository } from "../data-access/user.repository";
import { IUpdateUserDetails, USER_ROLES_ENUM } from "../helpers/user.helper";

require("dotenv").config();

export class UserService {
  /* This function is for registering different users in our system
   */
  public static async registerUserInDatabase(userObject: IUser): Promise<{
    status: number;
    message: string;
  }> {
    try {
      const user = await UserRepository.findUserBySpecificFields({
        email: userObject.email,
      });
      if (user) {
        return {
          status: 400,
          message: "User already exists!",
        };
      }

      const hashPassword = await this.hashPassword(userObject.password);

      await UserRepository.createUser({
        ...userObject,
        role: USER_ROLES_ENUM.NORMAL,
        password: hashPassword,
      });

      return {
        status: 200,
        message: "User registered successfully!!",
      };
    } catch (err) {
      console.log("err", err);
      return {
        status: 500,
        message: "User registration failed ! Please try again after sometime. ",
      };
    }
  }

  /* This function is for hashing the password before storing it in database
   */
  static async hashPassword(plaintextPassword: string) {
    const hash = await bcrypt.hash(plaintextPassword, 10);
    // will Store hash in the database
    return hash;
  }

  /* This function is for comparing the hashed password string & actual string
   */
  static async comparePassword(plaintextPassword: string, hash: string) {
    const result = await bcrypt.compare(plaintextPassword, hash);
    return result;
  }

  /* This function is for users to log in & perform operations in our system with
  token given in response when user logs in
  */
  public static async login(
    email: string,
    password: string
  ): Promise<{ status: number; message: string; data?: { token: string } }> {
    try {
      const user = await User.findOne({
        email,
      });
      if (!user) {
        return {
          status: 400,
          message: "User Not found with these credentials.",
        };
      }
      const passwordAndHashCompareResult = await this.comparePassword(
        password,
        user.password
      );
      if (!passwordAndHashCompareResult) {
        return {
          status: 400,
          message: "User Not found with these credentials.",
        };
      }
      const token = jwt.sign({ email: email }, process.env.JWT_SECRET);

      // this token will be kept until user logs out. Once user again logs in, token will be regenerated.
      await UserRepository.findUserByIdAndUpdate({ _id: user._id }, { token });

      return { status: 200, message: "Login successful!", data: { token } };
    } catch (err) {
      console.log("err", err);
      return {
        status: 500,
        message: "Something went Wrong while logging in!",
      };
    }
  }

  /* This function is for logging out users from our system and expiring their respective token.
   */
  public static async logout(user: IUser & Document) {
    try {
      // Remove their current jwt token
      await UserRepository.findUserByIdAndUpdate(
        { _id: user._id },
        { $unset: { token: 1 } }
      );
      return { status: 200, message: "Logout successful!" };
    } catch (err) {
      console.log("err", err);
      return {
        status: 500,
        message: "Something went Wrong while logging out!",
      };
    }
  }

  /* This function is for showing user thier profile details when they select view my profile.
   */
  public static async getUserDetails(user: IUser & Document) {
    try {
      return {
        status: 200,
        data: {
          email: user.email,
          preferredLanguage: user.preferredLanguage,
          fullName: user.fullName,
          role: user.role,
        },
      };
    } catch (err) {
      console.log("err", err);
      return {
        status: 500,
        message: "Something went Wrong while logging out!",
      };
    }
  }

  /* This function is for changing users credentials in our system
   */
  public static async changeUserCredentials(
    user: IUser & Document,
    oldPassword: string,
    newPassword: string
  ) {
    try {
      const passwordAndHashCompareResult = await this.comparePassword(
        oldPassword,
        user.password
      );
      if (!passwordAndHashCompareResult) {
        return {
          status: 400,
          message: "Old passsword is not correct!",
        };
      }
      if (oldPassword === newPassword) {
        return {
          status: 400,
          message: "Old passsword & new Password cannot be same!",
        };
      }
      const newHashedPassword = await this.hashPassword(newPassword);

      await UserRepository.findUserByIdAndUpdate(
        { _id: user._id },
        { password: newHashedPassword }
      );

      return { status: 200, message: "Password updated successfully!" };
    } catch (err) {
      console.log("err", err);
      return {
        status: 500,
        message: "Something went Wrong while fetching your details!",
      };
    }
  }
  /* This function is for changing user details like user preferred langauge, fullName
   */
  public static async changeUserDetails(
    user: IUser & Document,
    updatedUserDetails: IUpdateUserDetails
  ) {
    try {
      const updateQuery = {
        preferredLanguage: user.preferredLanguage,
        fullName: user.fullName,
      };
      let isUserDataModified = false;

      if (
        updatedUserDetails.preferredLanguage &&
        user.preferredLanguage !== updatedUserDetails.preferredLanguage
      ) {
        isUserDataModified = true;
        updateQuery.preferredLanguage = updatedUserDetails.preferredLanguage;
      }

      if (
        updatedUserDetails.fullName &&
        user.fullName !== updatedUserDetails.fullName
      ) {
        isUserDataModified = true;
        updateQuery.fullName = updatedUserDetails.fullName;
      }

      if (isUserDataModified) {
        // only if any one of the data is modified, we will make database operation
        await UserRepository.findUserByIdAndUpdate(
          { _id: user._id },
          updateQuery
        );
      }

      return { status: 200, message: "Details updated successfully!" };
    } catch (err) {
      console.log("err", err);
      return {
        status: 500,
        message: "Something went Wrong!",
      };
    }
  }
}
