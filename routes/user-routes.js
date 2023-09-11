import express from "express";
import {
  deleteUser,
  getAllUsers,
  isAuthenticated,
  login,
  logout,
  signup,
} from "../controllers/user-controls.js";

const router = express.Router();

router.get("/", isAuthenticated, getAllUsers);
router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.delete("/delete/:id", isAuthenticated, deleteUser);

export default router;
