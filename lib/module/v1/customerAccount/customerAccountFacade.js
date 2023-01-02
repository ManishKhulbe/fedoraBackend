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
const benificiaryService = require("../beneficiary/beneficiaryService");
const transactionDao = require("../transaction/transactionDao");
const customerAccountModel = require("./customerAccountModel");
let BaseDao = require("../../../dao/baseDao");
const customerAccountDao = new BaseDao(customerAccountModel);
const fundTransferLogic = require("./customerFundTransfer");
const pushNotification = require("../../../service/pushNotification");
const dbConfig = require("../../../config/dbConfig");
const userDao = require("../user/userDao");
const notificationDao = require("../fedoraNotification/fedoraNotificationDao");
const accountDao = require("../account/accountDao");
const userService = require("../user/userService");
const {
  Worker,
  isMainThread,
  workerData,
  setEnvironmentData,
  getEnvironmentData,
} = require("node:worker_threads");

//========================== Load Modules End ==============================================

async function create(params) {
  
  let self = this;
  params.userType = appUtils.isAdmin(params.userType);

  const accountDetails = await accountDao.isAccountIdExists(params);
  self.accountDetails = accountDetails;
  return customerAccountService
    .sameTypeAccountExists(params, accountDetails)
    .then(async (isExist) => {
      console.log(isExist, "VVVVVVVVVVVVVVVVVVVVVV1v");
      if (isExist.length != 0) {
        throw customException.sameCustomerAlreadyExistsAccountType();
      }
      const accountNumberSeqKey = await redisClient.getSequenceNumber("accountNumberSeqKey");
      console.log("🚀 ~ file: customerAccountFacade.js:65 ~ .then ~ accountNumberSeqKey", accountNumberSeqKey)
      
      let accountNumberSeqKeyInRedis = +accountNumberSeqKey + 1;
      return redisClient
        .setSequenceNumber(
          "accountNumberSeqKey",
          accountNumberSeqKeyInRedis
        )
        .then((res) => {
          if (res) {
            if (accountNumberSeqKeyInRedis < 10) {
              accountNumberSeqKeyInRedis = `000${accountNumberSeqKeyInRedis}`;
            } else if (accountNumberSeqKeyInRedis < 100) {
              accountNumberSeqKeyInRedis = `00${accountNumberSeqKeyInRedis}`;
            } else if (accountNumberSeqKeyInRedis < 1000) {
              accountNumberSeqKeyInRedis = `0${accountNumberSeqKeyInRedis}`;
            } else {
              accountNumberSeqKeyInRedis = `${accountNumberSeqKeyInRedis}`;
            }
            console.log(self.accountDetails)
            switch (
              self.accountDetails.accountType // 1 SBA, 2-RDA , 3-TDA , 4-LAA , 5-ODA , 6-BDA Business Deposit Account , 7-FFA
            ) {
              case 1:
                params.accountNumber =
                  process.env.SolId + 10 + accountNumberSeqKeyInRedis;
                break;
              case 2:
                params.accountNumber =
                  process.env.SolId + 31 + accountNumberSeqKeyInRedis;
                break;
              case 3:
                params.accountNumber =
                  process.env.SolId + 30 + accountNumberSeqKeyInRedis;
                break;
              case 4:
                params.accountNumber =
                  process.env.SolId + 60 + accountNumberSeqKeyInRedis;
                break;
              case 5:
                params.accountNumber =
                  process.env.SolId + 50 + accountNumberSeqKeyInRedis;
                break;
              case 6:
                params.accountNumber =
                  process.env.SolId + 20 + accountNumberSeqKeyInRedis;
                break;
              case 7:
                params.accountNumber =
                  process.env.SolId + 11 + accountNumberSeqKeyInRedis;
                break;
              default:
                params.accountNumber =
                  process.env.SolId + 10 + accountNumberSeqKeyInRedis;
            }
            return customerAccountService
            .create(params, self.accountDetails)
            .then(function (account) {
              console.log(account,"v")
              return customerAccountMapper.createMapping(account);
            })
            .catch(function (err) {
              throw err;
            });
          }
        });
    });
}

function getAllAccount(params) {
  params.userType = appUtils.isSuperAdminAndAdminAndManagerAndViewer(
    params.userType
  );
  const getAllAccounts = customerAccountService.getAllAccountAndFilter(params);
  const getTotalAccounts = customerAccountService.getTotalAccount1(params);
  // const getAllTransactionsByMonth = transactionService.getAllTransactionsByMonth(params);

  return Promise.all([getAllAccounts, getTotalAccounts]).then(function (
    result
  ) {
    console.log(result, "vvvv");
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
              self.result1 = isExist;
              if (self.result[0].balance > params.transactionAmount) {
                return customerAccountService
                  .createInitialTransaction(params)
                  .then((res) => {
                    if (res) {
                      let transactionId = res._id;
                      self.transactionId = transactionId;

                      return customerAccountService
                        .changeTransactionStatus(res, 1)
                        .then((result) => {
                          console.log(self.transactionId);

                          if (result.modifiedCount == 0) {
                            customerAccountService.cancelTransactionStatus(
                              self.transactionId
                            );
                            throw customException.failedToChangeStatus(
                              result._id
                            );
                          }

                          return customerAccountService
                            .fundDebit(self.result, params, self.transactionId)
                            .then(function (result) {
                              if (result) {
                                self.fundDebit = result;
                                console.log(result, "funddebit");
                                // throw customException.notSufficientBalance()

                                return customerAccountService
                                  .fundCredit(
                                    self.result1,
                                    params,
                                    self.transactionId
                                  )
                                  .then(function (result) {
                                    if (result) {
                                      self.fundCredit = result;

                                      return customerAccountService
                                        .createTransaction(
                                          self.fundDebit,
                                          self.fundCredit,
                                          params,
                                          1,
                                          self.transactionId
                                        )
                                        .then(async function (
                                          transactionDetails
                                        ) {
                                          if (transactionDetails) {
                                            return benificiaryService
                                              .create(
                                                self.fundDebit,
                                                self.fundCredit,
                                                params
                                              )
                                              .then((result) => {
                                                console.log(result, "MMMMM");
                                                customerAccountService.cleanup(
                                                  self.fundDebit,
                                                  self.fundCredit,
                                                  transactionId
                                                );
                                                return customerAccountMapper.fundTransferMapping(
                                                  self.fundDebit,
                                                  self.fundCredit,
                                                  transactionDetails
                                                );
                                              });
                                          } else {
                                            customerAccountService.rollback(
                                              params,
                                              self.transactionId
                                            );
                                            throw customException.failedToMoveTransaction(
                                              params
                                            );
                                          }
                                        });
                                    } else {
                                      customerAccountService.rollback(
                                        params,
                                        self.transactionId
                                      );
                                      throw customException.failedToCredit(
                                        params
                                      );
                                    }
                                  });
                              } else {
                                customerAccountService.rollback(
                                  params,
                                  self.transactionId
                                );
                                throw customException.failedToDebit(params);
                              }
                            });
                        });
                    } else {
                      throw customException.notInitiated();
                    }
                  });
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

async function initiateFundTransfer(params) {
  console.log(params);

  let self = this;
  
  return userService.isUserIdExist(params).then(async (isExist) => {
   

    if (isExist) {
    
      const getSenderAccountDetails = await customerAccountService.getSenderAccountDetails(params)
      
      if(!getSenderAccountDetails.length){
        throw customException.senderAccountNumberNotExists()
      }
      if(getSenderAccountDetails[0].accountType == 4  ){
        if(+params.transactionAmount > +isExist.laaLimit){
          throw customException.setTxnLimitExceeded()
        }
      }
      if(getSenderAccountDetails[0].accountType == 5 ){
        if(+params.transactionAmount > +isExist.odaLimit){
          throw customException.setTxnLimitExceeded()
        }
      }
      let otp = appUtils.getRandomOtp();
      let payload = {
        email: isExist.email,
        subject: "Fund transfer otp from Fedora",
        template: "fundTransferOtp",
        otp,
        name: isExist.name,
        amount: params.transactionAmount,
        senderAccountNumber: params.senderAccountNumber,
      };
      self.payload = payload;
      let userObj = {
        customerId: isExist._id,
        status: isExist.status,
        userType: isExist.userType,
        mobileNo: isExist.mobileNo,
        params,
        otp,
      };
      console.log(userObj, "userObj");
      return redisClient
        .setFundTransferOTPValue(otp, userObj)
        .then(function (data) {
          if (data) {
            return appUtils
              .sendBySms(isExist.mobileNo, self.payload.otp)
              .then((data) => {
                console.log("twilio", data);
                if (data) {
                  return customerAccountMapper.otpSentMapping();
                }
                return emailService
                  .sendOtpMail(self.payload)
                  .then(function (data) {
                    return customerAccountMapper.otpSentMapping();
                  });
              });
          }
        });
    } else {
      throw customException.notRegisteredMobileNo();
    }
  });
}

async function validateFundTransferOtp(params) {
  return userService.getUserByID(params.userId).then((userDetails) => {
    if (userDetails) {
      return redisClient
        .OTPexist(+userDetails.mobileNo, "FTOTP")
        .then((isExist) => {
          if (isExist) {
            return redisClient
              .getFTOtpValue(userDetails.mobileNo)
              .then((data) => {
                let finalData = JSON.parse(data);
                console.log(
                  finalData,
                  "finalUserDatafinalUserDatafinalUserData"
                );
                if (finalData.otp != params.otp) {
                  throw customException.invalidOtp();
                }
                return fundTransfer1(finalData.params);
              });
          } else {
            throw customException.otpExpired();
          }
        });
    }
  });
}

async function fundTransfer1(params) {
  // mongoose.connect(dbUrl, dbOptions);
  // if(isMainThread){

  // let worker = new Worker('/home/mobcoder/FEDORA-INDIA/fedoraindia-backend/lib/module/v1/customerAccount/customerFundTransfer.js' ,{  workerData :{params} });
  return fundTransferLogic
    .fundTransfer(params)
    .then(async (result) => {
      const senderDeviceToken = await userDao.getUserDeviceToken(
        result.senderAccountUpdate.customerId
      );
      const receiverDeviceToken = await userDao.getUserDeviceToken(
        result.receiverAccountUpdate.customerId
      );

      let deviceIds = [
        senderDeviceToken.deviceToken,
        receiverDeviceToken.deviceToken,
      ];
      let dataToUser = [];

      let SenderMsgStr = `Debit
INR ${result?.finalTransaction?.transactionAmount} 
A/c no. ${(result?.senderAccountUpdate?.accountNumber).toString().slice(-4)}, 
  ${result?.finalTransaction?.createdAt}
your remaining account balance is ${
        result?.senderAccountUpdate?.balance
      } - Fedora MBanking`;

      let receiverMsgStr = `Dear Customer An Amount of INR
${
  result?.finalTransaction?.transactionAmount
} is credited to your account Number 
********${(result?.receiverAccountUpdate?.accountNumber)
        .toString()
        .slice(-4)}, from 
********${(result?.senderAccountUpdate?.accountNumber).toString().slice(-4)} `;

      dataToUser.push(SenderMsgStr);
      dataToUser.push(receiverMsgStr);
      for (let i = 0; i < deviceIds.length; i++) {
        if (i == 0) {
          notificationDao.addNotification({
            customerId: senderDeviceToken._id,
            profileImg: receiverDeviceToken?.profileImage,
            title: receiverDeviceToken.name,
            subTitle: `${result?.finalTransaction?.transactionAmount} sent`,
            body: dataToUser[i],
            additional: JSON.stringify(result.finalTransaction),
          });
          pushNotification.pushNotification(
            deviceIds[i],
            dataToUser[i],
            "Debit Successfully"
          );
        } else {
          notificationDao.addNotification({
            customerId: receiverDeviceToken._id,
            profileImg: senderDeviceToken?.profileImage,
            title: senderDeviceToken.name,
            subTitle: `${result?.finalTransaction?.transactionAmount} received`,
            body: dataToUser[i],
            additional: JSON.stringify(result.finalTransaction),
          });
          pushNotification.pushNotification(
            deviceIds[i],
            dataToUser[i],
            "Credit Successfully"
          );
        }
      }
      return customerAccountMapper.fundTransfer1Mapping(result);
    })
    .catch((err) => {
      console.log(err, "err");
      throw err;
    });
}

async function fundTransferToOtherBank(params) {
  const senderAccount = await customerAccountDao.findOne({
    accountNumber: params.senderAccountNumber,
    customerId: appUtils.objectIdConvert(params.userId),
  });
  if (!senderAccount) {
    throw customException.senderAccountNumberNotExists();
  }
  if (senderAccount.balance < +params.transactionAmount) {
    throw customException.notSufficientBalance();
  }
  console.log(senderAccount, "senderAccount", params);

  const receiverAccount = await userDao.getUserByID(params.userId);
  console.log(receiverAccount, "receiverAccount");

  for (let i = 0; i < receiverAccount.otherBankDetails.length; i++) {
    if (receiverAccount.otherBankDetails[i]._id == params.otherBankDetailsId) {
      console.log(receiverAccount.otherBankDetails[i]);

      return customerAccountService
        .initiateTransaction(
          senderAccount,
          receiverAccount.otherBankDetails[i],
          params,
          1
        )
        .then(async function (transactionDetails) {
          if (transactionDetails) {
            // return benificiaryService.create(senderAccount ,receiverAccount.otherBankDetails[i] , params).then((result)=>{
            //   console.log(result ,"MMMMM")
            return customerAccountMapper.fundTransferToOtherBankMapping(
              senderAccount,
              receiverAccount.otherBankDetails[i],
              transactionDetails
            );
            // })
          } else {
            throw customException.failedToMoveTransaction(params);
          }
        });
    }
  }
}
function getReceiverDetails(params) {
  return customerAccountService
    .getReceiverDetails(params)
    .then(function (result) {
      if (result) {
        if (result.length == 0) {
          throw customException.accountNumberNotExists();
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
  return customerAccountService
    .addBalance(params)
    .then(async function (result) {
      if (result) {
        return transactionDao
          .initiateTransactionByAdmin(params, result)
          .then((insetTransaction) => {
            return customerAccountMapper.addBalanceMapping(
              result,
              insetTransaction
            );
          });
      } else {
        throw customException.receiverAccountNumberNotExists();
      }
    });
}

function checkBalance(params) {
  console.log(params);
  // return customerAccountService.checkBalance(params).then(function (result) {
  //   if (result.length != 0) {
  //     return customerAccountMapper.checkBalanceMapping(result);
  //   } else {
  //     throw exceptions.yearNotExist();
  //   }
  // });
}

function calculateInterest(params) {
  params.userType = appUtils.isAdmin(params.userType);
  return customerAccountService.getInterestByType(params).then((interest) => {
    if (interest) {
      console.log(params, "kkkk", interest);
      let interestTimePeriod;
      if (params.timePeriodType == 1) {
        interestTimePeriod = parseInt(params.timePeriod) / 365;
        //round off to 2 decimal places
        interestTimePeriod = Math.round(interestTimePeriod * 100) / 100;
      } else if (params.timePeriodType == 2) {
        interestTimePeriod = parseInt(params.timePeriod) / 12;
        interestTimePeriod = Math.round(interestTimePeriod * 100) / 100;
      } else if (params.timePeriodType == 3) {
        interestTimePeriod = parseInt(params.timePeriod);
        interestTimePeriod = Math.round(interestTimePeriod * 100) / 100;
      }
      console.log(interestTimePeriod, "interestTimePeriod");
      return customerAccountService
        .calculateInterest(params, interest, interestTimePeriod)
        .then((result) => {
          if (result) {
            return customerAccountMapper.calculateInterestMapping(result);
          } else {
            throw customException.failedToCalculateInterest();
          }
        });
    } else {
      throw customException.interestTypeNotExists();
    }
  });
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
  calculateInterest,
  fundTransferToOtherBank,
  initiateFundTransfer,
  validateFundTransferOtp,
};

//========================== Export Module End ================================
