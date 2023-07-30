import express, { Express, Request, Response } from "express";
import Mongoose from "mongoose";
const socketIO = require("socket.io");
import http from "http";
const UserRouter = require("./routers/user.route");
const RoomRouter = require("./routers/room.route");
import * as bodyParser from "body-parser";
import path from "path";
import { RoomRepository } from "./data-access/room.repository";
import {
  getQueryPipelineToFetchActiveRoomUsers,
  userSocketIdLanguageResponse,
} from "./helpers/room.helper";
import { translateMessage } from "./helpers/user.helper";

require("dotenv").config();

const app: Express = express();

const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = socketIO(server);

server.listen(port, () => {
  console.log(`Server is running on port ${port} !!`);
});

// using absolute path here & as __dirname gives us current directory, we appended public folder to it.
// Now using express static middleware, we can serve static files from public folder.
// which in this case is index.html
const publicDirectoryPath = path.join(__dirname, "public");
app.use(express.static(publicDirectoryPath));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * Register Routes
 */
app.use("/user", UserRouter);
app.use("/room", RoomRouter);

Mongoose.connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("Connected to database successfully!");
  })
  .catch((err) => {
    console.log("Error in connecting to database", err);
  });

// Socket.IO - Handling of  Socket Events
io.on("connection", (socket) => {
  console.log("New user connected:", socket.id);

  // Handle 'joinRoom' event
  socket.on("joinRoom", async (roomId: string, userEmail: string) => {
    /* here when user joins room, we are attaching roomName along with socketId to identify 
    later that which socket-id was connected in which room
    */
    socket.roomName = roomId;
    console.log("roomId : ", roomId, " userEmail: ", userEmail);
    // the idea here is that whenever any user joins any particular room,
    // we will store it's socketId & userEmail in members array
    await RoomRepository.findOneAndUpdate(
      { name: roomId },
      { $push: { members: { socketId: socket.id, email: userEmail } } }
    );
    // joining the specific room
    socket.join(roomId);
    console.log(
      `User: ${userEmail} with socketId:  ${socket.id} joined room ${roomId}`
    );
  });

  // Handle 'sendMessage' event
  socket.on("sendMessage", async (data) => {
    const { roomId, message, username } = data;
    console.log("sendMessage event catched", roomId, message, username);
    // This aggregatePipeline will return me the aggregateQuery which will result into array of users of this current room
    // along with their preferred language.
    const queryPipeline = getQueryPipelineToFetchActiveRoomUsers(roomId);
    // lets first fetch current members of this specific chatRoom.
    // NOTE: here chatRoom is uniquely identified by their name
    const memebersOfCurrentRoom: Array<userSocketIdLanguageResponse> =
      await RoomRepository.executeAggregateQuery(queryPipeline);
    //Now we will send message to users individually in their preferred language.
    for (let i = 0; i < memebersOfCurrentRoom.length; i++) {
      const msgToBeSent = await translateMessage(
        message,
        memebersOfCurrentRoom[i].preferredLanguage
      );
      console.log("msgToBeSent", msgToBeSent);
      // here we are emitting receiveMessage Event which will be handled on client (frontend) side
      // by giving socketId to `to` method, only specific socket gets that particular message.
      // this way we can send personalized message to all users in their own specific preferredLanguage.
      io.to(memebersOfCurrentRoom[i].socketId).emit("receiveMessage", {
        message: msgToBeSent,
        username,
      });
    }
  });

  // Handling 'disconnect' event which is by default called whenever any socket disconnects
  socket.on("disconnect", async () => {
    console.log(`User ${socket.id} disconnected`);
    // when any socket disconnects, we can know from which room they got disconnected as we added roomName
    // as socket property when they joined any specific room
    console.log("socket.roomName =>", socket.roomName);
    // Removing user-specific details like their socketId from members array of Rooms collection when a user disconnects
    await RoomRepository.findOneAndUpdate(
      { name: socket.roomName },
      { $pull: { members: { socketId: socket.id } } }
    );
    console.log(
      `User info removed for socketId:  ${socket.id} from room:  ${socket.roomName}`
    );
  });
});

app.get("/", async (req: Request, res: Response) => {
  console.log("Test Message!!")!;
  return res.send("Success");
});
