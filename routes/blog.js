const {Router} = require('express')
const User = require('../models/user')
const router = Router();

router.get('/add-new', (req,res)=>{
    return res.render('addBlog', {
        user: res.user,
    })
})


module.exports = router;