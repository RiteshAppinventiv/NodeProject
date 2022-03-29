import router from "../api/api";
import db from "../connection/connection";
import UserDatail from "../model/userdetail";
import express from "express"


db
UserDatail
router

const app=express();
app.use(express.json())
app.use(router)
const port=8001

app.listen(port,()=>{
    console.log("Server is running on port no:-"+port)
})