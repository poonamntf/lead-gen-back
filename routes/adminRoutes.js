const express = require("express");
const Admin = require('../controller/adminController')
const router = express.Router();


router.post("/register", Admin.adminRegister)
router.post("/login", Admin.adminLogin)
router.delete("/:_id", Admin.adminDelete)
router.post("/leads", Admin.addLeads)
router.post("/lead", Admin.addLead)
router.get("/leads", Admin.getLeads)

module.exports = router