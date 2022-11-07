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
//========================== Export Module Start ==============================

module.exports = {
    isAccountTypeExists,
    create
};

//========================== Export Module End ===============================
