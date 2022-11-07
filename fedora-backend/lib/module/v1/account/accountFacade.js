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


//========================== Export Module Start ==============================

module.exports = {
    create
};

//========================== Export Module End ================================
