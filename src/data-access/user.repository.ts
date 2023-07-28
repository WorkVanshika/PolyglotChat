import { FilterQuery, UpdateQuery } from "mongoose";
import { IUser, User } from "../models/user.model";

export class UserRepository {
  public static async createUser(userDetails: IUser) {
    console.log("userDetails ==> ", userDetails);
    return await User.create(userDetails);
  }

  public static async findUserBySpecificFields(
    queryFields: FilterQuery<IUser>
  ) {
    console.log("queryFields ==> ", queryFields);
    return await User.findOne(queryFields);
  }

  public static async findUserByIdAndUpdate(
    queryFields: FilterQuery<IUser>,
    updateQuery: UpdateQuery<IUser>
  ) {
    console.log("queryFields ==> ", queryFields);
    console.log("updateQuery ==> ", updateQuery);
    return await User.findByIdAndUpdate(queryFields, updateQuery);
  }

  public static async getAllUsers(limit: number, page: number) {
    return await User.find({})
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();
  }

  public static async countUsers() {
    return await User.countDocuments();
  }

  public static async deleteUser(email: string) {
    return await User.deleteOne({ email });
  }
}
