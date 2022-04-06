const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

mongoose.connect(process.env.MONGODBURL, {
    useNewUrlParser: true,
    autoIndex: true
})