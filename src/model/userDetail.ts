import {Schema,model} from "mongoose";
import userDatail from "../interface/userModelInterface";

const userSchema=new Schema<userDatail>({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    avtarImg:String,
    location:String,
    phone:{
        type:Number,
        minlength:10
    },
    status:Number
})

const userModel=model<userDatail>("user",userSchema)
export default userModel;