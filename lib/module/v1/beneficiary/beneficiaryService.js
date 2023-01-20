
"use strict";

//========================== Load Modules Start =======================
const appUtils      = require("../../../appUtils");
//========================== Load internal modules ====================
const beneficiaryDao = require('./beneficiaryDao');
//========================== Load Modules End ==============================================


function create(fundDebit ,fundCredit , params){
    return beneficiaryDao.create(fundDebit ,fundCredit , params)
}
function getAllTransactionsAndFilter(params){
    return beneficiaryDao.getAllTransactionsAndFilter(params)
}

//========================== Export Module Start ==============================

module.exports = {
    create,
    getAllTransactionsAndFilter
};

//========================== Export Module End ===============================
