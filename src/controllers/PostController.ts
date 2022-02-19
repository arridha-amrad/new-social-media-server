import { Request, Response } from "express";
import { upload } from "../utils/CloudinaryUploader";
import fs from "fs"
import { UploadedFile } from "express-fileupload"
import { editPost, findOnePost, findPosts, removePost, save } from "../services/PostService";
import { addComment, editComment, findOneComment, removeComment } from "../services/CommentService";

export const createPost = async (req: Request, res: Response) => {
  const { body } = req.body
  const files = req.files?.images as UploadedFile[]
  if (files) {
    if (files.length > 5) {
      files.forEach((file) => fs.unlinkSync(file.tempFilePath))
      return res.status(400).send("maximum photo is 5")
    }

    const filteredImages = files.filter((file) => file.size > 1000 * 1000)

    if (filteredImages.length > 0) {
      files.forEach((file) => fs.unlinkSync(file.tempFilePath))
      return res.status(400).send("maximum a file size 1MB")
    }
    try {
      const imagesURL: string[] = []
      for (let file of files) {
        const res = await upload(file.tempFilePath, "posts")
        if (res) {
          imagesURL.push(res?.url)
        }
      }
      const newPost = await save({
        body,
        owner: req.userId,
        images: imagesURL,
      })
      files.forEach((file) => fs.unlinkSync(file.tempFilePath))
      return res.status(200).json({ post: newPost })
    } catch (err) {
      console.log(err)
      return res.sendStatus(500)
    }
  }
}

export const getPosts = async (_: Request, res: Response) => {
  try {
    const posts = await findPosts()
    return res.status(200).json({ posts })
  } catch (err) {
    console.log(err);
    return res.sendStatus(500)
  }
}

export const getPostById = async (req: Request, res: Response) => {
  const { postId } = req.params
  try {
    const post = await findOnePost(postId)
    return res.status(200).json({ post })
  } catch (err) {
    console.log(err)
    return res.sendStatus(500)
  }
}

export const deletePost = async (req: Request, res: Response) => {
  const { postId } = req.params
  try {
    const post = await findOnePost(postId)
    if (post?.owner._id.toString() === req.userId) {
      const result = await removePost(postId)
      if (!result) {
        return res.sendStatus(404)
      }
      return res.status(200).send("deleted")
    }
    return res.sendStatus(403)
  } catch (err) {
    console.log(err);
    return res.sendStatus(500)
  }
}

export const updatePost = async (req: Request, res: Response) => {
  const { postId } = req.params
  try {
    const post = await findOnePost(postId)
    if (post?.owner._id.toString() === req.userId) {
      const updatedPost = await editPost(postId, { ...req.body })
      return res.status(200).json({ post: updatedPost })
    }
    return res.sendStatus(403)

  } catch (err) {
    console.log(err)
    return res.sendStatus(500)
  }
}

export const likePost = async (req: Request, res: Response) => {
  const likeSender = req.userId
  const { postId } = req.params
  try {

    const post = await findOnePost(postId)

    const isLiked = post?.likes.find((user) => user._id?.toString() === likeSender)

    const updatedPost = await editPost(postId, isLiked ? (
      { $pull: { likes: likeSender } }
    ) : (
      { $push: { likes: likeSender } }
    ))

    return res.status(200).json({ post: updatedPost })

  } catch (err) {
    console.log(err)
    return res.sendStatus(500)
  }
}

export const createComment = async (req: Request, res: Response) => {
  const { postId } = req.params
  const commentUser = req.userId
  const { body } = req.body

  try {
    const post = await findOnePost(postId)
    if (post) {
      const newComment = await addComment({
        body,
        post: postId,
        owner: commentUser
      })
      post.comments.push(newComment)
      await post.save()
      return res.status(200).json({ comment: newComment })
    }
    return res.sendStatus(404)

  } catch (err) {
    console.log(err)
    return res.sendStatus(500)
  }
}

export const deleteComment = async (req: Request, res: Response) => {
  const userId = req.userId
  const { commentId } = req.params
  try {
    const comment = await findOneComment(commentId)
    if (comment) {
      if (comment.owner._id.toString() === userId) {
        await removeComment(commentId)
        return res.status(200).send("deleted")
      }
    }
    return res.sendStatus(404)
  } catch (err) {
    console.log(err)
    return res.sendStatus(500)
  }
}

export const updateComment = async (req: Request, res: Response) => {
  const { commentId } = req.params
  const { body } = req.body
  try {
    const comment = await findOneComment(commentId)
    if (comment) {
      comment.body = body
      const updatedComment = await comment.save()
      return res.status(200).json({ comment: updatedComment })
    }
    return res.sendStatus(400)
  } catch (err) {
    console.log(err)
    return res.sendStatus(500)
  }
}

export const likeComment = async (req: Request, res: Response) => {
  const likeSender = req.userId
  const { commentId } = req.params
  try {
    let comment = await findOneComment(commentId)
    if (comment) {
      const isLiked = comment.likes.find((user) => user._id?.toString() === likeSender)
      const updatedComment = await editComment(commentId, isLiked ?
        {
          $pull: { likes: likeSender }
        }
        :
        {
          $push: { likes: likeSender }
        }
      )
      return res.status(200).json({ comment: updatedComment })
    }
  } catch (err) {
    console.log(err)
    return res.sendStatus(500)
  }
}