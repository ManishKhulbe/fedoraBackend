"use strict";

//========================== Load Modules Start =======================

//========================== Load external modules ====================
// Load user service
var _ = require("lodash");
var Promise = require("bluebird");
var ip = require("ip");
var vCardsJS = require("vcards-js");
//========================== Load internal modules ====================

const customerAccountService = require("./customerAccountService");
const customerAccountMapper = require("./customerAccountMapper");

const appUtils = require("../../../appUtils");
const redisSession = require("../../../redisClient/session");
const redisClient = require("../../../redisClient/init");
const customException = require("../../../customException");
const emailService = require("../../../service/sendgrid_email");
const nodemailer = require("../../../service/nodemailer_email");
const constant = require("../../../constant");
const config = require("../../../config");
// const { param } = require("./accountRoute");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

//========================== Load Modules End ==============================================

function create(params) {
  let self = this;
  return customerAccountService
    .create(params)
    .then(function (account) {
      return customerAccountMapper.createMapping(account);
    })
    .catch(function (err) {
      throw err;
    });
}

function getAllAccount(params) {
  const getAllAccounts = customerAccountService.getAllAccountAndFilter(params);
  const getTotalAccounts = customerAccountService.getTotalAccount(params);
  // const getAllTransactionsByMonth = transactionService.getAllTransactionsByMonth(params);

  return Promise.all([getAllAccounts, getTotalAccounts]).then(function (
    result
  ) {
    return customerAccountMapper.accountListMapping(
      result[0],
      result[1],
      params
    );
  });
}

//========================== Export Module Start ==============================

module.exports = {
  create,
  getAllAccount,
};

//========================== Export Module End ================================
