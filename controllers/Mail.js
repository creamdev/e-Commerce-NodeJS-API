const User = require("../models/User")
const Token = require("../models/UserToken");
const crypto = require('crypto')
const sendEmail = require('../scripts/utils/sendMail')

const SendMail =async (user)=> {
    let token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
      const message = ` http://localhost:3000/users/verify/${user.id}/${token.token} `;
        await sendEmail(user.email, "Verify Email", message);
    return message
}

const VerifyMail = async (req, res) => {
        try {
          const user = await User.findOne({ _id: req.params.id });
          if (!user) return res.status(400).send("Invalid link");
            
          const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
          });
          if (!token) return res.status(400).send("Invalid link");
          
          const verified= true;
          const id = user._id;
          const updatedUser = {verified}
          await User.findByIdAndUpdate(id, updatedUser, { new: true });
          await Token.findByIdAndRemove(token._id);
      
          res.send("Email verify successfull");
        } catch (error) {
            console.log(error)
          res.status(400).send("An error occured");
        }   
}

const resetPasswordMail = async (req,res)=> {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user)
        return res.status(400).send("user with given email doesn't exist");

    let token = await Token.findOne({ userId: user._id });
    if (!token) {
        token = await new Token({
            userId: user._id,
            token: crypto.randomBytes(32).toString("hex"),
        }).save();
    }
    const message = `http://localhost:3000/users/new-password/${user._id}/${token.token}`;
    await sendEmail(user.email, "Password reset", message);
    res.send("password reset link sent to your email account");
} catch (error) {
    res.send("An error occured");
    console.log(error);
}
}



module.exports = {SendMail, VerifyMail,resetPasswordMail}