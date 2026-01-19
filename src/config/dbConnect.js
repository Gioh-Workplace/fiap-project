import mongoose from "mongoose";
import dns from "dns";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

async function conectDatabase() {
  if (!process.env.DB_CONNECTION_STRING) {
    throw new Error("DB_CONNECTION_STRING não definida");
  }

  await mongoose.connect(process.env.DB_CONNECTION_STRING);
  return mongoose.connection;
}

export default conectDatabase;
