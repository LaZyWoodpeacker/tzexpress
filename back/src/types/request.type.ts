import { Request } from "express";
import { IBase } from "./base.interface";

export type AppRequest = Request & {
  isAuth: boolean;
  login?: string;
  userId: string;
  db: IBase;
  files: {
    images: {
      filename: string;
      originalname: string;
    }[];
    files: { filename: string; originalname: string }[];
  };
};
