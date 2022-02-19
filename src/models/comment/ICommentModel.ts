import { Types } from "mongoose"
import { IUserModel } from "../user/IUserModel";

export interface ICommentModel {
  owner: Types.ObjectId
  post: Types.ObjectId
  body: string
  likes: Types.DocumentArray<IUserModel>
  createdAt: Date
  updatedAt: Date
}