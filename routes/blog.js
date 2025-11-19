const {Router} = require('express')
const User = require('../models/user')
const multer = require('multer');
const path = require('path');
const Blog = require('../models/blog');
const Comment = require('../models/comment');
const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`))
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`
    cb(null, fileName)
  }
})

const upload = multer({ storage: storage })


router.get('/add-new', (req,res)=>{
    return res.render('addBlog', {
        user: req.user,
    })
})

router.get("/:id", async (req, res) => {
    const blog = await Blog.findById(req.params.id).populate('createdBy')
    const comments = await Comment.find({blogId:req.params.id}).populate('createdBy')    
    return res.render('viewBlog',{
        user: req.user,
        blog,
        comments
    })
})

//here coverImage comes from addBlog.ejs (name)
router.post('/',upload.single('coverImage'), async (req,res)=>{
    const {title, body} = req.body;
    const blog = await Blog.create({
        body,
        title,
        createdBy: req.user._id,
        coverImageURL: `/uploads/${req.file.filename}`
    })
    return res.redirect(`/blog/${blog._id}`);
})

//deleting blog-post
router.delete('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).send("Blog not found");
    await Blog.findByIdAndDelete(req.params.id);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.post("/comment/:blogId", async(req, res)=>{
  const comment = await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id
  })
  return res.redirect(`/blog/${req.params.blogId}`);
})

//deleting comment if loggedIn
router.delete('/comment/:id' , async(req, res) => {
  try{
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).send("comment not found");
    await Comment.findByIdAndDelete(req.params.id);
    res.redirect(`/blog/${comment.blogId}`);
  }
  catch(err){
    console.error(err);
    res.status(500).send("Server error");
  }
})

module.exports = router;