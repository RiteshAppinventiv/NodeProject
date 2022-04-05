import router from "../api/api";
import database from "../connection/connection";
import userDetail from "../model/userDetail";
import express from "express"
import * as dotenv from "dotenv";
dotenv.config({ path: '../../.env'});  

database
userDetail
router

const app=express();
app.use(express.json())
app.use(router)
const port = (process.env.PORT);

app.listen(port,()=>{
    console.log("Server is running on port no:-"+port)
})