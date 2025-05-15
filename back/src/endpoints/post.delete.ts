import { Response } from "express";
import { AppRequest } from "src/types/request.type";
import { unlink } from "fs/promises";

export default async (req: AppRequest, res: Response) => {
  try {
    const post = await req.db.getPostById(req.params.id);
    if (req.isAuth && !post?.error && post?.post.author.id === req.userId) {
      post.post.images.forEach((file) => unlink("public/" + file.filename));
      post.post.files.forEach((file) => unlink("public/" + file.filename));
      // @ts-expect-error
      await post.post.deleteOne();
      res.sendStatus(200);
      return;
    }
  } catch (e) {}
  res.sendStatus(400);
};
