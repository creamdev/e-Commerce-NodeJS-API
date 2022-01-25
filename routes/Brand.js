const express = require("express")
const router = express.Router();
const {create,index,idList,update,_delete} = require("../controllers/Brand");
const upload= require('../middlewares/imageUploads')
const schemas = require("../validations/Brand");
const authenticate = require("../middlewares/authenticate");
const validate = require("../middlewares/validate");


router.route("/").get(index)
router.route("/:id").get( idList);
router.route("/").post(authenticate,upload.single("image"),validate(schemas.createValidation),(req,res,next)=>{create(req,res)})
router.route("/:id").patch(authenticate,upload.single("image"),validate(schemas.createValidation),(req,res,next)=>{update(req,res)})
router.route("/:id").delete(_delete)

module.exports=router