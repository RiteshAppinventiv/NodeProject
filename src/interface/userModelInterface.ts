interface userSignup{
    username:String,
    password:String,
    avtarImg:String,
    location:String,
    phone:Number,
    status:Number
}

  interface userLogin {
    username: string;
    password: string;
  }
  
export {userSignup, userLogin };