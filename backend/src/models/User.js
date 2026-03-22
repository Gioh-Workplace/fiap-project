import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    senha: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["professor", "aluno"],
      required: true
    }
  },
  {
    timestamps: true,
    collection: "users"
  }
);

export default mongoose.model("User", UserSchema);