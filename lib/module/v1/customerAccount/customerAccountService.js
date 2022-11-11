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
function fundDebit(params , param){
    return customerAccountDao.fundDebit(params, param)
}
function fundCredit( receiver , params ){
    return customerAccountDao.fundCredit(receiver ,params)
}
function checkReceiverAccount(params){
    return customerAccountDao.checkReceiverAccount(params)
}
function createTransaction(fundDebit ,fundCredit , params , status){
    return transactionFacade.createTransaction(fundDebit ,fundCredit , params , status)
}
function getUserAccount(params){
    return customerAccountDao.getUserAccount(params)
}
function isAccountNumberExists(params){
    return customerAccountDao.isAccountNumberExists(params)
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
    isAccountNumberExists
};

//========================== Export Module End ===============================
