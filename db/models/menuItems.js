const mongoose = require("../db.js");

const menuItemsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String
  },
  updatedAt: {
    type: Date
  }
});
menuItemsSchema.set("toJSON", {
  virtuals: true
});
// menu model
const MenuItems = mongoose.model("MenuItems", menuItemsSchema);

const getAll = async () => {
  try {
    const menuItems = await MenuItems.find();
    return menuItems;
  } catch (error) {
    return error;
  }
};

const getOne = async (id) => {
  try {
    const menuItem = await MenuItems.findById(id);
    return menuItem;
  } catch (error) {
    return error;
  }
};

const create = async (body) => {
  try {
    const menuItem = await MenuItems.create(body);
    return menuItem;
  } catch (error) {
    return error;
  }
};

const put = async (id, body) => {
  const newInfo = body;
  newInfo.updatedAt = Date.now();
  const menuItem = await MenuItems.findByIdAndUpdate(id, newInfo, {
    new: true
  });
  return menuItem;
};

const remove = async (id) => {
  await MenuItems.findByIdAndDelete(id);
  return id;
};

const search = async (queryString) => {
  const expression = new RegExp(queryString, "i");
  const query = { $or: [{ name: expression }, { description: expression }] };
  const menuItems = await MenuItems.find(query);
  return menuItems;
};

module.exports = { getAll, getOne, create, put, remove, search, MenuItems };
