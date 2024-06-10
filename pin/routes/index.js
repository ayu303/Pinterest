var express = require('express');
var router = express.Router();
const userModel =require("./users");
const postModel =require("./posts");
const passport = require('passport');
const localStrategy=require("passport-local");
const upload = require('./multer');
passport.use(new localStrategy(userModel.authenticate()));
/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.flash("error"));
  res.render('index',{navb:false, error:req.flash('error')});
});
router.get('/register', function(req, res, next) {
  res.render('register',{navb:false});
});
router.get('/add',isLoggedIn, async function(req, res, next) {
  const user = await userModel.findOne({username: req.session.passport.user});
  res.render('add',{user,navb:true});
});
router.get('/profile',isLoggedIn, async function(req, res, next) {
  const user = await userModel.findOne({username: req.session.passport.user}).populate("posts");
  console.log(user);
 
  res.render('profile',{user,navb:true});
});
router.get('/feed',isLoggedIn, async function(req, res, next) {
  const user = await userModel.findOne({username: req.session.passport.user});
  const posts = await postModel.find().populate("user");
  res.render('feed',{user,posts,navb:true});
 
  res.render('profile',{user,navb:true});
});
router.get('/all/posts',isLoggedIn, async function(req, res, next) {
  const user = await userModel.findOne({username: req.session.passport.user}).populate("posts");
  const posts = await postModel.find().populate("user");
  console.log(user); 

  res.render('allposts',{user,posts,navb:true});
});
router.get('/fullimage/:postId', isLoggedIn, async function(req, res, next) {
  const postId = req.params.postId;
  const post = await postModel.findById(postId).populate("user");
  if (!post) {
    return res.status(404).send('Post not found');
  }
  res.render('full', { post, navb: true });
});
// router.get('/fullimage',isLoggedIn, async function(req, res, next) {
//   const user = await userModel.findOne({username: req.session.passport.user}).populate("posts");
//   const post = await postModel.findOne({title:req.session.passport.post}).populate("user");
//   console.log(user); 
//   console.log(post); 


//   res.render('full',{user,post,navb:true});
// });
router.post('/createpost',isLoggedIn,upload.single("postimage"), async function(req, res, next) {
  const user = await userModel.findOne({username: req.session.passport.user});
  const post = await postModel.create(
    {
      user: user._id,
      title:req.body.title,
     description:req.body.description,
     image:req.file.filename
    }
  )
  user.posts.push(post._id);
  await user.save();
  res.redirect('/profile');
 
});
router.post('/fileupload',isLoggedIn,upload.single("image"), async function(req, res, next) {
  const user = await userModel.findOne({username: req.session.passport.user});
  user.profileImage = req.file.filename;
  await user.save();
  res.redirect('/profile');
 

});
router.get('/logout',isLoggedIn,function(req,res,next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});
router.post('/login',passport.authenticate('local',
  { successRedirect: '/profile',
  failureRedirect: '/',
  failureFlash: true 
  
}

),function(req,res,next){
})
router.post('/register', function(req, res, next) {
  const data = new userModel(
    {
      name:req.body.name,
      username:req.body.username,
      email:req.body.email,
      contact:req.body.contact
    }
  )
  userModel.register(data, req.body.password)
  .then(function(){
    passport.authenticate("local")(req,res,function(){
      res.redirect("/profile");
    })
  }
)
});
function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/");
}



module.exports = router;
