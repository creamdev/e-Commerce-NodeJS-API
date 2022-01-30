const User = require("../models/User");
const Token = require("../models/UserToken")
const {SendMail} = require("../controllers/Mail")


const insert =async (data) => {
  const user = new User(data);
  await user.save();
  return SendMail(user)
};
const loginUser = (loginData) => {
  return User.findOne(loginData);
};
const list = () => {
  return User.find({});
};
const modify = (where, data) => {
  return User.findOneAndUpdate(where, data, { new: true });
};
const remove = (id) => {
  return User.findByIdAndDelete(id);
};

const newPassword =async (id,_token,password) =>{
  const user = await User.findById(id);
  const token = await Token.findOne({
    userId: id,
    token: _token,
  });
  if(token==null){
    var response = 
      {
        statusCode:400,
        message:'Token invalid or expired'
      }
    return response;
  }
  user.password = password;
  await user.save();
  await Token.findByIdAndRemove(token._id);
  var response = 
      {
        statusCode:200,
        message:'Password reset successfully'
      }
  return response;
}



module.exports = {
  insert,
  list,
  loginUser,
  modify,
  remove,
  newPassword,
};
