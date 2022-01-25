const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");

const insert =async (data) => {
    const orderItemsIds = Promise.all(data.orderItems.map(async orderItem =>{
        let newOrderItem = new OrderItem({
          quantity:orderItem.quantity,
          product:orderItem.product
        })
        newOrderItem =await newOrderItem.save();
    
        return newOrderItem._id;
      }))
    
      const orderItemResolved =await orderItemsIds
     
      const totalPrices = await Promise.all(
        orderItemResolved.map(async (orderItemId) => {
          const orderItem = await OrderItem.findById(orderItemId).populate(
            "product",
            "price"
          );
    
          const totalPrice = orderItem.product.price * orderItem.quantity;
         
          return totalPrice;
        })
      );
      
      const totalPrice = totalPrices.reduce((a, b) => a + b, 0);
      let order = new Order({
        orderItems: orderItemResolved,
        shippingAddress: data.shippingAddress,
        city: data.city,
        zip: data.zip,
        country: data.country,
        phone: data.phone,
        status: data.status,
        totalPrice: totalPrice, 
        user: data.user_id
      });
     
      return await order.save()
};

const list = (where) => {
  return  Order.find(where || {})
  .populate("user", "name")
  .populate({
    path: "orderItems",
    populate: {
      path: "product",
      populate: "category",
    },
  })
};
const getid = (id) => {
  return Order.findById(id).populate({
    path:'user',
    select:"name"
  })
};

const modify = (data, id) => {
  return Order.findByIdAndUpdate(id, data, { new: true });
};

const remove = (id) => {
  return Order.findByIdAndDelete(id);
};

module.exports = {
  insert,
  list,
  getid,
  modify,
  remove,
};
