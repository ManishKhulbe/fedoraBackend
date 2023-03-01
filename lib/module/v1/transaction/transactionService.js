
"use strict";

//========================== Load Modules Start =======================
const appUtils      = require("../../../appUtils");
//========================== Load internal modules ====================
const transactionDao = require('./transactionDao');
//========================== Load Modules End ==============================================


function createTransaction(fundDebit ,fundCredit , params , status , transactionId){
    return transactionDao.createTransaction(fundDebit ,fundCredit , params , status ,transactionId)
}
function getAllTransactionsAndFilter(params){
    return transactionDao.getAllTransactionsAndFilter(params)
}
function getAllViewTransactionsAndFilter(params){
    return transactionDao.getAllViewTransactionsAndFilter(params)
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
function getAllTransactionsAndFilterByAdmin(params){
    return transactionDao.getAllTransactionsAndFilterByAdmin(params)
}

function getTotalTransactions(params){
    return transactionDao.getTotalTransactions(params)
}

function getAllTransactionsByMonth(params){
    return transactionDao.getAllTransactionsByMonth(params)
}

function getAllViewTransactionsAndFilterByAdmin(params){
    return transactionDao.getAllViewTransactionsAndFilterByAdmin(params)
}

function detailsById(params){
    return transactionDao.detailsById(params)
}

function editTransaction(params , session){
    return transactionDao.editTransaction(params ,session)
}
function getStatement(params){
    return transactionDao.getStatement(params)
}
//========================== Export Module Start ==============================

module.exports = {
    createTransaction,
    getAllTransactionsAndFilter,
    createInitialTransaction,
    changeTransactionStatus,
    cancelTransactionStatus,
    getAllTransactionsAndFilterByAdmin,
    getTotalTransactions,
    getAllTransactionsByMonth,
    getAllViewTransactionsAndFilterByAdmin,
    getAllViewTransactionsAndFilter,
    detailsById,
    editTransaction,
    getStatement
};

//========================== Export Module End ===============================
