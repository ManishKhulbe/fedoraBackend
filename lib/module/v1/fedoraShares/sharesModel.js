const mongoose = require('mongoose');
const constants = require('../../../constant');

const Schema = mongoose.Schema;

const ShareSchema = new Schema({
    perSharePrice : {
        type: Number,
        index: true
    }
},{timestamps : true});


module.exports = mongoose.model(constants.DB_MODEL_REF.SHARES, ShareSchema);