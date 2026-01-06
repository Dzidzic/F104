const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");
const path = require("path");

const { userLoggedIn } = require("./middlewares/authMiddleware");
const mainRouter = require("./routes/mainRouter");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(expressLayouts);
app.set("layout", "layouts/main");

app.use(express.static(path.join(__dirname, "..", "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
    session({
        name: "f104.sid",
        secret: process.env.SESSION_SECRET || "dev_secret",
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI,
            collectionName: "sessions"
        }),
        cookie: {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 3
        }
    })
);
app.use(userLoggedIn);

app.use("/", mainRouter);
app.use((err, req, res, next) => {
    res.status(err.status || 500).render("pages/error", {
        status: err.status || 500,
        message: err.message
    });
});
app.use((req, res, next) => {
    res.status(404).render("pages/error", {
        status: 404,
        message: "Strona nie istnieje"
    });
});

module.exports = app;
