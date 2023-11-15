const mongoose = require("../db.js");

const orderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  items: [
    {
      item: {
        type: mongoose.Schema.ObjectId,
        ref: "MenuItems"
      },

      quantity: {
        type: Number,
        required: true
      }
    }
  ],
  status: {
    type: String,
    required: true,
    enum: ["pending", "confirmed", "delivered", "cancelled"],
    default: "pending"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});
orderSchema.set("toJSON", {
  virtuals: true
});
orderSchema.statics.calcTotal = (items) =>
  items.reduce((total, item) => total + item.price * item.quantity, 0);

const makeMongooseFilter = (filter) => {
  const mongooseFilter = {};

  if (filter.from != null && filter.before != null) {
    mongooseFilter.updatedAt = {
      $gte: new Date(filter.from),
      $lt: new Date(filter.before)
    };
  } else if (filter.from) {
    mongooseFilter.updatedAt = { $gte: new Date(filter.from) };
  } else if (filter.before) {
    mongooseFilter.updatedAt = { $lt: new Date(filter.before) };
  }

  if (filter.s) {
    mongooseFilter.status = { $eq: filter.s };
  }

  return mongooseFilter;
};

// order model
const Order = mongoose.model("Order", orderSchema);

const getMany = async (filter = {}) => {
  // populate each item
  const orders = await Order.find(makeMongooseFilter(filter)).populate(
    "items.item"
  );

  return orders;
};

const getOne = async (id) => {
  const order = await Order.findById(id).populate("items.item");
  return order;
};

const create = async (body) => {
  const order = await Order.create(body);
  return order;
};

const update = async (id, body) => {
  const order = await Order.findByIdAndUpdate(id, body, { new: true });
  return order;
};

const remove = async (id) => {
  const order = await Order.findByIdAndDelete(id);
  return order.id;
};

module.exports = {
  getMany,
  getOne,
  create,
  update,
  remove,
  Order
};
