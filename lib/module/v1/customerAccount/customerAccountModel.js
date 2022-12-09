// Importing mongoose
var mongoose = require("mongoose");
var constants = require('../../../constant');

var Schema = mongoose.Schema;
var CustomerAccount;

var CustomerAccountSchema = new Schema({
    customerId: {
        type: Schema.Types.ObjectId,
        ref: constants.DB_MODEL_REF.USER,
    },
    accountType: {
        type: Number,
        ref: constants.DB_MODEL_REF.ACCOUNT,
        default : 1,
    },
    balance :{
        type : Number,
        default : 0
    },
    accountCreated :{
        type : Number,
        default : 0
    },
    isDeleted :{
        type : Number , //1- soft deleted , 2 -delete
        default : 0
    },
    accountNumber :{
        type : String , 
        default : ""
    },
    pendingTransaction :{
        type : Array,
        default : []
    },

}, { timestamps: true }
);

//Export user module
CustomerAccount = module.exports = mongoose.model(constants.DB_MODEL_REF.CUSTOMER_ACCOUNT, CustomerAccountSchema);


