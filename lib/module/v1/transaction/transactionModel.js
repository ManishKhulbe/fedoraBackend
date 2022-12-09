const mongoose = require('mongoose');
const constants = require('../../../constant');

const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
    accountNumberFrom: {
        type: Number,
        // ref: constants.DB_MODEL_REF.ACCOUNT,
        index: true
    },
    accountNumberTo: {
        type: Number,
        // ref: constants.DB_MODEL_REF.ACCOUNT,
        index: true
    },
    senderUserId :{
        type: Schema.Types.ObjectId,
        ref: constants.DB_MODEL_REF.USER,
        index: true
    },
    receiverUserId :{
        type: Schema.Types.ObjectId,
        ref: constants.DB_MODEL_REF.USER,
        index: true
    },
    senderAccountTypeId :{
        type: Number,
        ref: constants.DB_MODEL_REF.ACCOUNT,
        index: true
    },
    receiverAccountTypeId :{
        type: Number,
        ref: constants.DB_MODEL_REF.ACCOUNT,
        index: true
    },
    couponWalletAmount: {type: Number, default: 0},
    senderAccountBalance: {type: Number, default: 0},
    receiverAccountBalance :{type: Number, default: 0},
    transactionAmount :{type: Number, default: 0},
    transactionType: {type: Number},// 1. credited , 2. debited
    // transactionType: {type: Number}, // 1. auto credit daily coupon code, 2. amount added by admin on cash/payment exchange, 3. order debit , 4 auto debit (daily coupon amount), 5 amount debit by admin, 6 order credit amount on cancel, 7 refund
    created: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: Number,  // 0 initial , 1 pending , 2. complete , 3 failed
        default : 0
    },
    remark: {
        type: String
    },
    // referenceId:{
    //     type: String
    // },
    paymentMode:{
        type: String
    },
    isDeleted: {
        type: Number,  // 0 initial , 1- soft deleted , 2 -delete
        default : 0
    },
},{timestamps : true});

// let transactionModel = mongoose.model(constants.DB_MODEL_REF.TRANSACTION, TransactionSchema);
// //create a view for transaction



module.exports = mongoose.model(constants.DB_MODEL_REF.TRANSACTION, TransactionSchema);



//view creation query

// db.createView(
//     'transactionView',
//     'transactions',
//     [
//         {
//           $lookup: {
//             from: "users",
//             localField: "senderUserId",
//             foreignField: "_id",
//             as: "senderDetails"
//         }
//         },
//         {
//            "$unwind": {
//             path: "$senderDetails",
//             "preserveNullAndEmptyArrays": true
//         }
//         },
//         {
//             $lookup: {
//             from: "users",
//             localField: "receiverUserId",
//             foreignField: "_id",
//             as: "receiverDetails"
//         }
//         },
//         {"$unwind": {
//             path: "$receiverDetails",
//             "preserveNullAndEmptyArrays": true
//         }},
//         { $lookup: {
//             from: "accounts",
//             localField: "receiverAccountTypeId",
//             foreignField: "_id",
//             as: "receiverAccountDetails"
//         }},
//         {"$unwind": {
//             path: "$receiverAccountDetails",
//             "preserveNullAndEmptyArrays": true
//         }},
//         { $lookup: {
//             from: "accounts",
//             localField: "senderAccountTypeId",
//             foreignField: "_id",
//             as: "senderAccountDetails"
//         }},{"$unwind": {
//             path: "$senderAccountDetails",
//             "preserveNullAndEmptyArrays": true
//         }},{
//             $project :{
//             _id : 1,
//             accountNumberFrom :1,
//             accountNumberTo :1,
//             senderUserId:1,
//             receiverUserId:1,
//             transactionAmount : 1,
//             remark :1,
//             createdAt : 1,
//             status : 1,
//             year: 1,
//             month: 1,
//             day: 1,
//             senderAccountType:"$senderAccountDetails.accountType",
//             receiverAccountType:'$receiverAccountDetails.accountType',
//             senderName : '$senderDetails.name',
//             receiverName : '$receiverDetails.name',
//             senderMobileNo : '$senderDetails.mobileNo',
//             receiverMobileNo : '$receiverDetails.mobileNo',
//             senderAccountBalance : 1,
//             receiverAccountBalance : 1
//         }
//         }
//         ]
// )