const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require("dotenv").config()


const adminSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            default:'Admin'
        },
        images: {
            type: String,
        },
        tokens: [
            {
                token: {
                    type: String,
                    required: true
                }
            }
        ],
        created_at: {
            type: Date,
            default: Date.now
        },
        updated_at: {
            type: Date,
            default: Date.now
        },
    }
);

adminSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
})

adminSchema.methods.generateAuthToken = async function () {
    try {
        const token = jwt.sign({ _id: this._id }, `${process.env.SECRET_KEY}`, { expiresIn: "86400s" });
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
    } catch (err) {
        console.log(err);
    }
}


const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;