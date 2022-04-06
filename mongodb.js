const { MongoClient, ObjectId } = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'
const id = new ObjectId()

// console.log(id.id)
// console.log(id.getTimestamp())

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {

    if (error) {
        return console.log("Error")
    }

    //console.log("Connection Done")

    const db = client.db(databaseName)

    db.collection('users').deleteMany({
        age: 27
    }).then((result) => {
        console.log(result)
    }).catch((error) => {
        console.log(error)
    })

    // db.collection('users').updateOne({
    //     _id: new ObjectId("6243f4abe936dfa95fdf220e")
    // }, {
    //     $inc: {
    //         age: 1
    //     }
    // }).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })

    // db.collection('users').updateMany({
    //         name: 'Kishan'
    //     }, {
    //         $set: {
    //             age: 21
    //         }
    //     }).then((result) => {
    //         console.log(result)
    //     }).catch((error) => {
    //         console.log(error)
    //     })

    // db.collection('users').findOne({ name: 'Kishan' }, (error, user) => {
    //     if (error) {
    //         return console.log("OOPS")
    //     }
    //     console.log(user)

    // })

    // db.collection('users').find({ name: 'Kishan' }).toArray((error, users) => {
    //         if (error) {
    //             return console.log("Error")
    //         }
    //         console.log(users)
    //     })

    // db.collection('users').insertOne({
    //         _id: id,
    //         name: 'Kishan',
    //         age: 22
    //     }, (error, result) => {
    //         if (error) {
    //             return console.log("Something went wrong")
    //         }
    //         console.log(result)
    //     })

    // db.collection('tasks').insertMany([{
    //         description: 'Learning HTML',
    //         completed: true
    //     },
    //     {
    //         description: 'Learning CSS',
    //         completed: true
    //     }
    // ], (error, result) => {
    //     if (error) {
    //         return console.log("Something went wrong")
    //     }
    //     console.log(result)
    // })

})