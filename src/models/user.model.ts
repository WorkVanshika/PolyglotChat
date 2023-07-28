import { Document, Schema, model } from "mongoose";
import { LANGUAGE_ENUM, USER_ROLES_ENUM } from "../helpers/user.helper";

// interface representing a document in MongoDB.
export interface IUser {
  fullName: string;
  email: string;
  password: string;
  preferredLanguage: string;
  role: string;
  token: string;
}

// Schema corresponding to the document interface.
export const userSchema = new Schema<IUser>({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  preferredLanguage: { type: String, required: true, enum: LANGUAGE_ENUM },
  role: { type: String, enum: USER_ROLES_ENUM },
  token: { type: String },
});

// Creating a Model.
export const User = model<IUser & Document>("User", userSchema);
