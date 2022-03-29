import {Schema,model} from "mongoose";

interface UserDatail{
    username:String,
    password:String,
    avtar_img:String,
    location:String,
    phone:Number,
    status:Number
}

const userschema=new Schema<UserDatail>({
    username:{
        type:String,
        required:[true,'Please enter UserName'],
        unique:true
    },
    password:{
        type:String,
        required:[true,'Please enter Password'],
        minlength:[6,"Minimum password length is 6 characters"]
    },
    avtar_img:String,
    location:String,
    phone:{
        type:Number,
        minlength:10
    },
    status:Number
})

const UserDatail=model<UserDatail>("user1",userschema)
export default UserDatail;