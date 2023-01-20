

"use strict";

//========================== Load Modules Start =======================

//========================== Load external modules ====================
// Load user service
var _ = require("lodash");
var Promise = require("bluebird");
var ip = require("ip");
var vCardsJS = require("vcards-js");
//========================== Load internal modules ====================

const beneficiaryService = require("./beneficiaryService");
const beneficiaryMapper = require("./beneficiaryMapper");

const appUtils = require("../../../appUtils");
const redisSession = require("../../../redisClient/session");
const redisClient = require("../../../redisClient/init");
const customException = require("../../../customException");
const emailService = require("../../../service/sendgrid_email");
const nodemailer = require("../../../service/nodemailer_email");
const constant = require("../../../constant");
const config = require("../../../config");


//========================== Load Modules End ==============================================
                   

function create(fundDebit ,fundCredit , params ,status) {
    return transactionService.createTransaction(fundDebit ,fundCredit , params ,status).then(function (result) {
      return result;
    });
  }


function list(params) {
  const getBenificiary =
  beneficiaryService.getAllTransactionsAndFilter(params);
  

  return Promise.all([getBenificiary])
  .then(function (result) {
    return beneficiaryMapper.benificiaryListMapping(
      result[0],
      params
    );
  });
}


//========================== Export Module Start ==============================

module.exports = {
   list,create
};

//========================== Export Module End ================================
