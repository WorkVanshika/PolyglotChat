import { Request, Response } from "express";
import { UserRepository } from "../data-access/user.repository";

export class UserMiddleware {
  public static async authenticateUser(req: Request, res: Response, next) {
    try {
      // authenticating user Identity
      const token = req.headers.authorization;
      if (!token) {
        return res
          .status(401)
          .json({ message: "Authorization token not found!" });
      }

      const user = await UserRepository.findUserBySpecificFields({ token });
      if (!user) {
        return res
          .status(400)
          .json({ message: "User Not found with this token!" });
      }
      // attaching user found from authentication token to request, so that it can be used
      // in later functions
      req.user = user;
      next();
    } catch (Err) {
      console.log("err", Err);
      res.status(401).send({ message: "Something went wrong!" });
    }
  }
}
