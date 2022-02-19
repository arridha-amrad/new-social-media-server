import CommentModel from "../models/comment/CommentModel"
import { ICommentModel } from "../models/comment/ICommentModel"
import { AnyKeys, UpdateQuery } from "mongoose"

export const addComment = async (comment: AnyKeys<ICommentModel>) => {
  const newComment = new CommentModel(comment)
  await newComment.save()
  return newComment.populate("owner", "username avatarURL")
}

export const findOneComment = async (commentId: string) => {
  return CommentModel.findById(commentId).populate("owner", "username avatarURL")
}

export const removeComment = async (commentId: string) => {
  return CommentModel.findByIdAndDelete(commentId)
}

export const editComment = async (commentId: string, comment: UpdateQuery<ICommentModel>) => {
  return CommentModel.findByIdAndUpdate(
    commentId,
    comment,
    { new: true },
  )
}
