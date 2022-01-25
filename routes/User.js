const express = require("express");
const {create,index,login,resetPassword,update,deleteUser,changePassword,updateProfileImage} = require("../controllers/User");
const { VerifyMail }=require("../services/Mail")
const schemas = require("../validations/User");
const authenticate = require("../middlewares/authenticate");
const validate = require("../middlewares/validate");


const router = express.Router();

router.get("/", index);
router.route("/register").post(validate(schemas.createValidation), create);
router.route("/login").post(validate(schemas.loginValidation), login);
router.route("/").patch( validate(authenticate,schemas.updateValidation), update);
router.route("/reset-password").post(validate(schemas.resetPasswordValidation), resetPassword);
router.route("/:id").delete( deleteUser);
router.route("/change-password").post(authenticate,validate(schemas.changePasswordValidation),changePassword);
router.route("/update-profile-image").post(authenticate, updateProfileImage);
router.route("/verify/:id/:token").get(VerifyMail);

module.exports = router;