require('dotenv').config()
const bcrypt = require('bcrypt')
const User = require('../model/userModel')

exports.registration = async (req, res) => {
    try {
        const { email } = req.body;

        const checkUser = await User.findOne({ email: email });

        if (checkUser) {
            return res.json({ statuscode: '403', message: "user already exist " })
        }

        const user = new User(req.body);
        if (!user) {
            return res.json({ statuscode: '404', message: "Something Went Wrong" })
        }

        const savedUser = await user.save();
        if (!savedUser) {
            return res.json({ statuscode: '401', message: "User not saved " })
        }

        res.json({ statuscode: '201', data: savedUser, message: "Successfully Registered" });
    }
    catch (error) {
        res.json({statuscode:'500', message: "User Registration failed" })
    }
}

exports.login = async (req, res) => {
    try {
        console.log("reqbody>>>", req.body)
        const { email, password } = req.body;

        if (email == null || password == null) {
            return res.json({ statuscode: '403', message: "Please fill all field" })
        }

        const user = await User.findOne({ email: email });
        if (!user) {
            return res.json({ statuscode: '401', message: "User not exist" })
        }
        console.log("user>>>", user)

        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) {
            return res.json({ statuscode: '404', message: "Invalid Email or Password" });
        }
        console.log("checkPassword>>>>", checkPassword)

        const token = await user.generateAuthToken();

        console.log("token>>>>>>", token)
        const cookieOptions = {
            httpOnly: true,
            Secure: false,
            maxAge: 60 * 60 * 1000,
        };

        res.cookie("token", token, cookieOptions)
        res.json({ statuscode: '201', data: user, message: "User Login Successfully" });
    }
    catch (error) {
        res.status(500).json({ statuscode: '500', message: "Internel server error" })
    }
}