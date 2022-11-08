// Importing mongoose
var mongoose = require("mongoose");
var constants = require('../../../constant');

var Schema = mongoose.Schema;
var Account;

var AccountSchema = new Schema({
    accountType: {
        type: Number, // 1 SBA, 2-RDA , 3-FDA , 4-LAA , 5-ODA , 6-BDA Business Deposit Account , 7-FRDA Flexi RD Account
        index: true,
        min:1,
        max:7,
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
    isDeleted: {
        type: Number,//1-soft delete, 2= delete
        default: 0
    },
    //get foreign key from user
    // accountUserId: {
    //     type: Schema.Types.ObjectId,
    //     ref: constants.DB_MODEL_REF.USER,
    //     index: true
    // } 
},
{timestamps: true}
);

//Export user module
Account = module.exports = mongoose.model(constants.DB_MODEL_REF.ACCOUNT, AccountSchema);


