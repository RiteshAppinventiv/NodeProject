import mongoose from "mongoose";
var url="mongodb://localhost:27017/NewFb";

mongoose.connect(url);
var db=mongoose.connection;

// CONNECTING TO DATABASE:
db.on("error", console.error.bind(console, "connection error:")); //event Listener
db.once("open", function () {    //Event listener 
  console.log("Connection Successful!");
});

export default db;