import { Document } from "mongoose";
import { RoomRepository } from "../data-access/room.repository";
import { IUser } from "../models/user.model";
import { USER_ROLES_ENUM } from "../helpers/user.helper";

export class RoomService {
  /* This function is for registering different users in our system
   */
  public static async createRoomInDatabase(
    roomName: string,
    user: IUser & Document
  ): Promise<{
    status: number;
    message: string;
  }> {
    try {
      const room = await RoomRepository.findRoomByName(roomName);
      if (room) {
        return {
          status: 400,
          message: "Room with same name already exists!",
        };
      }

      await RoomRepository.createRoom(roomName, user._id);
      return {
        status: 200,
        message: "Room Created successfully!!",
      };
    } catch (err) {
      console.log("err", err);
      return {
        status: 500,
        message: "Room creation failed ! Please try again after sometime. ",
      };
    }
  }

  /* This function is for fetching the list of rooms that are currently available in our system.
  This API is paginated too.  
  */
  public static async roomList(
    limit: number,
    page: number
  ): Promise<{
    status: number;
    message: string;
    data?: { roomsArray: string[]; totalPages: number; currentPage: number };
  }> {
    try {
      console.log("limit received: ", limit, "page value received: ", page);
      if (page === 0) {
        page = 1; // correcting the page param before making db operation
      }
      if (limit === 0) {
        limit = 10; // correcting the limit param before making db operation
      }
      const rooms = await RoomRepository.getAllRooms(limit, page);
      const totalRooms = await RoomRepository.countRooms();
      const roomsArray = rooms.map((room) => room.name);
      return {
        status: 200,
        message: "Room fetching successful!",
        data: {
          roomsArray,
          totalPages: Math.ceil(totalRooms / limit),
          currentPage: page,
        },
      };
    } catch (err) {
      console.log("err", err);
      return {
        status: 500,
        message: "Something went Wrong while fetching rooms!",
      };
    }
  }

  /* This function is for deleting rooms from our system
  This operation can only be performed by Admin user 
   */
  public static async deleteRoom(
    roomName: string,
    requestUser: IUser & Document
  ): Promise<{
    status: number;
    message: string;
  }> {
    try {
      //authorizing the user. we are only allowing admins to directly delete rooms.
      if (requestUser.role !== USER_ROLES_ENUM.ADMIN) {
        return {
          status: 403,
          message: "Only Admins can delete rooms directly.",
        };
      }
      const roomDetails = await RoomRepository.findRoomByName(roomName);
      if (!roomDetails) {
        return {
          status: 400,
          message: "No such room exists!",
        };
      }
      if (roomDetails.members.length) {
        return {
          status: 400,
          message:
            "Can't delete this room as there are members currently chatting in this room!",
        };
      }

      await RoomRepository.deleteRoom(roomName);
      return {
        status: 200,
        message: "Room deletion successful!!",
      };
    } catch (err) {
      console.log("err", err);
      return {
        status: 500,
        message: "Room deletion failed !! ",
      };
    }
  }
}
