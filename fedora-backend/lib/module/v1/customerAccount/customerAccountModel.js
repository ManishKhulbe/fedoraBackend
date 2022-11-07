// Importing mongoose
var mongoose = require("mongoose");
var constants = require('../../../constant');

var Schema = mongoose.Schema;
var CustomerAccount;

var CustomerAccountSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: constants.DB_MODEL_REF.USER,
    },
    accountId: {
        type: Schema.Types.ObjectId,
        ref: constants.DB_MODEL_REF.ACCOUNT,
    },
    accountLastAccessTime: {
        type: Date,
        default: Date.now
    },
}, { timestamps: true }
);

//Export user module
CustomerAccount = module.exports = mongoose.model(constants.DB_MODEL_REF.CUSTOMER_ACCOUNT, CustomerAccountSchema);


