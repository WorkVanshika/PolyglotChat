import express, { Request, Response } from "express";
import { RoomController } from "../controllers/room.controller";
import { customValidate } from "../helpers/common.helper";
import * as RoomValidators from "../validators/room.validator";
import { UserMiddleware } from "../middlewares/user.middleware";

const router = express.Router();

router.post(
  "/create",
  UserMiddleware.authenticateUser,
  customValidate(RoomValidators.createRoomValidator()),
  async function (req: Request, res: Response) {
    const roomCreationResponse = await RoomController.createRoom(
      req.body.roomName,
      req.user
    );
    return res.status(roomCreationResponse.status).json({
      message: roomCreationResponse.message,
    });
  }
);

router.get(
  "/",
  UserMiddleware.authenticateUser,
  customValidate(RoomValidators.getRoomsListValidator()),
  async function (req: Request, res: Response) {
    const roomListResponse = await RoomController.listOfAllRooms(
      Number(req.query.limit || 10),
      Number(req.query.page || 1)
    );
    return res.status(roomListResponse.status).json({
      message: roomListResponse.message,
      data: roomListResponse.data,
    });
  }
);

router.delete(
  "/",
  UserMiddleware.authenticateUser,
  customValidate(RoomValidators.deleteRoomValidator()),
  async function (req: Request, res: Response) {
    const roomListResponse = await RoomController.deleteRoom(
      req.query.roomName,
      req.user
    );
    return res.status(roomListResponse.status).json({
      message: roomListResponse.message,
    });
  }
);
module.exports = router;
