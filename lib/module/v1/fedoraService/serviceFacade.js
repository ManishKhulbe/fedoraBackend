"use strict";

//========================== Load Modules Start =======================

//========================== Load external modules ====================
// Load user service
var _ = require("lodash");
var Promise = require("bluebird");
var ip = require("ip");
var vCardsJS = require("vcards-js");
//========================== Load internal modules ====================

const serviceServices = require("./serviceServices");
const serviceMapper = require("./serviceMapper");

const appUtils = require("../../../appUtils");
const redisSession = require("../../../redisClient/session");
const redisClient = require("../../../redisClient/init");
const customException = require("../../../customException");
const emailService = require("../../../service/sendgrid_email");
const nodemailer = require("../../../service/nodemailer_email");
const constant = require("../../../constant");
const config = require("../../../config");

//========================== Load Modules End ==============================================

function create(params) {
  params.userType = appUtils.isSuperAdminAndAdminAndManager(params.userType);
  return serviceServices.isExistsService(params).then(function (isExists) {
    console.log(isExists);
    if (isExists) {
      throw customException.serviceAlreadyExists();
    }
    return serviceServices.create(params).then(function (result) {
      return serviceMapper.createServiceMapping(result);
    });
  });
}

function createOptions(params) {
    params.userType = appUtils.isSuperAdminAndAdminAndManager(params.userType);
 
  return serviceServices.isServiceIdExists(params).then(function (isExists) {
    console.log(isExists);
    if (!isExists) {
      throw customException.serviceIdNotExists();
    }
    return serviceServices.createOptions(params , isExists).then(function (result) {
      return serviceMapper.createOptionMapping(result);
    });
  });
}


function list(params) {
  // console.log(params)
  // params.userType = appUtils.isAdmin(params.userType);
  const getService = serviceServices.getAlServiceAndFilter(params);

  return Promise.all([getService]).then(function (result) {
    return serviceMapper.serviceListMapping(result[0], params);
  });
}

function edit(params) {
  params.userType = appUtils.isSuperAdminAndAdmin(params.userType);
  return serviceServices.isServiceIdExists(params).then(function (isExists) {
    if (!isExists) {
      throw customException.serviceAlreadyExists();
    }
    return serviceServices.edit(params).then(function (result) {
      return serviceMapper.editServiceMapping(result);
    });
  });
}

function deleteService(params) {
  params.userType = appUtils.isAdmin(params.userType);
  return serviceServices.isServiceIdExists(params).then(function (isExists) {
    if (!isExists) {
      throw customException.serviceAlreadyExists();
    }
    return serviceServices.deleteService(params).then(function (result) {
      return serviceMapper.deleteServiceMapping(result);
    });
  });
}

function editOptionAction(params) {
  params.userType = appUtils.isSuperAdminAndAdmin(params.userType);
  // return serviceServices.isServiceIdExists(params).then(function (isExists) {
  //   if (!isExists) {
  //     throw customException.serviceAlreadyExists();
  //   }
    return serviceServices.editOptionAction(params).then(function (result) {
      return serviceMapper.editServiceMapping(result);
    });
  // });
}

function deleteOptionAction(params){
  params.userType = appUtils.isSuperAdminAndAdmin(params.userType);
  return serviceServices.isServiceIdExists(params).then(function (isExists) {
    console.log(isExists);
    if (!isExists) {
      throw customException.serviceIdNotExists();
    }
    return serviceServices.deleteOptionAction(params).then(function (result) {
      return serviceMapper.deleteServiceMapping(result);
    });
  });
}

//========================== Export Module Start ==============================

module.exports = {
  list,
  create,
  edit,
  deleteService,
  createOptions,
  editOptionAction,
  deleteOptionAction
};

//========================== Export Module End ================================
