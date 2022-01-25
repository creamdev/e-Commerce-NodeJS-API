const express = require("express");
const { create,index,idList,getByCategoryId,update,_delete} = require("../controllers/Product");
const schemas = require("../validations/Product");
const validate = require("../middlewares/validate");
const authenticateToken = require("../middlewares/authenticate");
const upload = require('../middlewares/imageUploads')

const router = express.Router();




router.route("/").get( index);
router.route("/:id").get( idList);
router.route("/category/:id").get(getByCategoryId)
router.route("/").post(authenticateToken,upload.single("image"),validate(schemas.createValidation),(req,res,next)=>{create(req,res)})
router.patch("/:id", upload.single("image"),(req,res,next)=>{update(req,res)})
router.route("/:id").delete( _delete);

module.exports = router;
