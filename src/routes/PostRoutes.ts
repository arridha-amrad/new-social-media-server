import express from "express"
import { createComment, createPost, deleteComment, deletePost, getPostById, getPosts, likeComment, likePost, updateComment, updatePost } from "../controllers/PostController"
import { verifyAccessToken } from "../services/JwtServices"

const router = express.Router()

router.get("/", getPosts)
router.get("/:postId", getPostById)

router.post("/create", verifyAccessToken, createPost)
router.post("/like/:postId", verifyAccessToken, likePost)
router.post("/comment/:postId", verifyAccessToken, createComment)
router.post("/comment/like/:commentId", verifyAccessToken, likeComment)

router.delete("/:postId", verifyAccessToken, deletePost)
router.delete("/comment/:commentId", verifyAccessToken, deleteComment)

router.put("/:postId", verifyAccessToken, updatePost)
router.put("/comment/:commentId", verifyAccessToken, updateComment)

export default router