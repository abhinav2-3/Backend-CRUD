import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userShema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
    minlength: 7,
  },
});
export default mongoose.model("User", userShema);
