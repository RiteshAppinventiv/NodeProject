import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config({ path: '../../.env'});

var url:string=String(process.env.databaseUrl);

// DATABASE CONNECTION

console.log()
mongoose.connect(url);
var databaseConnection=mongoose.connection;

// CONNECTING TO DATABASE:
databaseConnection.on("error", console.error.bind(console, "connection error:")); //event Listener
databaseConnection.once("open", function () {    //Event listener 
  console.log("Connection Successful!");
});

export default databaseConnection;