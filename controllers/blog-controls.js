import mongoose, { mongo } from "mongoose";
import Blog from "../models/blogsModel.js";
import User from "../models/userModel.js";

export const getAllBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find();

    if (!blogs || blogs.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Blogs Not Found" });
    }

    return res.status(200).json({ success: true, blogs });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const addBlog = async (req, res, next) => {
  const { title, description, image, user } = req.body;

  try {
    // Create the blog
    const blog = await Blog.create({
      title,
      description,
    });

    return res
      .status(200)
      .json({ success: true, message: "Blog Added Successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateBlog = async (req, res, next) => {
  const { title, description } = req.body;
  const blogId = req.params.id;

  try {
    const blog = await Blog.findByIdAndUpdate(blogId, { title, description });

    if (!blog)
      return res
        .status(500)
        .json({ success: false, message: "Unable to Update" });

    return res
      .status(200)
      .json({ success: true, message: "Blog Updated Successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteBlog = async (req, res, next) => {
  const blogId = req.params.id;

  try {
    const blog = await Blog.findByIdAndRemove(blogId);

    if (!blog)
      return res
        .status(500)
        .json({ success: false, message: "Unable to Delete" });

    return res.status(200).json({ success: true, message: "Blog Deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
