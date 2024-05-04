const path = require("path")
const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf")
const flash = require('connect-flash');

const userRouter = require("./routes/user")

const dbUurl = 'mongodb://localhost:27017/basic_node_app';
const PORT = 3000;

const app = express()

const store = new MongoDBStore({
    uri: dbUurl,
    collection: 'sessions'
});

const csrfProtection = csrf()

app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(bodyParser.urlencoded({extended: false}))

app.use(express.static(path.join(__dirname, 'public')))

app.use(
    session({
      secret: 'my secret',
      resave: false,
      saveUninitialized: false,
      store: store
    })
);

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
    res.locals.isAuthenticated = false; //req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use('/', userRouter)

mongoose.connect(dbUurl)
    .then((result) => {
        console.log("Database connected successfully")
        app.listen(PORT)
    })
    .catch((err) => {
    console.log("Connection error", err)
})