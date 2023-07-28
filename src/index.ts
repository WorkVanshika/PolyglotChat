import express, { Express, Request, Response } from "express";
import Mongoose from "mongoose";
import http from "http";
const UserRouter = require("./routers/user.route");
import * as bodyParser from "body-parser";

require("dotenv").config();

const app: Express = express();

const port = process.env.PORT || 8000;
const server = http.createServer(app);
server.listen(port, () => {
  console.log(`Server is running on port ${port} !!`);
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * Register Routes
 */
app.use("/user", UserRouter);

Mongoose.connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("Connected to database successfully!");
  })
  .catch((err) => {
    console.log("Error in connecting to database", err);
  });

app.get("/", (req: Request, res: Response) => {
  console.log("Test Message!!")!;
  return res.send("Success");
});
