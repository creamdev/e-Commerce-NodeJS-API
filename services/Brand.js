const Brand = require('../models/Brand');

const insert =(data,image)=>{
    let brand = new Brand({
        name:data.name,
        image:image
    })
    return brand.save();
}

const list = (where) => {
    return Brand.find(where || {})
};
const getid = (id) => {
    return Brand.findById(id)
  };

const modify = async (paramsid,data,imagepath) => {
  const id = paramsid;
  const {name} = data  // const name = data.name
  const image = imagepath
  const updateBrand = {name,image,_id:id}
  return await Brand.findByIdAndUpdate(id, updateBrand, { new: true });
};

const remove = (id) => {
    return Brand.findByIdAndDelete(id);
};

module.exports={insert,list,getid,modify,remove}