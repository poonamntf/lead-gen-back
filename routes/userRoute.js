const express = require("express");
const User = require('../controller/userController')
const router = express.Router();


router.post("/register", User.registration)
router.post("/login", User.login)


module.exports = router