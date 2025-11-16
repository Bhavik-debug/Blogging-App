const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require('cookie-parser')
const Blog = require('./models/blog')


const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');
const { checkForAuthenticationCookie } = require("./middleware/authentication");
const User = require("./models/user");


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
app.use(express.static(path.resolve('./public')));
app.use('/uploads', express.static(path.resolve('./public/uploads')));
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});


app.set('view engine', 'ejs');
app.set('views', path.resolve("./views"))

app.get("/", async (req, res) => {
    const allBlogs = await Blog.find({})
    res.render("home", {
        user: req.user,
        blogs: allBlogs,
    });
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.listen(port , ()=>{
    console.log(`server started at port ${port}`)
})