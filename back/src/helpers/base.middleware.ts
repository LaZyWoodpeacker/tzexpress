import { NextFunction, Response } from "express";
import { AppRequest } from "src/types/request.type";
import MongooseDb from "src/db.service";

export default (db: MongooseDb) =>
  async (req: AppRequest, res: Response, next: NextFunction) => {
    req.db = db;
    next();
  };
