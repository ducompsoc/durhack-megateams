import { isPositiveInteger } from "@/server/common/validation";
import { NullError } from "@/server/common/errors";
import createHttpError from "http-errors";
import User from "../../database/users";
import { Request, Response } from "express";

export async function handleGetUserByID(req: Request, res: Response) {
  const {user_id} = req.params;
  if(!isPositiveInteger(user_id)) throw new createHttpError.BadRequest("ID must be a number");
  try{
    res.json((await User.getUser(parseInt(user_id))).getPublicUser()); 
  }catch(error){
    if (error instanceof NullError) throw new createHttpError.NotFound();
    throw error;
  }
}