import { Response } from "express";
import { AppRequest } from "src/types/request.type";

export default async (req: AppRequest, res: Response) => {
  const request = await req.db.getPost();
  if (request.error) {
    res.status(400).json(request);
  }
  res.status(200).send(request);
};
