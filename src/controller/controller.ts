import UserDatail from "../model/userdetail";
import express, { Request, Response } from "express";
import bcrypt from 'bcryptjs';
import Jwt from "jsonwebtoken";
import md5 from "md5";

class connection {
    signup = async (req: Request, res: Response) => {
        try {
            let { username, password, avtar_img, location, phone, status } = req.body;
            const passwordHash =md5(password.toString());
            console.log()
            let newUser = new UserDatail({
                username: username,
                password: passwordHash,
                avtar_img: avtar_img,
                location: location,
                phone: phone,
                status: status
            })

            const data = await newUser.save();
            res.status(200).json({ userdata: data })
        }
        catch (err) {
            if (req.body.username == "") {
                res.status(400).json({ Error: "Invalid Username" })
            }
            else if (req.cookies.username != '') {
                res.status(400).json({ Error: "U r already logged in" })
            }
            else {
                res.status(400).json({ Error: "User Name already Exist..Enter Another UserName" })
            }
        }
    }

    login = async (req: Request, res: Response) => {

        try {
            // GETTING USERNAME AND PASSWORD FROM USER:

            let { username, password } = req.body
            let encryptedPassword: string;
            let passwordmatch: boolean = false;

            // SEARCHING FROM OUR DB:
            let Userdata = await UserDatail.findOne({ username: username });
            if(Userdata?.password==md5(password.toString())){
                passwordmatch=true;
            }
            let id = Userdata?.id.toString();
            if (Userdata == null) {
                res.status(400).json({ Error: "Invalid UserName" })
            }

            if (Userdata?.password == null) {
                encryptedPassword = "";
            }
            else {
                encryptedPassword = Userdata.password.toString()

                // VERIFY PASSWORD:-
                // passwordmatch = await bcrypt.compare(password, encryptedPassword)
                if(Userdata?.password==md5(password.toString())){
                    passwordmatch=true;
                }
                console.log(passwordmatch)
                if (passwordmatch != true) {
                    res.status(400).json({ Error: "Invalid Password" })
                }

                let maxAge: number = 7 * 24 * 60 * 60;
                const token = Jwt.sign({ id }, 'secret id', { expiresIn: maxAge });

                // STORE USER DATA IN BROWSER COOKIES
                res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
                res.cookie('username', Userdata.username, { httpOnly: true, maxAge: maxAge * 1000 })
                res.status(201).json({ user: `Welcome ${Userdata.username}` })

            }
        }
        catch (err) {
            res.status(400).json({ Error: err })
        }
    }

    profile = async (req: Request, res: Response) => {
        const userProfile = await UserDatail.findOne({ username: req.cookies.username })
        res.json({
            username: userProfile?.username,
            avatarImg: userProfile?.avtar_img,
            location: userProfile?.location,
            Phone: userProfile?.phone,
            Status:userProfile?.status
        })
    }

    logout = (req: Request, res: Response) => {
        res.cookie('jwt', '', { maxAge: 1 })
        res.cookie('username', '', { maxAge: 1 })
        res.json({ Status: "Logout Sucessfully" });
    }

    update = async (req: Request, res: Response) => {
        try {
            const oldName = req.cookies.username;
            let maxAge: number = 7 * 24 * 60 * 60;
            const result = await UserDatail.findOne({ username: oldName })
            let { username, password, avtar_img, location, phone, status } = req.body;
            if(username==undefined){
                username=result?.username;
                console.log("User name")
            }
            

            if (password != null) {
                const passwordHash = md5(password.toString());
                console.log("password changed")
                res.cookie('username', username, { httpOnly: true, maxAge: maxAge * 1000 })
                const result = await UserDatail.updateOne({ username: oldName }, {
                    $set: {
                        username: username,
                        password: passwordHash,
                        avtar_img: avtar_img,
                        location: location,
                        phone: phone,
                        status:status
                    }
                });

                res.json({ Status: "Update Sucessfully.." })
                console.log(result)

            }
            else {
                res.cookie('username', username, { httpOnly: true, maxAge: maxAge * 1000 })
                const result = await UserDatail.updateOne({username: oldName},req.body);

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
                const result = await UserDatail.deleteOne({ username: req.cookies.username })
                res.cookie('jwt', '', { maxAge: 1 })
                res.cookie('username', '', { maxAge: 1 })
                console.log(result)
                res.json({ Status: "Delete Sucessfully.." })
            }
        }
        catch (err) { res.json({ Error: err }) }
    }

    status = async (req: Request, res: Response) => {
        if (req.cookies.username !=null) {
            const result = await UserDatail.findOne({ username: req.cookies.username })
            console.log(result?.status)
            if (result?.status){
                res.json({ status: "Activate" })
            }
            else{
                res.json({ status: "Deactivate" })
            }
        }
        else {
            res.json({ status: "plz logged in to view ur status..." })
        }
    }
    deactivate = async (req: Request, res: Response) => {
        if (req.cookies.username != null) {
            const result = await UserDatail.updateOne({ username: req.cookies.username },
                {$set:{status: 0}});
            res.json({status:"Account Deactivate..."})
            console.log(result)
        }
        else {
            res.json({ status: "plz logged in to view ur status..." })
        }
    }

    reactivate = async (req: Request, res: Response) => {
        if (req.cookies.username != null) {
            const result = await UserDatail.updateOne({ username: req.cookies.username },
                {$set:{status: 1}});
            res.json({status:"Account Activate"})
            console.log(result)
        }
        else {
            res.json({ status: "plz logged in to view ur status..." })
        }
    }

    publish=async (req: Request, res: Response) => {

    }
}

export default connection;