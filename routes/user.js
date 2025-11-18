const {Router} = require('express')
const User = require('../models/user')
const {createTokenForUser} = require('../service/authentication')

const router = Router();

router.get("/signin", (req,res)=>{
    return res.render("signin")
})

router.get("/signup", (req,res)=>{
    return res.render("signup")
})

router.get("/logout", (req, res)=>{
    return res.clearCookie("token").redirect("/");//dont forget to clear cookie;
})

router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    const user = await User.create({ fullName, email, password });
    const token = createTokenForUser(user);
    return res.cookie("token", token).redirect("/");
  } 
  catch (error) {
    console.error("Signup error:", error);
    return res.render("signup", {
      error: "Signup failed. Try again or use another email.",
    });
  }
});

router.post('/signin', async (req, res)=>{
    const {email, password} = req.body;
    try{
        //matchPassword come from /model/user.js
        const token = await User.matchPasswordAndGenerateToken(email, password);
        return res.cookie("token", token).redirect("/")
    }
    catch{
        return res.render("signin",{
            error: "Incorrect ID or Password"
        })
    }
})


module.exports = router;