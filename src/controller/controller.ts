import express, { Request, Response } from "express";
import Jwt from "jsonwebtoken";
import md5 from "md5";
import { userLogin, userSignup } from "../interface/userModelInterface";
import userDatail from "../model/userDetail";

class connection {
    signup = async (req: Request, res: Response) => {
        try {
            let { username, password, avtarImg, location, phone, status }: userSignup = req.body;
            const passwordHash = md5(password.toString());
            let newUser = new userDatail({
                username: username,
                password: passwordHash,
                avtarImg: avtarImg,
                location: location,
                phone: phone,
                status: status
            })

            const data = await newUser.save();
            res.status(200).json({ userdata: data })
        }
        catch (err) {
            const userProfile = await userDatail.findOne({ username: req.body.username })
            if (userProfile != null) {
                res.status(400).json({ status: "Username already exist" })
            }
            else if (req.body.username == "") {
                res.status(400).json({ Error: "Invalid Username" })
            }
            else if (req.cookies.username != undefined) {
                res.status(400).json({ Error: "U r already logged in" })
            }
            else {
                res.status(400).json({ Error: err })
            }
        }
    }

    login = async (req: Request, res: Response) => {

        try {
            // GETTING USERNAME AND PASSWORD FROM USER:

            let { username, password }: userLogin = req.body
            let encryptedPassword: string;
            let passwordmatch: boolean = false;

            // SEARCHING FROM OUR DB:
            let userData = await userDatail.findOne({ username: username });
            if (userData?.password == md5(password.toString())) {
                passwordmatch = true;
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
                // passwordmatch = await bcrypt.compare(password, encryptedPassword)
                if (userData?.password == md5(password.toString())) {
                    passwordmatch = true;
                }
                console.log(passwordmatch)
                if (passwordmatch != true) {
                    res.status(400).json({ Error: "Invalid Password" })
                }

                let maxAge: number = 7 * 24 * 60 * 60;
                const token = Jwt.sign({ id }, 'secret id', { expiresIn: maxAge });

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
        const userProfile = await userDatail.findOne({ username: req.cookies.username })
        res.json({
            username: userProfile?.username,
            avatarImg: userProfile?.avtar_img,
            location: userProfile?.location,
            Phone: userProfile?.phone,
            Status: userProfile?.status
        })
    }

    logout = (req: Request, res: Response) => {
        res.cookie('jwt', '', { maxAge: 1 })
        res.cookie('username', '', { maxAge: 1 })
        res.json({ Status: "Logout Sucessfully" });
    }

    update = async (req: Request, res: Response) => {
        try {
            const oldName: string = req.cookies.username;
            let maxAge: number = 7 * 24 * 60 * 60;
            const result = await userDatail.findOne({ username: oldName })
            let { username, password, avtarImg, location, phone, status } = req.body;
            if (username == undefined) {
                username = result?.username;
                console.log("User name")
            }

            if (password != null) {
                const passwordHash = md5(password.toString());
                console.log("password changed")
                res.cookie('username', username, { httpOnly: true, maxAge: maxAge * 1000 })
                const result = await userDatail.updateOne({ username: oldName }, {
                    $set: {
                        username: username,
                        password: passwordHash,
                        avtarImg: avtarImg,
                        location: location,
                        phone: phone,
                        status: status
                    }
                });

                res.json({ Status: "Update Sucessfully.." })
                console.log(result)

            }
            else {
                res.cookie('username', username, { httpOnly: true, maxAge: maxAge * 1000 })
                const result = await userDatail.updateOne({ username: oldName }, req.body);

                res.json({ Status: "Update Sucessfully.." })
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
                const result = await userDatail.deleteOne({ username: req.cookies.username })
                res.cookie('jwt', '', { maxAge: 1 })
                res.cookie('username', '', { maxAge: 1 })
                console.log(result)
                res.json({ Status: "Delete Sucessfully.." })
            }
        }
        catch (err) { res.json({ Error: err }) }
    }

    status = async (req: Request, res: Response) => {
        if (req.cookies.username != null) {
            const result = await userDatail.findOne({ username: req.cookies.username })
            console.log(result?.status)
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
            const result = await userDatail.updateOne({ username: req.cookies.username },
                { $set: { status: 0 } });
            res.json({ status: "Account Deactivate..." })
            console.log(result)
        }
        else {
            res.json({ status: "plz logged in to view ur status..." })
        }
    }

    reactivate = async (req: Request, res: Response) => {
        if (req.cookies.username != null) {
            const result = await userDatail.updateOne({ username: req.cookies.username },
                { $set: { status: 1 } });
            res.json({ status: "Account Activate" })
            console.log(result)
        }
        else {
            res.json({ status: "plz logged in to view ur status..." })
        }
    }
}

export default connection;