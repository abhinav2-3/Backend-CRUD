import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token)
    return res.status(404).json({
      success: false,
      message: "Login First",
    });

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decoded._id);

  next();
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    if (!users || users.length === 0) {
      return res.status(404).json({ success: false, message: "No User Found" });
    }

    return res.status(200).json({ success: true, users });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res
        .status(400)
        .json({ success: false, message: "User Already Exist" });

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create a new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    // Send a success response
    return res
      .status(201)
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000,
      })
      .json({ success: true, message: "User Created Successfully" });
  } catch (error) {
    console.log(error);
    // Handle other errors gracefully
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User Does Not Exist" });
    }
    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Password" });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000,
      })
      .json({ success: true, message: `Welcome Back ${user.name}` });
  } catch (error) {
    console.error("Error in login:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const logout = async (req, res, next) => {
  try {
    res
      .status(200)
      .cookie("token", "", { expires: new Date(Date.now()) })
      .json({
        success: true,
        message: "Logout Successfully",
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteUser = async (req, res, next) => {
  const userId = req.params.id;

  try {
    const user = await User.findByIdAndRemove(userId);

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User Not Found" });

    return res
      .status(200)
      .json({ success: true, message: "User Deleted Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
