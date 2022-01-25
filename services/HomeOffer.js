const HomeOffer = require("../models/HomeOffer");


const insert = (image) => {
  let homeOffer = new HomeOffer({
    image:image,
  });
  return homeOffer.save();   
}

const list = (where) => {
  return HomeOffer.find(where || {})
};

const remove = (id) => {
  return HomeOffer.findByIdAndDelete(id);
};

module.exports = {
  insert,
  list,
  remove
  
};
