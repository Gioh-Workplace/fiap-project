import mongoose from "mongoose";
import dns from "dns";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

async function conectDatabase(){
 mongoose.connect(process.env.DB_CONNECTION_STRING);
 //console.log("DB:", mongoose.connection.name)
    return mongoose.connection;

};

export default conectDatabase;


