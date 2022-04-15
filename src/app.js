const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const dotenv = require('dotenv')
const i18next = require('i18next')
const backend = require('i18next-fs-backend')
const middleware = require('i18next-http-middleware')
dotenv.config()


const app = express()
const port = process.env.PORT

//middlewares declaration for i18
i18next.use(backend).use(middleware.LanguageDetector)
    .init({
        fallbackLng: 'en',
        backend: {
            loadPath: './locales/{{lng}}/translations.json'
        }
    })
app.use(middleware.handle(i18next))
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)


module.exports = app

// const jwt = require('jsonwebtoken')
// const myFunction = async() => {
//     const token = jwt.sign({ __id: 'abc123' }, 'thisismynewcourse', { expiresIn: '2 weeks' })
//     console.log(token)
//     const data = jwt.verify(token, 'thisismynewcourse')
//     console.log(data)
// }    
// myFunction()

// const main = async() => {
//     const user = await User.findById('624abe5cd4cd5d422c28a1bc')
//     await user.populate('tasks')
//     console.log(user.tasks)
// }
// main()

// const multer = require('multer')
// const upload = multer({
//     dest: 'images'
// })
// app.post('/upload', upload.single('upload'), (req, res) => {
//     res.send()
// })