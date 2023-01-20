const mongoose = require('mongoose');
const constants = require('../../../constant');

const Schema = mongoose.Schema;

const BeneficiarySchema = new Schema({
    accountNumber: {
        type: String,
        default : ""
    },
    accountType: {
        type: Number,
        ref: constants.DB_MODEL_REF.ACCOUNT,
        index: true
    },
    senderUserID :{
        type: Schema.Types.ObjectId,
        ref: constants.DB_MODEL_REF.USER,
        index: true
    },
    receiverUserID :{
        type: Schema.Types.ObjectId,
        ref: constants.DB_MODEL_REF.USER,
        index: true
    },
    isDeleted: {
        type: Number,  // 0 initial , 1- soft deleted , 2 -delete
        default : 0
    },
},{timestamps : true});


module.exports = mongoose.model(constants.DB_MODEL_REF.BENEFICIARY, BeneficiarySchema);