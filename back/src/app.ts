import MongooseDb from "./db.service";
import express from "express";
import fileUploadMiddleware from "./helpers/file.middleware";
import baseMiddleware from "./helpers/base.middleware";
import authMiddleware from "./helpers/auth.middleware";
import register from "./endpoints/register";
import post from "./endpoints/post";
import auth from "./endpoints/auth";
import check from "./endpoints/check";
import clear from "./endpoints/clear";
import posts from "./endpoints/posts";
import postAdd from "./endpoints/post.add";
import postPatch from "./endpoints/post.patch";
import postDelete from "./endpoints/post.delete";

const app = async () => {
  const db = await MongooseDb.init();
  const app = express();
  const port = process.env.PORT || 3000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));
  app.use(express.static("public"));
  app.use(baseMiddleware(db));

  app.get("/api/clear", clear);
  app.post("/api/user/registration", register);
  app.post("/api/user/auth", auth);
  app.get("/api/user/check", authMiddleware, check);
  app.get("/api/news", posts);
  app.post("/api/news", authMiddleware, fileUploadMiddleware, postAdd);
  app.get("/api/news/:id", post);
  app.delete("/api/news/:id", authMiddleware, postDelete);
  app.patch("/api/news/:id", authMiddleware, fileUploadMiddleware, postPatch);

  app.listen(port, () => console.log(`Running on port ${port}`));
};

app();
