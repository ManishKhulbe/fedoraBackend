
"use strict";

//========================== Load Modules Start =======================
const appUtils      = require("../../../appUtils");
//========================== Load internal modules ====================
const transactionDao = require('./transactionDao');
//========================== Load Modules End ==============================================


function createTransaction(fundDebit ,fundCredit , params , status){
    return transactionDao.createTransaction(fundDebit ,fundCredit , params , status)
}

//========================== Export Module Start ==============================

module.exports = {
    createTransaction
};

//========================== Export Module End ===============================
