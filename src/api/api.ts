import express from "express";
import cookieParser from "cookie-parser";
import requireAuth from "../authMiddleware/authMiddleware";
import connection from "../controller/controller";
import userSignupValidator from "../model/validModel";


const connections=new connection();
// CREATING ROUTES

const router=express.Router();
router.use(cookieParser());


router.post('/signup',userSignupValidator,connections.signup)

router.post('/login',connections.login)

router.post('/profile',requireAuth,connections.profile)

router.post('/logout',requireAuth,connections.logout)

router.post('/update',requireAuth,connections.update);

router.post('/delete',requireAuth,connections.delete);

router.post('/status',connections.status);

router.post('/deactivate',connections.deactivate);

router.post('/reactivate',connections.reactivate);

export default router;