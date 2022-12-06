const mongoose = require("mongoose");
const constants = require("../../../constant");

const Schema = mongoose.Schema;

const NotificationSchema = new Schema(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: constants.DB_MODEL_REF.USER,
      index: true,
    },
    profileImg: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    subTitle: {
      type: String,
      default: "",
    },
    body: {
      type: String,
      default: "",
    },
    additional: {
      type: String, //link, obj id etc as a object
      default: "",
    },
    isDeleted: {
      type: Number,
      default: 0, // 1- deleted , 0 -not deleted
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  constants.DB_MODEL_REF.NOTIFICATION,
  NotificationSchema
);
