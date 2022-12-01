"use strict";

//========================== Load Modules Start =======================

//========================== Load external modules ====================
// Load user service
var _ = require("lodash");
var Promise = require("bluebird");
var ip = require("ip");
var vCardsJS = require("vcards-js");
//========================== Load internal modules ====================

const onlineServiceService = require("./onlineServiceService");
const onlineServiceMapper = require("./onlineServiceMapper");

const appUtils = require("../../../appUtils");
const redisSession = require("../../../redisClient/session");
const redisClient = require("../../../redisClient/init");
const customException = require("../../../customException");
const emailService = require("../../../service/sendgrid_email");
const nodemailer = require("../../../service/nodemailer_email");
const constant = require("../../../constant");
const config = require("../../../config");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

//========================== Load Modules End ==============================================
                   
async function apply(params) {
  let self = this;
 console.log(params)
 if(params.accounType){
   let accountId = await onlineServiceService.getAccountId(params);
   params.accountId = accountId._id
 }
      return onlineServiceService.apply(params)
    .then(function (account) {
       return onlineServiceMapper.applyMapping(account);
    })
    .catch(function (err) {
      throw err;
    });
}

function list(params) {
    let self = this;
    params.userType = appUtils.isSuperAdminAndAdminAndManagerAndViewer(params.userType);
    return onlineServiceService.list(params)

    .then(function (account) {
        return onlineServiceMapper.listMapping(account);
    })
    .catch(function (err) {
        throw err;
    });
}

function edit(params){
console.log(params)
params.userType = appUtils.isAdmin(params.userType);
return onlineServiceService.edit(params)
.then(function (account) {
    return onlineServiceMapper.editMapping(account);
}
)
.catch(function (err) {
    throw err;
})

}

function deleteService(params){
  
    params.userType = appUtils.isAdmin(params.userType);
    return onlineServiceService.deleteService(params).then(function (result) {
      if (result) {
        return onlineServiceMapper.deleteOnlineServiceMapping(result, params);
      } else {
        throw exceptions.yearNotExist();
      }
    });

}




//========================== Export Module Start ==============================

module.exports = {
    apply,list,edit,deleteService
};

//========================== Export Module End ================================
