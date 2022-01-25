const Category = require("../models/Category");

const insert = (data) => {
  const category = new Category(data);
  return category.save();
};

const list = (where) => {
  return Category.find(where || {})
};
const getid = (id) => {
  return Category.findById(id)
};

const modify = (data, id) => {
  return Category.findByIdAndUpdate(id, data, { new: true });
};

const remove = (id) => {
  return Category.findByIdAndDelete(id);
};

module.exports = {
  insert,
  list,
  getid,
  modify,
  remove,
};
