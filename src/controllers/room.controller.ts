import { IUser } from "../models/user.model";
import { Document } from "mongoose";
import { RoomService } from "../services/room.service";

export class RoomController {
  public static async createRoom(roomName: string, user: IUser & Document) {
    return await RoomService.createRoomInDatabase(roomName, user);
  }

  public static async listOfAllRooms(limit: number, page: number) {
    return await RoomService.roomList(limit, page);
  }

  public static async deleteRoom(roomName: string, user: IUser & Document) {
    return await RoomService.deleteRoom(roomName, user);
  }
}
