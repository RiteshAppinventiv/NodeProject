import Jwt from "jsonwebtoken";
import express,{NextFunction, Request,Response} from "express";
const requireAuth=(req:Request,res:Response,next:NextFunction)=>{
    const token=req.cookies.jwt;
    if(token){
        Jwt.verify(token,'secret id',(err:any,decodedToken:any)=>{
            if(err){
                res.json({Error:"Please Login Again"})        
            }
            else{
                console.log(decodedToken);
                next();
            }
        })
    }
    else{
        res.json({Error:"Please Login Again"})    }
}

export default requireAuth; 