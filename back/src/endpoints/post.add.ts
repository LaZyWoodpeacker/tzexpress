import { Response } from "express";
import { AppRequest } from "src/types/request.type";

export default async (req: AppRequest, res: Response) => {
  if (req.isAuth) {
    const title = req.body.title;
    const text = req.body.text;
    const images =
      "images" in req.files
        ? req.files["images"].map((e) => ({
            name: e.originalname,
            filename: `images/${e.filename}`,
          }))
        : [];
    const files =
      "files" in req.files
        ? req.files["files"].map((e) => ({
            name: e.originalname,
            filename: `files/${e.filename}`,
          }))
        : [];
    const request = await req.db.addPost(req.userId, {
      title,
      text,
      images,
      files,
      publish: false,
    });
    res.status(201).json(request);
    return;
  }
  res.status(401).send({ error: "Не авторизован" });
};
