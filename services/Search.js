const Product = require("../models/Product");

const search = (name) => {
    let regex = new RegExp(name,'i');    
    return Product.find({name:regex})
};

module.exports = {search}