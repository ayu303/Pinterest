const mongoose=require('mongoose');
const plm=require("passport-local-mongoose");
//require('dotenv').config(); // Load environment variables from .env file

mongoose.connect("mongodb://127.0.0.1:27017/pin");

const userSchema = mongoose.Schema(
  {
    
    username: String,
    password: String,
    name: String,
    email:String,
    contact:Number,
    profileImage:String,
    boards:[],
    posts:[
      {
        type:mongoose.Schema.Types.ObjectId,
        ref:"post"
      }
    ]
  }
);
userSchema.plugin(plm);


module.exports=mongoose.model("user",userSchema);