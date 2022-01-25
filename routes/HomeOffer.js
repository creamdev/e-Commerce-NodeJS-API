const express = require("express");
const { create,index,_delete} = require("../controllers/HomeOffer");
const schemas = require("../validations/HomeOffer");
const validate = require("../middlewares/validate");
const authenticateToken = require("../middlewares/authenticate");
const upload = require("../middlewares/imageUploads")


const router = express.Router();




router.route("/").get( index);
router.route("/").post(authenticateToken, upload.single("image"),validate(schemas.createValidation),(req,res,next)=>{create(req,res)})
router.route("/:id").delete( _delete);

module.exports = router;
