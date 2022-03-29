import express,{Request,Response} from "express";
import cookieParser from "cookie-parser";
import requireAuth from "../authMiddleware/authMiddleware";
import connection from "../controller/controller";

const newconnection=new connection();
// CREATING ROUTES

const router=express.Router();
router.use(cookieParser());

router.post('/signup',newconnection.signup)

router.post('/login',newconnection.login)

router.post('/profile',requireAuth,newconnection.profile)

router.post('/logout',requireAuth,newconnection.logout)

router.post('/update',requireAuth,newconnection.update);

router.post('/delete',requireAuth,newconnection.delete);

router.post('/status',newconnection.status);

router.post('/deactivate',newconnection.deactivate);

router.post('/reactivate',newconnection.reactivate);

export default router;