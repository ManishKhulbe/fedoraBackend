
"use strict";

//========================== Load Modules Start =======================
const appUtils      = require("../../../appUtils");
//========================== Load internal modules ====================
const onlineServiceDao = require("./onlineServiceDao");
const accountService = require("../account/accountService");
//========================== Load Modules End ==============================================


function apply(params){
    return onlineServiceDao.apply(params)
}
function getAccountId(params){
    return accountService.getAccountId(params)
}
function list(params){
    return onlineServiceDao.list(params)
}
function edit(params){
    return onlineServiceDao.edit(params)
}

function deleteService(params){
 
    if(params.isDeleted == 1){
        return onlineServiceDao.softDeleteOnlineService(params)
    }else{
        return onlineServiceDao.deleteOnlineService(params)
    }
}

//========================== Export Module Start ==============================

module.exports = {
    getAccountId,
    apply,
    list,
    edit,
    deleteService
};

//========================== Export Module End ===============================
