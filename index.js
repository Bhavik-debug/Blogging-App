const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require('cookie-parser')


const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');
const { checkForAuthenticationCookie } = require("./middleware/authentication");

const port = 8000;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/blogify')
    .then(e=>{
        console.log("MongoDB Connected")
    })
    .catch(e=>{
        console.log("error in connecting DB")
    })

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser())
app.use(checkForAuthenticationCookie("token"))

app.set('view engine', 'ejs');
app.set('views', path.resolve("./views"))

app.get("/", (req, res)=>{
    res.render('home',{
        user: req.user,
    })
})

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.listen(port , ()=>{
    console.log(`server started at port ${port}`)
})