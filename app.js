import express from "express";
import mongoose from "mongoose";
import router from "./routes/user-routes.js";
import blogRouter from "./routes/blog-routes.js";
import cookieParser from "cookie-parser";
import { config } from "dotenv";

const app = express();

config({
  path: "./data/config.env",
});

app.use(express.json());
app.use(cookieParser());
app.use("/api/user", router);
app.use("/api/blog", blogRouter);

app.use("/", (req, res) => {
  res.send("Abhinav");
});

mongoose
  .connect("mongodb://127.0.0.1:27017", { dbName: "socialmedia" })
  .then(() => console.log("Database is Connected"))
  .then(() =>
    app.listen(3000, () => {
      console.log(`Server is Running on http://localhost:3000`);
    })
  );
