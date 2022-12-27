
"use strict";

//========================== Load Modules Start =======================
const appUtils      = require("../../../appUtils");
//========================== Load internal modules ====================
const grievanceDao = require('./grievanceDao');
//========================== Load Modules End ==============================================


function create( params){
    return grievanceDao.create( params)
}

function getAlGrievanceAndFilter(params){
    return grievanceDao.getAlGrievanceAndFilter(params)
}

function edit(params){
    return grievanceDao.edit(params)
}
function deleteGrievance(params){
    return grievanceDao.deleteGrievance(params)
}

function totalGrievance(params){
    return grievanceDao.totalGrievance(params)
}
//========================== Export Module Start ==============================

module.exports = {
    create,
    getAlGrievanceAndFilter,
    totalGrievance,
    edit,
    deleteGrievance,
   
};

//========================== Export Module End ===============================
