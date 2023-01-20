"use strict";

//========================== Load Modules Start =======================

//========================== Load external modules ====================
// Load user service
var _ = require("lodash");
var Promise = require("bluebird");
var ip = require("ip");
var vCardsJS = require("vcards-js");
//========================== Load internal modules ====================

const accountService = require("./accountService");
const accountMapper = require("./accountMapper");

const appUtils = require("../../../appUtils");
const redisSession = require("../../../redisClient/session");
const redisClient = require("../../../redisClient/init");
const customException = require("../../../customException");
const emailService = require("../../../service/sendgrid_email");
const nodemailer = require("../../../service/nodemailer_email");
const constant = require("../../../constant");
const config = require("../../../config");
const { param } = require("./accountRoute");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

//========================== Load Modules End ==============================================
                   
function create(params) {
  let self = this;
  params.userType = appUtils.isSuperAdminAndAdminAndManager(params.userType);
  return accountService
    .isAccountTypeExists(params)
    .bind({})
    .then(function (isExist) {
      this.isExist = isExist;
      if (isExist != null) {
        throw customException.alreadyExistsAccountType();
      }
      return accountService.create(params);
    })
    .then(function (account) {
       return accountMapper.createMapping(account);
    })
    .catch(function (err) {
      throw err;
    });
}


function getAllAccounts(params) {

console.log(params)
const accountList = accountService.accountList(params);


return Promise.all([
  accountList,
])
  .then(function (result) {
    return accountMapper.accountListMapping(
      result[0],
      params
    );
  })
  .catch((err) => {
    console.log(err, "ttttttttttttttttttt");
  });
}


function editAccount(params){
  
  params.userType = appUtils.isSuperAdminAndAdmin(params.userType);
  return accountService.isAccountIdExists(params).then(function (isExist) {
    if(!isExist){
      throw customException.accountIdNotExists();
    }
  return accountService.editAccount(params).then(function (result) {
    if (result) {
      return accountMapper.editAccountMapping(result, params);
    } 
  });
});
}

function deleteAccount(params){
  params.userType = appUtils.isAdmin(params.userType);
  return accountService.deleteAccount(params).then(function (result) {
    if (result) {
      return accountMapper.deleteAccountMapping(result, params);
    } else {
      throw exceptions.yearNotExist();
    }
  });
}


//========================== Export Module Start ==============================

module.exports = {
    create,
    getAllAccounts,
    editAccount,
    deleteAccount
};

//========================== Export Module End ================================
