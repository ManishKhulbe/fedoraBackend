// Importing mongoose
var mongoose = require("mongoose");
var constants = require("../../../constant");

var Schema = mongoose.Schema;
var CustomerAccount;

var CustomerAccountSchema = new Schema(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: constants.DB_MODEL_REF.USER,
    },
    accountType: {
      type: Number,
      ref: constants.DB_MODEL_REF.ACCOUNT,
      default: 1,
    },
    balance: {
      type: Number,
      floating: true,
      default: 0,
    },
    accountCreated: {
      type: Number,
      default: 0,
    },
    isDeleted: {
      type: Number, //1- soft deleted , 2 -delete
      default: 0,
    },
    accountNumber: {
      type: String,
      default: "",
    },
    tenure: {
      type: Number,
    },
    accountInterestRate: {
      type: Number,
    },
    allotedAmount: {
        type: Number, //for OD and LAA account 
      default: 0, 
    },
    pendingTransaction: {
      type: Array,
      default: [],
    },
    rdAmount :{
      type : Number,
      default : 0
    },
    accountStatus :{
      type : Number,
      default : 1 //1-active 2-inactive
    }
  },
  { timestamps: true }
);

//Export user module
CustomerAccount = module.exports = mongoose.model(
  constants.DB_MODEL_REF.CUSTOMER_ACCOUNT,
  CustomerAccountSchema
);
