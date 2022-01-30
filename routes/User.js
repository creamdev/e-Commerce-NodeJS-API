const express = require("express");
const {create,index,login,update,deleteUser,changePassword,updateValidation,updateProfileImage,_newPassword} = require("../controllers/User");
const { VerifyMail ,resetPasswordMail }= require("../controllers/Mail")
const schemas = require("../validations/User");
const authenticate = require("../middlewares/authenticate");
const validate = require("../middlewares/validate");

const router = express.Router();

router.get("/", index);

router.route("/register").post(validate(schemas.createValidation), create);
router.route("/login").post(validate(schemas.loginValidation), login);

router.route("/").patch(authenticate,validate(schemas.updateValidation), update);
router.route("/update-profile-image").post(authenticate, updateProfileImage);
router.route("/:id").delete( deleteUser);

router.route("/verify/:id/:token").get(VerifyMail);
router.route("/new-password/:id/:token").post(validate(schemas.newPasswordValidation),_newPassword)
router.route("/reset-password").post(validate(schemas.resetPasswordValidation), resetPasswordMail);
router.route("/change-password").post(authenticate,validate(schemas.changePasswordValidation),changePassword);


module.exports = router;