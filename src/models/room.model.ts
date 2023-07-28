import { Document, ObjectId, Schema, model } from "mongoose";

// interface representing a document in MongoDB.
export interface IRoom {
  name: string;
  members: ObjectId[];
  createdBy: ObjectId;
}

// Schema corresponding to the document interface.
export const roomSchema = new Schema<IRoom>({
  name: { type: String, required: true, unique: true }, // roomName will be unique, there can't be multiple rooms with same name
  members: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }], // Reference to User model for room members
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  //createdBy stores the _id of user who created particular room --> so that if needed we can add functionalities in future
});

// Creating a Model.
export const Room = model<IRoom & Document>("Room", roomSchema);
