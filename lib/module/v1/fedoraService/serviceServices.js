
"use strict";

//========================== Load Modules Start =======================
const appUtils      = require("../../../appUtils");
//========================== Load internal modules ====================
const serviceDao = require('./serviceDao');
//========================== Load Modules End ==============================================


function create( params){
    return serviceDao.create( params)
}
function createOptions(params , isExists){
    return serviceDao.createOptions(params , isExists)
}
function getAllTransactionsAndFilter(params){
    return serviceDao.getAllTransactionsAndFilter(params)
}
function isExistsService(params){
    return serviceDao.isExistsService(params)
}
function getAlServiceAndFilter(params){
    return serviceDao.getAlServiceAndFilter(params)
}
function isServiceIdExists(params){
    return serviceDao.isServiceIdExists(params)
}
function edit(params){
    return serviceDao.edit(params)
}
function deleteService(params){
    console.log(params)
    if(params.isDeleted == 1){
        return serviceDao.softDeleteService(params)
    }else{
        return serviceDao.deleteService(params)
    }
}

function editOptionAction(params){
    return serviceDao.editOptionAction(params)
}
function deleteOptionAction(params){
    return serviceDao.deleteOptionAction(params)
}
//========================== Export Module Start ==============================

module.exports = {
    create,
    getAllTransactionsAndFilter,
    isExistsService,
    getAlServiceAndFilter,
    isServiceIdExists,
    edit,
    deleteService,
    createOptions,
    editOptionAction,
    deleteOptionAction
};

//========================== Export Module End ===============================
