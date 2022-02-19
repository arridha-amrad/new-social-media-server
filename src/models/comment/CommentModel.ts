import { Schema, Model, model } from "mongoose"
import { ICommentModel } from "./ICommentModel"

const CommentSchema = new Schema<ICommentModel, Model<ICommentModel>>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post'
    },
    body: {
      type: String,
      required: true
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    timestamps: true
  }
)

const CommentModel = model<ICommentModel>("Comment", CommentSchema)

export default CommentModel;