// Importing mongoose
var mongoose = require("mongoose");
var constants = require('../../../constant');

var Schema = mongoose.Schema;
var Account;

var AccountSchema = new Schema({
    accountType: {

//  SBA- Saving account
// ● BDA - Business Deposit ac
// ● TDA- Term Deposit Accounts
// ● FFA- Fedora Felxi Deposit accounts
// ● RDA - Recurring Deposit accounts
// ● LAA - Term Loan accounts
// ● ODA- OVERDRAFT accounts
        type: Number, // 1 SBA, 2-RDA , 3-TDA , 4-LAA , 5-ODA , 6-BDA Business Deposit Account , 7-FFA
        index: true,
        min:0,
        default:0
    },

    //schema for floating rate
    accountInterestRate :{
        type: Number,
        default:0
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


