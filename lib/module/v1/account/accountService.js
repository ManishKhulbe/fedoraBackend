"use strict";

//========================== Load Modules Start =======================
const appUtils      = require("../../../appUtils");
//========================== Load internal modules ====================
const accountDao = require('./accountDao');
//========================== Load Modules End ==============================================


function isAccountTypeExists(params){
    return accountDao.isAccountTypeExists(params)
}
function create(params){
    return accountDao.create(params)
}
function accountList(params){
    return accountDao.accountList(params)
}
function editAccount(params){
    return accountDao.editAccount(params)
}
function deleteAccount(params){
    console.log(params ,"NNNNNNNNNN")
    if(params.isDeleted == 1){
        return accountDao.softDeleteAccount(params)
    }else{
        return accountDao.deleteAccount(params)
    }
}
function getAccountId(params){
    return accountDao.getAccountId(params)
}
//========================== Export Module Start ==============================

module.exports = {
    isAccountTypeExists,
    create,
    accountList,
    editAccount,
    deleteAccount,
    getAccountId
};

//========================== Export Module End ===============================
