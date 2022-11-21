"use strict";

//========================== Load Modules Start =======================
const appUtils      = require("../../../appUtils");
//========================== Load internal modules ====================
const customerAccountDao = require('./customerAccountDao');
const transactionFacade = require('../transaction/transactionFacade');
//========================== Load Modules End ==============================================


function isAccountTypeExists(params){
    return accountDao.isAccountTypeExists(params)
}
function create(params){
    return customerAccountDao.create(params)
}
function getAllAccountAndFilter(params){
    return customerAccountDao.getAllAccountAndFilter(params)
}
function getTotalAccount(params){
    return customerAccountDao.getTotalAccount(params);
}
function sameTypeAccountExists(params){
    console.log(params ,"NNNNNNNNNN")
    return customerAccountDao.sameTypeAccountExists(params);
}
function deleteAccount(params){
    // console.log(params ,"NNNNNNNNNN")
    if(params.isDeleted == 1){
        return customerAccountDao.softDeleteAccount(params)
    }else{
        return customerAccountDao.deleteAccount(params)
    }
}
function checkSenderBalance(params){
    
    return customerAccountDao.checkSenderBalance(params)
}
function fundDebit(params , param , transactionId){
    return customerAccountDao.fundDebit(params, param , transactionId)
}
function fundCredit( receiver , params ,transactionId){
    return customerAccountDao.fundCredit(receiver ,params ,transactionId)
}
function checkReceiverAccount(params){
    return customerAccountDao.checkReceiverAccount(params)
}
function createTransaction(fundDebit ,fundCredit , params , status , transactionId){
    return transactionFacade.createTransaction(fundDebit ,fundCredit , params , status,transactionId)
}
function createInitialTransaction(params){
    return transactionFacade.createInitialTransaction(params)
}
function changeTransactionStatus(params , status ){
    return transactionFacade.changeTransactionStatus(params , status)
}
function getUserAccount(params){
    return customerAccountDao.getUserAccount(params)
}
function isAccountNumberExists(params){
    return customerAccountDao.isAccountNumberExists(params)
}
function cancelTransactionStatus(params){
    return transactionFacade.cancelTransactionStatus(params)
}
function rollback(params, transactionId){
    return customerAccountDao.rollback(params, transactionId)
}
function cleanup(from , to , id){
    return customerAccountDao.cleanup(from , to , id)
}
function checkBalance(params){
    return customerAccountDao.checkBalance(params)
}
function getReceiverDetails(params){
    return customerAccountDao.getReceiverDetails(params)
}
function addBalance(params){
    return customerAccountDao.addBalance(params)
}
function sameAccountNumberExists(params){
    return customerAccountDao.sameAccountNumberExists(params)
}

//========================== Export Module Start ==============================

module.exports = {
    isAccountTypeExists,
    create,
    getTotalAccount,
    getAllAccountAndFilter,
    sameTypeAccountExists,
    deleteAccount,
    checkSenderBalance,
    fundDebit,
    fundCredit,
    checkReceiverAccount,
    createTransaction,
    getUserAccount,
    isAccountNumberExists,
    createInitialTransaction,
    changeTransactionStatus,
    cancelTransactionStatus,
    rollback,
    cleanup,
    checkBalance,
    getReceiverDetails,
    addBalance,
    sameAccountNumberExists
};

//========================== Export Module End ===============================
