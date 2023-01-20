"use strict";

//========================== Load Modules Start =======================

//========================== Load external modules ====================
// Load user service
var _ = require("lodash");
var Promise = require("bluebird");
var ip = require("ip");
var vCardsJS = require("vcards-js");
//========================== Load internal modules ====================

const grievanceService = require("./grievanceService");
const grievanceMapper = require("./grievanceMapper");

const appUtils = require("../../../appUtils");
const redisSession = require("../../../redisClient/session");
const redisClient = require("../../../redisClient/init");
const customException = require("../../../customException");
const emailService = require("../../../service/sendgrid_email");
const nodemailer = require("../../../service/nodemailer_email");
const constant = require("../../../constant");
const config = require("../../../config");
const userDao = require('../user/userDao')

//========================== Load Modules End ==============================================

async function create(params) {

    let userDetails = await userDao.getUserByID(params.userId)
 
    if(userDetails){
        params.customerName = userDetails.name,
        params.customerEmail = userDetails.email,
        params.customerMobile = userDetails.mobileNo

    }
    return grievanceService.create(params).then(function (result) {
      return grievanceMapper.createGrievanceMapping(result);
    });
 
}



function list(params) {
  params.userType = appUtils.isSuperAdminAndAdminAndManagerAndViewer(params.userType);
  const getGrievance = grievanceService.getAlGrievanceAndFilter(params);
  const totalGrievance = grievanceService.totalGrievance(params);

  return Promise.all([getGrievance,totalGrievance]).then(function (result) {
    return grievanceMapper.getGrievanceMapping(result[0],result[1] ,params);
  });
}

function edit(params) {
  params.userType = appUtils.isSuperAdminAndAdmin(params.userType);
    return grievanceService.edit(params).then(function (result) {
      return grievanceMapper.editGrievanceMapping(result);
    });
}

function deleteGrievance(params) {
    params.userType = appUtils.isSuperAdminAndAdmin(params.userType);
 
    return grievanceService.deleteGrievance(params).then(function (result) {
      return grievanceMapper.deleteGrievanceMapping(result);
    });

}



//========================== Export Module Start ==============================

module.exports = {
  list,
  create,
  edit,
  deleteGrievance
};

//========================== Export Module End ================================
