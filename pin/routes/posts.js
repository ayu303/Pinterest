const mongoose=require('mongoose');


const postschema = mongoose.Schema(
  {
   user:{
    type:mongoose.Schema.Types.ObjectId,
    ref : 'user'
   },
   title:String,
   description:String,
   image:String,
   cloudinary_url: String
  }
);



module.exports=mongoose.model("post",postschema);