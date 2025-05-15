import { Response } from "express";
import { AppRequest } from "src/types/request.type";

export default async (req: AppRequest, res: Response) => {
  const request = await req.db.registration(req.body.login, req.body.password);
  if (request.error) {
    res.status(400).json(request);
    return;
  }
  res.status(201).send(request);
};
