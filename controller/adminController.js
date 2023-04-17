require('dotenv').config()
const bcrypt = require('bcrypt')
const Admin = require('../model/adminModel')
const Leads = require('../model/leadsModel')



exports.adminRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existAdmin = await Admin.findOne({ email });

        if (existAdmin) {
            res.json({
                statuscode: "401",
                message: "Already Exist",
            });
        }
        const admin = await Admin.create({
            name,
            email,
            password
        });

        if (admin) {
            res.json({
                statuscode: '201',
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                password: admin.password
            });
        } else {
            res.json({
                statuscode: "400",
                message: "Invalid Data",
            });
        }
    } catch (error) {
        res.json({
            error: error
        })
    }
}


exports.adminLogin = async (req, res) => {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (admin) {
        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            res.json({ statuscode: '401', message: "invalid email or password" });
        } else {
            let token = await admin.generateAuthToken();
            // console.log(token);

            let cookie = await res.cookie("jwttoken", token, {
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true,
                Secure: false,
            });

            const admindata = {
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
                token,
            };
            res.json({
                statuscode: "201",
                status: true,
                message: "Admin Successfully Login ",
                data: admindata,
            });
        }
    } else {
        res.json({ statuscode: '500', message: "Invalid email or password" });
    }
};


exports.adminDelete = async (req, res) => {
    try {
        let admin = await Admin.findByIdAndDelete(req.params._id);
        if (!admin) {
            res.json({ statuscode: "400", message: "Something Wrong" });
        } else {
            res.json({ statuscode: "201", message: "Admin successfully Deleted" });
        }
    } catch (error) {
        res.json({
            statuscode: "500",
            error: error
        })
    }
};


exports.addLeads = async (req, res) => {

}

exports.addLead = async (req, res) => {
    try {
        const { name, email, number, category } = req.body;

        const existLead = await Leads.findOne({ "$and": [{ email: email }, { number: number }, { category: category }] })

        if (existLead) {
            res.json({ statuscode: '401', message: 'Lead Already Exists' })
        } else {
            const lead = await Leads.create({ name, email, number, category })

            if (lead) {
                const leadData = {
                    _id: lead._id,
                    name: lead.name,
                    email: lead.email,
                    number: lead.number
                }
                res.json({
                    statuscode: '201',
                    message: 'Lead Successfully Created',
                    data: leadData
                })
            } else {
                res.json({ statuscode: '400', message: "Invalid data" });
            }
        }
    } catch (error) {
        res.json({
            statuscode: "500",
            error: error
        })
    }
}

exports.getLeads = async (req, res) => {
    try {
        const leads = await Leads.find({})
        if (leads.length > 0) {
            res.json({
                statuscode: '201',
                message: 'Successfully found',
                data: leads
            })
        } else {
            res.json({ statuscode: '401', message: 'No data found' })
        }
    } catch (error) {
        res.json({
            statuscode: "500",
            error: error
        })
    }
}