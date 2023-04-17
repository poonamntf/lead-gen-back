const express = require("express")
require("dotenv").config()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
require('./db')
const app = express()
const cors = require('cors')

const adminRoute = require("./routes/adminRoutes")
const userRoute = require("./routes/userRoute")

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())
app.use(express.json())

app.use('/files', express.static('files'))
app.get('/', (req, res) => {
    res.send('<h1>Welcome to Lead Generation webapp</h1>')
})

app.use('/api/admin', adminRoute)
app.use('/api/user', userRoute)

const PORT = process.env.NODE_PORT;
const server = app.listen(5000, () => { console.log(`Server run on port number ${5000}`); })