import Jwt from "jsonwebtoken";
function userSignin(id:string):string{
    let maxAge: number = 7 * 24 * 60 * 60;
    const token = Jwt.sign({ id }, 'secret id', { expiresIn: maxAge });
    return token
}

export default userSignin;