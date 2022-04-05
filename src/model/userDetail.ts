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

// userschema.pre('save',function(){
//     console.log(this.username)
//     // console.log("before save ",this)
// })
userschema.post("save",function(doc){
    doc.password=undefined
    doc.__v=undefined
})

const UserDatail=model<UserDatail>("users",userschema)


export default UserDatail;