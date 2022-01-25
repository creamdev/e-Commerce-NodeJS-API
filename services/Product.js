const Product = require("../models/Product");



const insert = (data,image) => {
  let product = new Product({
    name:data.name,
    description:data.description,
    price:data.price,
    stock:data.stock,
    category:data.category,
    brand:data.brand,
    image:image,
  });
  return product.save();   
}

const list = (where) => {
  return Product.find(where || {})
  .populate('brand','name')
  .populate('category','name')
};

const getid = (id) => {
  return Product.findById(id).populate({
    path:"category",
    select:"name",
}).populate({
  path:"brand",
  select:"name",
})
};

const getProductByCategoryId=(id)=>{
  return Product.find({category:id})
}

const modify = async (paramsid,data,imagepath) => {
  const id = paramsid;
  const {name,description,price,stock,category,brand} = data
  const image = imagepath
  const updateProduct = {name,description,price,stock,category,brand,image,_id:id}
  return await Product.findByIdAndUpdate(id, updateProduct, { new: true });
};

const remove = (id) => {
  console.log(id)
  return Product.findByIdAndDelete(id);
};

module.exports = {
  insert,
  list,
  getid,
  getProductByCategoryId,
  modify,
  remove,
  
};
