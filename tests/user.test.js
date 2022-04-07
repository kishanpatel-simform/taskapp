const request = require('supertest')
const app = require('../src/app')

test('Should signup a new user', async() => {
    await request(app).post('/users').send({
        name: 'Patel Kishan',
        email: 'k@gmail.com',
        password: 'MyPass@1123'
    }).expect(201)
})