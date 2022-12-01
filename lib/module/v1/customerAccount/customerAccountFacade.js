"use strict";

//========================== Load Modules Start =======================

//========================== Load external modules ====================
// Load user service
var _ = require("lodash");
var Promise = require("bluebird");
var ip = require("ip");
var vCardsJS = require("vcards-js");
var mongoose = require("mongoose");
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
const benificiaryService = require('../beneficiary/beneficiaryService')

const customerAccountModel = require('./customerAccountModel');
let BaseDao = require('../../../dao/baseDao');
const customerAccountDao = new BaseDao(customerAccountModel);
const fundTransferLogic = require('./customerFundTransfer')

const dbConfig = require('../../../config/dbConfig');


const {
  Worker,
  isMainThread,
  workerData,
  setEnvironmentData,
  getEnvironmentData,
} = require('node:worker_threads');
//========================== Load Modules End ==============================================

function create(params) {
  let self = this;
  params.userType = appUtils.isAdmin(params.userType);
  return customerAccountService.sameAccountNumberExists(params).then(function (isExist){
    if(isExist.length != 0){
    throw customException.accountNumberAlreadyExist();
    }
    return customerAccountService.sameTypeAccountExists(params).then((isExist)=>{
      console.log(isExist ,"VVVVVVVVVVVVVVVVVVVVVVv")
  if(isExist.length != 0){
    throw customException.sameCustomerAlreadyExistsAccountType();
  }
  return customerAccountService
    .create(params)
    .then(function (account) {
      return customerAccountMapper.createMapping(account);
    })
    .catch(function (err) {
      throw err;
    });
  })
  })
 
}

function getAllAccount(params) {
  params.userType = appUtils.isSuperAdminAndAdminAndManagerAndViewer(params.userType);
  const getAllAccounts = customerAccountService.getAllAccountAndFilter(params);
  const getTotalAccounts = customerAccountService.getTotalAccount1(params);
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

function deleteAccount(params) {
  params.userType = appUtils.isAdmin(params.userType);
  return customerAccountService.deleteAccount(params).then(function (result) {
    if (result) {
      return customerAccountMapper.deleteAccountMapping(result, params);
    } else {
      throw exceptions.yearNotExist();
    }
  });
}


function getUserAccount(params) {
  // params.userType = appUtils.isSuperAdminAndAdminAndManagerAndViewer(params.userType);
  return customerAccountService.getUserAccount(params).then(function (result) {
    if (result) {
      return customerAccountMapper.getUserAccountMapping(result);
    } else {
      throw exceptions.yearNotExist();
    }
  });
}
async function fundTransfer(params) {
  
  let self = this;

    
    return customerAccountService
    .checkSenderBalance(params)
    .then(function (result) {
      if (result.length != 0) {
        self.result = result;

        return customerAccountService
          .checkReceiverAccount(params)
          .then(function (isExist) {
            if (isExist.length != 0) {
              self.result1 = isExist
              if (self.result[0].balance > params.transactionAmount) {


                return customerAccountService.createInitialTransaction(params).then((res)=>{
                  if(res){
                     let transactionId = res._id;
                     self.transactionId = transactionId;


                    return customerAccountService.changeTransactionStatus(res , 1).then((result)=>{
                      console.log(self.transactionId)
                      
                      if (result.modifiedCount == 0) {
                        customerAccountService.cancelTransactionStatus(self.transactionId);
                        throw customException.failedToChangeStatus(result._id)
                      }


                      return customerAccountService
                      .fundDebit(self.result, params , self.transactionId)
                      .then(function (result) {
                      
                        if (result) {
                          self.fundDebit= result
                          console.log(result ,"funddebit")
                          // throw customException.notSufficientBalance()
    
                          return customerAccountService
                            .fundCredit(self.result1 , params ,self.transactionId )
                            .then(function (result) {
                              
                              if (result) {
                                self.fundCredit = result
    
                                return customerAccountService.createTransaction(self.fundDebit ,self.fundCredit , params ,1 ,self.transactionId).then(async function(transactionDetails){
                                  if(transactionDetails){
                                    return benificiaryService.create(self.fundDebit ,self.fundCredit , params).then((result)=>{
                                      console.log(result ,"MMMMM")
                                      customerAccountService.cleanup(self.fundDebit ,self.fundCredit, transactionId);
                                      return customerAccountMapper.fundTransferMapping(
                                        self.fundDebit,
                                        self.fundCredit,
                                        transactionDetails
                                      );
                                    })
                                  }else{
                                    customerAccountService.rollback(params, self.transactionId);
                                    throw customException.failedToMoveTransaction(params);
                                  }
                                    
                                })
                              } else {
                                customerAccountService.rollback(params, self.transactionId);
                            throw customException.failedToCredit(params);
                              }
                            })
                        } else {
                          customerAccountService.rollback(params, self.transactionId);
                            throw customException.failedToDebit(params);
                        }
                      });
                    })
                   
                  }else{
                    throw customException.notInitiated();
                  }
                })
                
              } else {
             
                throw customException.notSufficientBalance();
              }
            } else {
              
              throw customException.receiverAccountNumberNotExists();
            }
          });
      } else {
        throw customException.senderAccountNumberNotExists();
      }
    });
}

async function fundTransfer1(params){
  // mongoose.connect(dbUrl, dbOptions);
// if(isMainThread){

  // let worker = new Worker('/home/mobcoder/FEDORA-INDIA/fedoraindia-backend/lib/module/v1/customerAccount/customerFundTransfer.js' ,{  workerData :{params} });
  return fundTransferLogic.fundTransfer( params).then((result)=>{
    return customerAccountMapper.fundTransfer1Mapping(
      result
    );
  }).catch((err)=>{
    throw err
  })
// }
}


function getReceiverDetails(params) {
  return customerAccountService.getReceiverDetails(params).then(function (result) {
    if (result) {
      if(result.length == 0){
        throw customException.accountNumberNotExists()
      }
      return customerAccountMapper.getReceiverDetailsMapping(result);
    } else {
      throw customException.receiverAccountNumberNotExists();
    }
  });
}
// params.userType = appUtils.isAdmin(params.userType);


function addBalance(params) {
  params.userType = appUtils.isSuperAdminAndAdminAndManager(params.userType);
  return customerAccountService.addBalance(params).then(function (result) {
    if (result) {
      return customerAccountMapper.addBalanceMapping(result);
    } else {
      throw customException.receiverAccountNumberNotExists();
    }
  });
}


function checkBalance(params) {
  console.log(params)
  // return customerAccountService.checkBalance(params).then(function (result) {
  //   if (result.length != 0) {
  //     return customerAccountMapper.checkBalanceMapping(result);
  //   } else {
  //     throw exceptions.yearNotExist();
  //   }
  // });
}

function calculateInterest(params){
  params.userType = appUtils.isAdmin(params.userType);
  return customerAccountService.getInterestByType(params).then((interest)=>{
    if(interest){
      console.log(params ,"kkkk" ,interest)
      let interestTimePeriod ;
      if(params.timePeriodType == 1){
        interestTimePeriod =   parseInt(params.timePeriod)/365
        //round off to 2 decimal places
        interestTimePeriod = Math.round(interestTimePeriod * 100) / 100
      }
      else if(params.timePeriodType == 2){
      
        interestTimePeriod = parseInt(params.timePeriod)/12
        interestTimePeriod = Math.round(interestTimePeriod * 100) / 100
      }
      else if(params.timePeriodType == 3){
        interestTimePeriod = parseInt(params.timePeriod)
        interestTimePeriod = Math.round(interestTimePeriod * 100) / 100
      }
      console.log(interestTimePeriod ,"interestTimePeriod")
      return customerAccountService.calculateInterest(params , interest ,interestTimePeriod).then((result)=>{
        if(result){
          return customerAccountMapper.calculateInterestMapping(result);
        }else{
          throw customException.failedToCalculateInterest();
        }
      })
    }else{
      throw customException.interestTypeNotExists();
    }
  })
  
}
//========================== Export Module Start ==============================

module.exports = {
  create,
  getAllAccount,
  deleteAccount,
  fundTransfer,
  getUserAccount,
  checkBalance,
  getReceiverDetails,
  addBalance,
  fundTransfer1,
  calculateInterest
};

//========================== Export Module End ================================
