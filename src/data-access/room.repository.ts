import { userSocketIdLanguageResponse } from "../helpers/room.helper";
import { FilterQuery, PipelineStage, UpdateQuery } from "mongoose";
import { IRoom, Room } from "../models/room.model";

export class RoomRepository {
  public static async createRoom(roomName: string, userId) {
    console.log("Name of the room to be created ==> ", roomName);
    console.log("userId of user who created  the room ==> ", userId);
    return await Room.create({ name: roomName, createdBy: userId });
  }

  public static async findRoomByName(name: string) {
    console.log("queryFields in findRoomByName ==> ", name);
    return await Room.findOne({ name });
  }

  public static async getAllRooms(limit: number, page: number) {
    return await Room.find({})
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();
  }

  public static async countRooms() {
    return await Room.countDocuments();
  }

  public static async deleteRoom(roomName: string) {
    return await Room.findOneAndDelete({ name: roomName });
  }

  public static async findOneAndUpdate(
    filterquery: FilterQuery<IRoom>,
    updateQuery: UpdateQuery<IRoom>
  ) {
    return await Room.findOneAndUpdate(filterquery, updateQuery);
  }

  public static async executeAggregateQuery(
    queryPipeline: PipelineStage[]
  ): Promise<userSocketIdLanguageResponse[]> {
    return await Room.aggregate(queryPipeline);
  }
}
