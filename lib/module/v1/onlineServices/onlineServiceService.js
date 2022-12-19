
"use strict";

//========================== Load Modules Start =======================
const appUtils      = require("../../../appUtils");
//========================== Load internal modules ====================
const onlineServiceDao = require("./onlineServiceDao");
const accountService = require("../account/accountService");
//========================== Load Modules End ==============================================


function apply(params , serviceDetails){
    return onlineServiceDao.apply(params , serviceDetails)
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
function editByCustomer(params ,serviceDetails ){
    return onlineServiceDao.editByCustomer(params ,serviceDetails)
}

function deleteService(params){
 
    if(params.isDeleted == 1){
        return onlineServiceDao.softDeleteOnlineService(params)
    }else{
        return onlineServiceDao.deleteOnlineService(params)
    }
}

function totalOnlineService(params){
    return onlineServiceDao.totalOnlineService(params)
}

function pendingOnlineServices(params){
    return onlineServiceDao.pendingOnlineServices(params)
}
function completedOnlineServices(params){
    return onlineServiceDao.completedOnlineServices(params)
}

function rejectedOnlineServices(params){
    return onlineServiceDao.rejectedOnlineServices(params)
}

function applyFedoraCash(params , serviceDetails){
    return onlineServiceDao.applyFedoraCash(params , serviceDetails)
}

function isOnlineServiceIdExists(params){
    return onlineServiceDao.isOnlineServiceIdExists(params)
}
//========================== Export Module Start ==============================

module.exports = {
    getAccountId,
    apply,
    list,
    edit,
    deleteService,
    totalOnlineService,
    pendingOnlineServices,
    completedOnlineServices,
    rejectedOnlineServices,
    applyFedoraCash,
    isOnlineServiceIdExists,
    editByCustomer
};

//========================== Export Module End ===============================
