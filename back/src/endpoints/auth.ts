import { NextFunction, Response } from "express";
import { AppRequest } from "src/types/request.type";

export default async (req: AppRequest, res: Response, next: NextFunction) => {
  const result = await req.db.auth(req.body.login, req.body.password);
  if (result.error) {
    res.status(400).json(result);
    return;
  }
  res.status(200).send(result);
};
