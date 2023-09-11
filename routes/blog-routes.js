import express from "express";
import {
  addBlog,
  deleteBlog,
  getAllBlogs,
  updateBlog,
} from "../controllers/blog-controls";
import { isAuthenticated } from "../controllers/user-controls";

const blogRouter = express.Router();

blogRouter.get("/", isAuthenticated, getAllBlogs);
blogRouter.post("/add", isAuthenticated, addBlog);
blogRouter.put("/update/:id", isAuthenticated, updateBlog);
blogRouter.delete("/delete/:id", isAuthenticated, deleteBlog);

export default blogRouter;
