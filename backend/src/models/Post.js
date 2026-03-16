import mongoose from "mongoose";
import { POST_STATUS,POST_STATUS_VALUES } from "../constants/postStatus.js";

const PostSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: true,
      trim: true
    },

    descricao: {
      type: String,
      required: true
    },

    autor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // ou "Aluno"
      required: true
    },

    status: {
      type: String,
      enum: POST_STATUS_VALUES,
      default: POST_STATUS.RASCUNHO
    }
  },
  {
    timestamps: {
      createdAt: "dtCriacao",
      updatedAt: "dtAtualizacao"  
    }
  }
);


const post = mongoose.model("Post", PostSchema);

export default post;