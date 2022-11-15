

"use strict";

//========================== Load Modules Start =======================

//========================== Load external modules ====================
// Load user service
var _ = require("lodash");
var Promise = require("bluebird");
var ip = require("ip");
var vCardsJS = require("vcards-js");
//========================== Load internal modules ====================

const transactionService = require("./transactionService");
const transactionMapper = require("./transactionMapper");

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
                   

function createTransaction(fundDebit ,fundCredit , params ,status) {
    return transactionService.createTransaction(fundDebit ,fundCredit , params ,status).then(function (result) {
      return result;
    });
  }

function createInitialTransaction(params){
return transactionService.createInitialTransaction(params).then(function (result) {
      return result;
    });
}

function changeTransactionStatus(params , status ){
  return transactionService.changeTransactionStatus(params , status ).then(function (result) {
    return result;
  });

}

function cancelTransactionStatus(params){
  return transactionService.cancelTransactionStatus(params).then(function (result) {
    return result;
  });
}
function getTransactions(params) {
  const getAllTransactions =
    transactionService.getAllTransactionsAndFilter(params);
  // const getTotalTransations = transactionService.getTotalTransations(params);
  // const getAllTransactionsByMonth = transactionService.getAllTransactionsByMonth(params);

  return Promise.all([getAllTransactions])
  .then(function (result) {
    return transactionMapper.transactionListMapping(
      result[0],
      params
    );
  });
}


//========================== Export Module Start ==============================

module.exports = {
    createTransaction,
    getTransactions,
    createInitialTransaction,
    changeTransactionStatus,
    cancelTransactionStatus
};

//========================== Export Module End ================================
