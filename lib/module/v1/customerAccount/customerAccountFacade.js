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
  params.userType = appUtils.isAdmin(params.userType);
//   return customerAccountService.sameTypeAccountExists(params).then((isExist)=>{
// if(!isExist){
//   throw customException.alreadyExistsAccountType();
// }
    return customerAccountService
    .create(params)
    .then(function (account) {
      return customerAccountMapper.createMapping(account);
    })
    .catch(function (err) {
      throw err;
    });
  // })
  
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

function deleteAccount(params){
 
  params.userType = appUtils.isAdmin(params.userType);
  return customerAccountService.deleteAccount(params).then(function (result) {
    if (result) {
      return customerAccountMapper.deleteAccountMapping(result, params);
    } else {
      throw exceptions.yearNotExist();
    }
  });
}

function fundTransfer(params){
//check if user have enough balance
  return customerAccountService.fundTransfer(params).then(function (result) {
    if (result) {
      return customerAccountMapper.fundTransferMapping(result, params);
    } else {
      throw exceptions.yearNotExist();
    }
  });
}
// function createOrder(params) {


//             return employeeService
//               .debitAmountFromWallet(data)
//               .then(function (debitResult) {
//                 //                        console.log('debitResult-> ', debitResult)
//                 let data = {};
//                 data.userId = params.employeeId;
//                 data.orderId = result.order._id;
//                 data.walletAmount = debitedAmountFromWalletBalance;
//                 data.couponWalletAmount = debitedAmountFromCouponWalletBalance;
//                 data.amountType = constants.TRANSACTIONS.AMOUNT_TYPE.DEBIT;
//                 data.transactionType =
//                   constants.TRANSACTIONS.TYPE.ORDER_CREATE_AMOUNT_DEBIT;
//                 data.status = constants.TRANSACTIONS.STATUS.COMPLETE;
//                 return transactionService.createTransaction(data);
//               })
//               .then(function (transactionLogResult) {
//                 console.log("transactionLogResult ->", transactionLogResult);
//                 //                        console.log('order-> ', result)
//                 //                        console.log('params-> ', params)
//                 return result.order;
//               });
//           })
//           .then(function (result) {
//             let data = {};
//             data.userId = params.vendorId;
//             return employeeService
//               .getMyProfile(data)
//               .then(function (vendorData) {
//                                        console.log('vendorData->', vendorData)
//                 if (vendorData.deviceToken) {
//                   let register = {};
//                   register.deviceToken = vendorData.deviceToken;
//                   register.platform = vendorData.platform;
//                   register.title = constants.NOTIFICATION_TITLE.ORDER;
//                   register.body = constants.NOTIFICATION_BODY.ORDER.NEW;
//                   register.type = String(constants.NOTIFICATION_TYPE.ORDER);
//                   register.sound = constants.NOTIFICATION_SOUND.VENDOR;
//                   foodOrderService.sendOrderNotification(register, result);
//                 }
//                 return result;
//               });
//           })
//           .then(function (result) {
//             return foodOrderMapper.CreateOrderMapping(result, params);
//           });
//       }
//     });
// }

//========================== Export Module Start ==============================

module.exports = {
  create,
  getAllAccount,
  deleteAccount,
  fundTransfer
};

//========================== Export Module End ================================
