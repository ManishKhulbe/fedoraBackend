// Importing mongoose
var mongoose = require("mongoose");
var constants = require('../../../constant');

var Schema = mongoose.Schema;
var Account;

var OnlineServiceSchema = new Schema({
    serviceApplyFor: {
        type: Number, // 1- new account opening , 2- apply for loan , 3- apply for locker
        index: true,
        default:0
    },
    remark :{
        type: String,
        default:""
    },
    status: {
        type: Number, //0 - pending 1-completed 2-rejected
        default:0
    },
    customerId: {
        type: Schema.Types.ObjectId,
        ref: constants.DB_MODEL_REF.USER,
        index: true,
        default:null
    },
    accountId: {
        type: Schema.Types.ObjectId,
        ref: constants.DB_MODEL_REF.ACCOUNT,
        index: true,
        default:null
    },
    fulfilDate: {
        type: Date
    },
    isDeleted: {
        type: Number,//1-soft delete, 2= delete
        default: 0
    },
    reply:{
        type:String,
        default:''
    },
},
{timestamps: true}
);

//Export user module
OnlineService = module.exports = mongoose.model(constants.DB_MODEL_REF.ONLINE_SERVICES, OnlineServiceSchema);


