"use strict";

//========================== Load Modules Start =======================
const appUtils      = require("../../../appUtils");
//========================== Load internal modules ====================
const customerAccountDao = require('./customerAccountDao');
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
//========================== Export Module Start ==============================

module.exports = {
    isAccountTypeExists,
    create,
    getTotalAccount,
    getAllAccountAndFilter
};

//========================== Export Module End ===============================
