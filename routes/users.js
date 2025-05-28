const mongoose= require('mongoose');
const plm=require('passport-local-mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/WMGMT");

const userSchema = mongoose.Schema({
  username:String,
  name:String,
  email:String,
  password:String,
  contact:Number,
  role: {
    type: String,
    enum: ['user', 'admin'], // Define roles
    default: 'user' // Default role is 'user'
  },
});


userSchema.plugin(plm);
module.exports=mongoose.model("user",userSchema);