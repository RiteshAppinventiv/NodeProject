import userModel from "../model/userDetail";
import { Request, Response } from "express";
import Jwt from "jsonwebtoken";
import md5 from "md5";
import userSignin from "../jwt/userLogin.jwt";


class userConnection {
    signup = async (req: Request, res: Response) => {
        try {
            let { username, password, avtarImg, location, phone, status } = req.body;
            const passwordHash:string = md5(password.toString());
            let newUser = new userModel({
                username: username,
                password: passwordHash,
                avtarImg: avtarImg,
                location: location,
                phone: phone,
                status: status
            })
            // UPDATE USER DATA IN OUR DATABASE 
            const data = await newUser.save();
            res.status(200).json({ userData: data })
        }
        catch (err) {
            if (req.body.username == "") {
                res.status(400).json({ Error: "user name is invalid"})
            }
            else if (req.cookies.username != '') {
                res.status(400).json({ Error: "User name already exist"})
            }
            else {
                res.status(400).json({ Error: err})
            }
        }
    }

    login = async (req: Request, res: Response) => {

        try {
            // GETTING USERNAME AND PASSWORD FROM USER:

            let { username, password } = req.body
            let encryptedPassword: string;
            let isPasswordMatch: boolean = false;

            // SEARCHING FROM OUR DB:
            let userData = await userModel.findOne({ username: username });
            if (userData?.password == md5(password.toString())) {
                isPasswordMatch = true;
            }
            let id = userData?.id.toString();
            if (userData == null) {
                res.status(400).json({ Error: "Invalid UserName" })
            }

            if (userData?.password == null) {
                encryptedPassword = "";
            }
            else {
                encryptedPassword = userData.password.toString()

                // VERIFY PASSWORD:-

                if (userData?.password == md5(password.toString())) {
                    isPasswordMatch = true;
                }
                if (!isPasswordMatch) {
                    res.status(400).json({ Error: "Invalid Password" })
                }

                let maxAge: number = 7 * 24 * 60 * 60;
                const token=userSignin(id)
                // STORE USER DATA IN BROWSER COOKIES
                res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
                res.cookie('username', userData.username, { httpOnly: true, maxAge: maxAge * 1000 })
                res.status(201).json({ user: `Welcome ${userData.username}` })

            }
        }
        catch (err) {
            res.status(400).json({ Error: err })
        }
    }

    profile = async (req: Request, res: Response) => {
        const userProfile = await userModel.findOne({username:req.cookies.username})
        res.json({
            username: userProfile?.username,
            avatarImg: userProfile?.avtarImg,
            location: userProfile?.location,
            phone: userProfile?.phone,
            status: userProfile?.status
        })
    }

    logout = (req: Request, res: Response) => {
        res.cookie('jwt', '', { maxAge: 1 })
        res.cookie('username', '', { maxAge: 1 })
        res.json({ Status: "Logout sucessfully" });
    }

    update = async (req: Request, res: Response) => {
        try {
            const oldName: string = req.cookies.username;
            let maxAge: number = 7 * 24 * 60 * 60;
            let { username, password, avtarImg, location, phone, status } = req.body;

            if (password != null) {
                const passwordHash = md5(password.toString());
                console.log("password changed")
                res.cookie('username', username, { httpOnly: true, maxAge: maxAge * 1000 })
                const result = await userModel.updateOne({ username: oldName }, {
                    $set: {
                        username: username,
                        password: passwordHash,
                        avtarImg: avtarImg,
                        location: location,
                        phone: phone,
                        status: status
                    }
                });

                res.json({ Status: "Update Sucessfully..."})
                console.log(result)

            }
            else {
                res.cookie('username', username, { httpOnly: true, maxAge: maxAge * 1000 })
                const result = await userModel.updateOne({ username: oldName }, req.body);

                res.json({ Status: "Update Sucessfully..."})
                console.log(result)
            }
        } catch (err) {
            res.json({ Error: err })
        }
    }

    delete = async (req: Request, res: Response) => {
        try {
            if (req.cookies.username == "") {
                res.json({ Status: "Please login for delete Your account" })
            }
            else {
                const result = await userModel.deleteOne({ username: req.cookies.username })
                res.cookie('jwt', '', { maxAge: 1 })
                res.cookie('username', '', { maxAge: 1 })
                res.json({ Status: "Delete Sucessfully.." })
            }
        }
        catch (err) { res.json({ Error: err }) }
    }

    status = async (req: Request, res: Response) => {
        if (req.cookies.username != null) {
            const result = await userModel.findOne({ username: req.cookies.username })
            if (result?.status) {
                res.json({ status: "Activate" })
            }
            else {
                res.json({ status: "Deactivate" })
            }
        }
        else {
            res.json({ status: "plz logged in to view ur status..." })
        }
    }

    deactivate = async (req: Request, res: Response) => {
        if (req.cookies.username != null) {
            const result = await userModel.updateOne({ username: req.cookies.username },
                { $set: { status: 0 } });
            res.json({ status: "Account Deactivate..." })
        }
        else {
            res.json({ status: "Please Login..."})
        }
    }

    reactivate = async (req: Request, res: Response) => {
        if (req.cookies.username != null) {
            const result = await userModel.updateOne({ username: req.cookies.username },
                { $set: { status: 1 } });
            res.json({ status: "Account Activate" })
        }
        else {
            res.json({ status: "Please Login..."})
        }
    }
}

export default userConnection;