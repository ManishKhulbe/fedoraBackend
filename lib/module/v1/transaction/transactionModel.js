const mongoose = require('mongoose');
const constants = require('../../constant');

const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
    accountIdFrom: {
        type: Schema.Types.ObjectId,
        ref: constants.DB_MODEL_REF.ACCOUNT,
        index: true
    },
    accountIdTo: {
        type: Schema.Types.ObjectId,
        ref: constants.DB_MODEL_REF.ACCOUNT,
        index: true
    },
    couponWalletAmount: {type: Number, default: 0},
    AccountBalance: {type: Number, default: 0},
    trancationAmount :{type: Number, default: 0},
    amountType: {type: Number},// 1. credited , 2. debited
    transactionType: {type: Number}, // 1. auto credit daily coupon code, 2. amount added by admin on cash/payment exchange, 3. order debit , 4 auto debit (daily coupon amount), 5 amount debit by admin, 6 order credit amount on cancel, 7 refund
    created: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: Number,  // 0 initial , 1 complete, 2. failed
        default : 0
    },
    note: {
        type: String
    },
    referenceId:{
        type: String
    },
    paymentMode:{
        type: String
    },
    isDeleted: {
        type: Number,  // 0 initial , 1- soft deleted , 2 -delete
        default : 0
    },
},{timestamps : true});


module.exports = mongoose.model(constants.DB_MODEL_REF.TRANSACTION, TransactionSchema);