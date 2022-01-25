const express = require("express");
const { create,index,idList,update,_delete} = require("../controllers/Order");
const schemas = require("../validations/Order");
const validate = require("../middlewares/validate");
const authenticateToken = require("../middlewares/authenticate");

const router = express.Router();

router.route("/").get( index);
router.route("/:id").get( idList);
router.route("/").post(authenticateToken, validate(schemas.createValidation), create);
router.route("/:id").patch(authenticateToken,validate(schemas.updateValidation), update);
router.route("/:id").delete( _delete);

module.exports = router;
