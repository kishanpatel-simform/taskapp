const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRIDAPI)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'vanditachapadia293@gmail.com',
        subject: 'Welcome to Task Manager App',
        text: `Hello ${name} ,Thank You for creating account at Task Manager App`
    })
}

const sendCancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'vanditachapadia293@gmail.com',
        subject: 'Sorry! you are leaving',
        text: `Hello ${name} ,We are feeling bad as you are leaving from Task Manager App`
    })
}
module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}