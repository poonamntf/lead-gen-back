require('dotenv').config()
const bcrypt = require('bcrypt')
const User = require('../model/userModel')

exports.registration = async (req, res) => {
    try {
        const {  email } = req.body;
       
        const checkUser = await User.findOne({ email: email });
        if (checkUser) {
            return res.status(403).json({ msg: "user already exist " })
        }
        const user = new User(req.body);
        if (!user) {
            return res.status(404).json({ msg: "something went wrong" })
        }
        const savedUser = await user.save();
        if (!savedUser) {
            return res.status(401).json({ msg: "user not saved " })
        }
        res.status(201).json({ savedUser, msg: "user signup successfully" });
    }
    catch (error) {
        res.status(500).json({ msg: "user registrationn faild" })
    }
}

exports.login = async (req, res) => {
    try {
        console.log("reqbody>>>",req.body)
        const { email, password } = req.body;
        if (email == null || password == null) {
            return res.status(403).json({ msg: "please fill all field" })
        }
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(401).json({ msg: "user not exist" })
        }
        console.log("user>>>",user)
        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) {
            return res.status(404).json({ msg: "wrong password" });
        }
        console.log("checkPassword>>>>",checkPassword)
       
        const token = await user.generateAuthToken();

        console.log("token>>>>>>",token)
        const cookieOptions = {
            httpOnly: true,
            Secure: false,
            maxAge: 60*60*1000,
        };
         
        res.status(201).cookie("token", token, cookieOptions).json({ user, msg: "user login successfully" });
    }
    catch (error) {
        res.status(500).json({ msg: "internel server error" })
    }
}