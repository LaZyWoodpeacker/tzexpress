import { NextFunction, Response } from "express";
import { AppRequest } from "src/types/request.type";

export default async (req: AppRequest, res: Response, next: NextFunction) => {
  if (req.headers?.authorization) {
    const [_, token] = req.headers?.authorization.split(" ");
    const result = await req.db.check(token);
    if (!result.error) {
      req.isAuth = true;
      req.login = result.login;
      req.userId = result.userId;
    }
  }
  next();
};
