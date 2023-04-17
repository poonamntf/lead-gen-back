const mongoose = require("mongoose")
const DB = process.env.DATABASE;

mongoose.set('strictQuery', true)
mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("connection is success db");
}).catch((error) => console.log(error))