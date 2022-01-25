const express = require("express");
const { searchProduct } = require('../controllers/Search')


const router = express.Router()

router.route('/:name').get((req,res,next)=>{searchProduct(req,res)})

module.exports = router