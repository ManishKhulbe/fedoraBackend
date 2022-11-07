// Importing mongoose
var mongoose = require("mongoose");
var constants = require('../../../constant');

var Schema = mongoose.Schema;
var Account;

var AccountSchema = new Schema({
    accountType: {
        type: Number, // 1 - saving, 2-current , 3-FD
        index: true,
        default:0
    },
    // accountBalance: {
    //     type: Number,
    //     default:0
    // },

    //schema for floating rate
    accountInterestRate :{
        type: Number,
        default:0
    },
    accountOverdraft: {
        type: String,
        default:''
    },
    //last access time
    accountLastAccessTime: {
        type: Date,
        default: Date.now
    },
    //get foreign key from user
    // accountUserId: {
    //     type: Schema.Types.ObjectId,
    //     ref: constants.DB_MODEL_REF.USER,
    //     index: true
    // } 
},
);

//Export user module
Account = module.exports = mongoose.model(constants.DB_MODEL_REF.ACCOUNT, AccountSchema);


