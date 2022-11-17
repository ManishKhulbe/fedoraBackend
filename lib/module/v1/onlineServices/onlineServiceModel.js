// Importing mongoose
var mongoose = require("mongoose");
var constants = require('../../../constant');

var Schema = mongoose.Schema;
var Account;

var OnlineServiceSchema = new Schema({
    serviceId: {
        type: Schema.Types.ObjectId,
        ref: constants.DB_MODEL_REF.SERVICE,
        default:null
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


