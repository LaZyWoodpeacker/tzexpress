import { Mongoose, Schema, model, connect, Types } from "mongoose";
import bcrypt from "bcrypt";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { IBase } from "./types/base.interface";

export interface IUser {
  login: string;
  hash: string;
}

export interface IPost {
  title: string;
  text: string;
  images: { name: string; filename: string }[];
  files: { name: string; filename: string }[];
  publish: boolean;
  author: Types.ObjectId;
}

const userScheme = new Schema<IUser>(
  { login: String, hash: String },
  { versionKey: false }
);

const postScheme = new Schema<IPost>(
  {
    title: String,
    text: String,
    images: Array<{ name: String; filename: String }>,
    files: Array<{ name: String; filename: String }>,
    publish: Boolean,
    author: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { versionKey: false }
);

const Post = model("Post", postScheme);
const User = model("User", userScheme);

export default class MongooseDb implements IBase {
  private secret = process.env.TOKEN || "secret";
  constructor(private connection: Mongoose) {}

  static async init(): Promise<MongooseDb> {
    try {
      const connection = await connect(
        process.env.MONGO_PATH || "mongodb://127.0.0.1:27017"
      );
      return new MongooseDb(connection);
    } catch (err) {
      console.log(err);
    }
  }

  getToken(id) {
    return jwt.sign({ id }, this.secret, {
      expiresIn: "1h",
    });
  }

  async getUsers() {
    return User.find({});
  }

  async registration(
    login: string,
    password: string
  ): Promise<{ login?: string; token?: string; error?: string }> {
    try {
      const user = await User.findOne({ login });
      if (user) return { error: "Уже есть такой login" };
      const hash = await bcrypt.hash(password, 10);
      const newUser = new User({ hash, login });
      await newUser.save();
      const token = this.getToken(newUser.id);
      return {
        login,
        token,
      };
    } catch (e) {
      return { error: e.message };
    }
  }

  async clear() {
    await User.deleteMany();
    await Post.deleteMany();
  }

  async auth(
    login: string,
    password: string
  ): Promise<{ error?: string; login?: string; token?: string }> {
    try {
      const user = await User.findOne({ login });
      if (!user) return { error: "Пользователь не найден" };
      if (await bcrypt.compare(password, user.hash)) {
        return { login: user.login, token: this.getToken(user.id) };
      }
      return { error: "Неверный пароль" };
    } catch (e) {
      return { error: e.message };
    }
  }

  async check(
    token: string
  ): Promise<{ error?: string; login?: string; userId?: string }> {
    try {
      const { id } = (await jwt.verify(
        token,
        process.env.TOKEN || "secret"
      )) as { id: string };
      const user = await User.findById(id);
      if (!user) return { error: "Нет такого пользователя" };
      return { login: user.login, userId: user.id };
    } catch (e) {
      if (e instanceof JsonWebTokenError) {
        return { error: "Неверный токен" };
      }
      return { error: e.message };
    }
  }

  async getPost(): Promise<{ error?: string; posts?: any[] }> {
    try {
      return {
        posts: await Post.find({}).populate<{ author: IUser }>("author"),
      };
    } catch (e) {
      return { error: e.message };
    }
  }

  async getPostById(id: string): Promise<{
    error?: string;
    post?: Omit<IPost, "author"> & { author: IUser & { id: string } };
  }> {
    try {
      return {
        // @ts-expect-error
        post: await Post.findById(id).populate<{ author: IUser }>("author"),
      };
    } catch (e) {
      return { error: e.message };
    }
  }

  async addPost(
    userId: string,
    dto: Omit<IPost, "author">
  ): Promise<{ error?: string; post?: string }> {
    try {
      const newPost = new Post({ ...dto, author: new Types.ObjectId(userId) });
      await newPost.save();
      return { post: newPost.id };
    } catch (e) {
      return { error: e.message };
    }
  }

  async updatePost(postId: string, dto: Partial<IPost>) {
    try {
      const newPost = await Post.findByIdAndUpdate(
        new Types.ObjectId(postId),
        dto
      );
      return { post: newPost.id };
    } catch (e) {
      return { error: e.message };
    }
  }

  async removePost(postId: string) {
    try {
      await Post.findByIdAndDelete(postId);
      return { post: postId };
    } catch (e) {
      return { error: e.message };
    }
  }
}
