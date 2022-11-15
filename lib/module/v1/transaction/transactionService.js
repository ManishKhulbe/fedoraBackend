
"use strict";

//========================== Load Modules Start =======================
const appUtils      = require("../../../appUtils");
//========================== Load internal modules ====================
const transactionDao = require('./transactionDao');
//========================== Load Modules End ==============================================


function createTransaction(fundDebit ,fundCredit , params , status){
    return transactionDao.createTransaction(fundDebit ,fundCredit , params , status)
}
function getAllTransactionsAndFilter(params){
    return transactionDao.getAllTransactionsAndFilter(params)
}

function createInitialTransaction(params){
    return transactionDao.createInitialTransaction(params)
}

function changeTransactionStatus(params , status ){
    return transactionDao.changeTransactionStatus(params , status)
}

function cancelTransactionStatus(params){
    return transactionDao.cancelTransactionStatus(params)
}

//========================== Export Module Start ==============================

module.exports = {
    createTransaction,
    getAllTransactionsAndFilter,
    createInitialTransaction,
    changeTransactionStatus,
    cancelTransactionStatus
};

//========================== Export Module End ===============================
