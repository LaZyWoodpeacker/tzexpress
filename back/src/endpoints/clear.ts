import { Response } from "express";
import { AppRequest } from "src/types/request.type";

export default async (req: AppRequest, res: Response) => {
  req.db.clear();
  res.sendStatus(200);
};
