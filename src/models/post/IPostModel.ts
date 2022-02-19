import { Types } from "mongoose"
import { ICommentModel } from "../comment/ICommentModel";
import { IUserModel } from "../user/IUserModel";

export interface IPostModel {
  owner: Types.ObjectId
  images: Types.Array<string>
  body: string
  comments: Types.DocumentArray<ICommentModel>
  likes: Types.DocumentArray<IUserModel>
  createdAt: Date
  updatedAt: Date
}