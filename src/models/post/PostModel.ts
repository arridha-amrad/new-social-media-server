import { Schema, Model, model } from "mongoose";
import { IPostModel } from "./IPostModel";

const PostSchema = new Schema<IPostModel, Model<IPostModel>>(
  {
    images: [String],
    body: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      }
    ]
  },
  {
    timestamps: true,
  }
);

const PostModel = model<IPostModel>('Post', PostSchema);

export default PostModel;