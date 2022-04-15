const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const User = require('../models/user')
const auth = require('../middleware/auth')
const { sendWelcomeEmail, sendCancellationEmail } = require('../emails/account')
const router = new express.Router()

router.post('/users', async(req, res) => {
    const user = new User(req.body)
    try {

        await user.save()
        console.log(sendWelcomeEmail(user.email, user.name))
        const token = await user.generateAuthToken()
        console.log("Message " + req.t('user_create_success'))

        res.status(201).send({ user, token })
    } catch (e) {

        res.status(400).send(e)

    }
})

router.post('/users/login', async(req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({
            user,
            token
        })
        console.log("Message " + req.t('user_login_success'))
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/users', auth, async(req, res) => {
    try {
        const users = await User.find({})
        res.status(200).send(users)
    } catch (e) {
        res.status(500).send(e)
    }

})
router.get('/users/me', auth, async(req, res) => {
    res.send(req.user)


})
const storage = multer.memoryStorage()

const upload = multer({
    storage,
    dest: 'avatar',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
            return cb(new Error('Please upload a JPG or JPEG or PNG'))
        }
        cb(undefined, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async(req, res) => {

    const buffer = await sharp(req.file.buffer).resize({ width: 110, height: 110 }).png().toBuffer()

    req.user.avatar = buffer
        // console.log(req.file)
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})
router.delete('/users/me/avatar', auth, upload.single('avatar'), async(req, res) => {

    req.user.avatar = undefined
        // console.log(req.file)
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})
router.get('/users/:id/avatar', async(req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar) {
            throw new Error()
        }
        res.set('Content-Type', 'image/jpg')
        res.send(user.avatar)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/users/logout', auth, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        console.log("Message " + req.t('user_logout_success'))

        res.status(200).send()

    } catch (e) {
        res.status(500).send(e)
    }

})
router.get('/users/logoutAll', auth, async(req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.status(200).send()

    } catch (e) {
        res.status(500).send(e)
    }

})
router.get('/users/:id', async(req, res) => {
    const _id = req.params.id
    try {
        const users = await User.findById(_id)
        if (!users) {
            return res.status(500).send()
        }
        res.status(200).send(users)
    } catch (e) {
        res.status(500).send(e)

    }
})
router.patch('/users/:id', auth, async(req, res) => {
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(500).send({ error: "Invalid Updates" })
    }
    try {
        //const users = await User.findById(req.params.id)
        updates.forEach((update) => {
            req.user[update] = req.body[update]

        })
        await req.user.save()
        console.log("Message " + req.t('user_update_success'))
            //const users = await User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true })
            // if (!users) {
            //     return res.status(500).send()
            // }
        res.status(200).send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})
router.delete('/users/me', auth, async(req, res) => {
    const _id = req.user._id
    try {
        // const users = await User.findByIdAndDelete(_id)
        // if (!users) {
        //     return res.status(400).send()
        // }
        // res.status(200).send(users)
        await req.user.remove()
        console.log("Message " + req.t('user_delete_success'))
        sendCancellationEmail(req.user.email, req.user.name)
        res.status(200).send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})



module.exports = router