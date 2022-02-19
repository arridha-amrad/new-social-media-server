import { IPostModel } from "../models/post/IPostModel"
import PostModel from "../models/post/PostModel"
import { AnyKeys, UpdateQuery } from "mongoose"

export const save = async (data: AnyKeys<IPostModel>) => {
  const newPost = new PostModel(data)
  const savedPost = await newPost.save()
  return savedPost.populate("owner", "username avatarURL")
}

export const findPosts = async () => {
  return PostModel.find()
    .populate("owner", "username avatarURL")
    .populate("likes", "username avatarURL")
    .populate({
      path: 'comments',
      options: { sort: { createdAt: 'desc' } },
      populate: [
        { path: 'owner', select: 'username avatarURL' },
        { path: 'likes', select: 'username avatarURL' },
      ],
    })
    .sort({ createdAt: 'desc' });
}

export const findOnePost = async (postId: string) => {
  return PostModel.findById(postId)
    .populate('owner', 'username avatarURL')
    .populate('likes', 'username avatarURL')
    .populate({
      path: 'comments',
      options: { sort: { createdAt: 'desc' } },
      populate: [
        { path: 'owner', select: 'username avatarURL' },
        { path: 'likes', select: 'username avatarURL' },
      ],
    });
}

export const removePost = async (postId: string) => {
  return PostModel.findByIdAndDelete(postId)
}

export const editPost = async (postId: string, update?: UpdateQuery<IPostModel> | undefined) => {
  return PostModel.findByIdAndUpdate(postId, update, { new: true }).populate("likes", "username avatarURL")
}