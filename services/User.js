const User = require("../models/User");
const {SendMail} = require("./Mail")


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

module.exports = {
  insert,
  list,
  loginUser,
  modify,
  remove,
};
