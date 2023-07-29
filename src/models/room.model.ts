import { Document, ObjectId, Schema, model } from "mongoose";

export interface IRoomMembers {
  socketId: string;
  email: string;
}

export const roomMembersSchema = new Schema<IRoomMembers>(
  {
    socketId: { type: String },
    email: { type: String },
  },
  {
    _id: false, // we are passing this flag so that _id is not added to members array
  }
);

// interface representing a document in MongoDB.
export interface IRoom {
  name: string;
  members: [IRoomMembers];
  createdBy: ObjectId;
}

// Schema corresponding to the document interface.
export const roomSchema = new Schema<IRoom>({
  name: { type: String, required: true, unique: true }, // roomName will be unique, there can't be multiple rooms with same name
  members: { type: [roomMembersSchema], default: [], maxlength: 5 }, // Rightnow I kept max limit of members that can join one room as 5 as example.
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  //createdBy stores the _id of user who created particular room --> so that if needed we can add functionalities in future
});

// Creating a Model.
export const Room = model<IRoom & Document>("Room", roomSchema);
