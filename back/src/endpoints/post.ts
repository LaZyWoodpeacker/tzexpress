import { Response } from "express";
import { AppRequest } from "src/types/request.type";

export default async (req: AppRequest, res: Response) => {
  const request = await req.db.getPostById(req.params.id);
  console.log(request.error);
  if (request?.error) {
    res.status(400).json(request.post);
  }
  res.status(200).send(request.post);
};
