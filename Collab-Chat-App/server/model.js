const mongoose=require("mongoose");

const UserSchema=new mongoose.Schema({

username:
{
type:String
},
password:
{
  type:String
}




});

const user=mongoose.model("user",UserSchema);
module.exports=user;
