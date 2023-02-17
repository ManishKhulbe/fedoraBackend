const mongoose = require('mongoose');
const constants = require('../../../constant');

const Schema = mongoose.Schema;

const ShareSchema = new Schema({
    perSharePrice : {
        type: Number,
        index: true
    },
    settingNumber   : {
        type: Number, // 1- for share price , 2- for sequence related
        index: true
    },
    sequenceKey : {
        type: String,
        default: "0"
    },
    accountNumberSeqKey1    : {
        type: String,
        default: "0"
    },
    accountNumberSeqKey2    : {
        type: String,
        default: "0"
    },
    accountNumberSeqKey3    : {
        type: String,
        default: "0"
    },
    accountNumberSeqKey4    : {
        type: String,
        default: "0"
    },
    accountNumberSeqKey5    : {
        type: String,
        default: "0"
    },
    accountNumberSeqKey6    : {
        type: String,
        default: "0"
    },
    accountNumberSeqKey7    : {
        type: String,
        default: "0"
    },
    adminSequenceKey:{
        type : String,
        default :"0"
    }



},{timestamps : true});


module.exports = mongoose.model(constants.DB_MODEL_REF.SHARES, ShareSchema);