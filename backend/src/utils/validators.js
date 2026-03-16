import mongoose from "mongoose";

export function validarObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}
