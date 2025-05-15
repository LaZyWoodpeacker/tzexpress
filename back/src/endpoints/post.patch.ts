import { Response } from "express";
import { AppRequest } from "src/types/request.type";
import { unlink } from "fs/promises";

export default async (req: AppRequest, res: Response) => {
  const response = await req.db.getPostById(req.params.id);
  if (
    req.isAuth &&
    !response?.error &&
    response.post.author.id === req.userId
  ) {
    const title = req.body.title;
    const text = req.body.text;
    const stateImages = req.body.removedImages
      ? response.post.images.filter(
          (image) => !req.body.removedImages.includes("/" + image.filename)
        )
      : response.post.images;
    console.log(response.post.images, stateImages);
    const stateFiles = req.body.removedFiles
      ? response.post.files.filter(
          (file) => !req.body.removedFiles.includes("/" + file.filename)
        )
      : response.post.files;
    if (req.body.removedImages)
      req.body.removedImages.forEach((file) => unlink("public/" + file));
    if (req.body.removedFiles)
      req.body.removedFiles.forEach((file) => unlink("public/" + file));
    const images =
      "images" in req.files
        ? req.files["images"]
            .map((e) => ({
              name: e.originalname,
              filename: `images/${e.filename}`,
            }))
            .concat(stateImages)
        : stateImages;
    const files =
      "files" in req.files
        ? req.files["files"]
            .map((e) => ({
              name: e.originalname,
              filename: `files/${e.filename}`,
            }))
            .concat(stateFiles)
        : stateFiles;
    const request = await req.db.updatePost(req.params.id, {
      title,
      text,
      images,
      files,
      publish: true,
    });
    res.status(200).json(request);
  } else {
    res.status(401).json({ error: "Не авторизован" });
  }
};
