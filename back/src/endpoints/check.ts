import { Response } from "express";
import { AppRequest } from "src/types/request.type";

export default async (req: AppRequest, res: Response) => {
  if (!req.isAuth) {
    res.status(401).json({ error: "Не авторизован" });
    return;
  }
  res.status(200).json({ login: req.login });
};
