
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


//========================== Export Module Start ==============================

module.exports = {
    create,
    getAlGrievanceAndFilter,
   

   
    edit,
    deleteGrievance,
   
};

//========================== Export Module End ===============================
