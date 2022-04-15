const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const MongoDBSession = require("connect-mongodb-session")(session);

const appController = require("./src/controllers/appController");
const isAuth = require("./src/middleware/is-auth");
const app = express();
const mongoURI = "mongodb://127.0.0.1:27017/task-manager-api";
mongoose.connect(mongoURI).then((res) => {
    console.log("mongodb");
});

const store = new MongoDBSession({
    uri: mongoURI,
    collection: "mySessions",
});

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: "Key is used to sign the cookie",
        resave: false,
        saveUninitialized: false,
        store: store,
    })
);

// Landing Page
app.get("/", appController.landing_page);

// Login Page
app.get("/login", appController.login_get);
app.post("/login", appController.login_post);

// Register Page
app.get("/register", appController.register_get);
app.post("/register", appController.register_post);

// Dashboard Page
app.get("/dashboard", isAuth, appController.dashboard_get);

app.post("/logout", appController.logout_post);

app.listen(5000, console.log("server is running on http://localhost:3000"));