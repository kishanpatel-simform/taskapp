const express = require('express')
const Task = require('../models/task')
const router = new express.Router()
const auth = require('../middleware/auth')
router.post('/tasks', auth, async(req, res) => {
    const tasks = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await tasks.save()
        console.log("Message " + req.t('task_create_success'))
        res.status(201).send(tasks)
    } catch (e) {
        res.status(400).send(e)
    }
})
router.get('/tasks', auth, async(req, res) => {
    try {
        // const owner = req.user._id
        // if (req.query.completed) {
        //     completed = req.query.completed === 'true'
        // }
        // const tasks = await Task.find({ owner, completed }).limit(2)
        //res.status(200).send(req.user)
        // console.dir(req.user)
        await req.user.populate({ path: 'tasks', Option })

        res.status(200).send(req.user.tasks)
            // res.status(200).send(req.user)
            // console.log(req.user.tasks)
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})
router.get('/tasks/:id', auth, async(req, res) => {
    const _id = req.params.id
    try {
        //const tasks = await Task.findById(_id)
        //  console.log(req.user.id)
        const task = await Task.findOne({ _id, owner: req.user._id })
        if (!task) {
            return res.status(500).send()
        }
        res.status(200).send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})
router.patch('/tasks/:id', auth, async(req, res) => {
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(500).send({ error: "Invalid Updates" })
    }
    try {
        const task = await Task.findOne({ _id: _id, owner: req.user._id })
            // const tasks = await Task.findById(req.params.id)
            // updates.forEach((update) => {
            //     tasks[update] = req.body[update]

        // })
        updates.forEach((update) => {
            task[update] = req.body[update]
        })
        await task.save()
        console.log("Message " + req.t('task_update_success'))
            // const tasks = await Task.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true })
        if (!task) {
            return res.status(500).send()
        }
        res.status(200).send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.delete('/tasks/:id', async(req, res) => {
    const _id = req.params.id
    try {
        //  const tasks = await Task.findByIdAndDelete(_id)
        const tasks = await Task.findOneAndDelete({ _id: _id, owner: req.user._id })
        if (!tasks) {
            return res.status(500).send()
        }
        console.log("Message " + req.t('task_delete_success'))
        res.status(200).send(tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})
module.exports = router