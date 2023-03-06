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
const EventEmitter = require("events");
const eventEmitter = new EventEmitter();
const {
  Worker,
  isMainThread,
  workerData,
  setEnvironmentData,
  getEnvironmentData,
} = require("node:worker_threads");
const awsSNS = require("../../../service/aws_sms");

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
      if (
        isExist.length > 2 &&
        (parseInt(accountDetails.accountType) == 7 ||
          parseInt(accountDetails.accountType) == 4 ||
          parseInt(accountDetails.accountType) == 2 ||
          parseInt(accountDetails.accountType) == 6)
      ) {
        throw customException.sameCustomerAlreadyExistsAccountType();
      } else if (
        isExist.length > 4 &&
        parseInt(accountDetails.accountType) == 3
      ) {
        throw customException.sameCustomerAlreadyExistsAccountType();
      } else if (
        isExist.length != 0 &&
        (parseInt(accountDetails.accountType) == 1 ||
          parseInt(accountDetails.accountType) == 5)
      ) {
        throw customException.sameCustomerAlreadyExistsAccountType();
      }

      let accountNumberSeqKey;
      let keyName;
      let allSequenceKeys = await customerAccountService.getAllSequenceKeys();
      console.log(allSequenceKeys, "allSequenceKeys");
      if (!allSequenceKeys) {
        throw customException.sequenceKeyNotFound();
      }
      switch (self.accountDetails.accountType) {
        case 1:
          accountNumberSeqKey = allSequenceKeys.accountNumberSeqKey1;
          keyName = "accountNumberSeqKey1";
          break;
        case 2:
          accountNumberSeqKey = allSequenceKeys.accountNumberSeqKey2;
          keyName = "accountNumberSeqKey2";
          break;
        case 3:
          accountNumberSeqKey = allSequenceKeys.accountNumberSeqKey3;
          keyName = "accountNumberSeqKey3";
          break;
        case 4:
          accountNumberSeqKey = allSequenceKeys.accountNumberSeqKey4;
          keyName = "accountNumberSeqKey4";
          break;
        case 5:
          accountNumberSeqKey = allSequenceKeys.accountNumberSeqKey5;
          keyName = "accountNumberSeqKey5";
          break;
        case 6:
          accountNumberSeqKey = allSequenceKeys.accountNumberSeqKey6;
          keyName = "accountNumberSeqKey6";
          break;
        case 7:
          accountNumberSeqKey = allSequenceKeys.accountNumberSeqKey7;
          keyName = "accountNumberSeqKey7";
          break;
      }

      let accountNumberSeqKeyInMOngo = +accountNumberSeqKey + 1;
      console.log(
        "🚀 ~ file: customerAccountFacade.js:110 ~ .then ~ accountNumberSeqKeyInMOngo",
        accountNumberSeqKeyInMOngo
      );
      return customerAccountService
        .setSequenceNumber(keyName, accountNumberSeqKeyInMOngo)
        .then((res) => {
          if (!res) {
            throw customException.unableToUpdateSequence();
          }
          if (accountNumberSeqKeyInMOngo < 10) {
            accountNumberSeqKeyInMOngo = `000${accountNumberSeqKeyInMOngo}`;
          } else if (accountNumberSeqKeyInMOngo < 100) {
            accountNumberSeqKeyInMOngo = `00${accountNumberSeqKeyInMOngo}`;
          } else if (accountNumberSeqKeyInMOngo < 1000) {
            accountNumberSeqKeyInMOngo = `0${accountNumberSeqKeyInMOngo}`;
          } else {
            accountNumberSeqKeyInMOngo = `${accountNumberSeqKeyInMOngo}`;
          }

          switch (
            self.accountDetails.accountType // 1 SBA, 2-RDA , 3-TDA , 4-LAA , 5-ODA , 6-BDA Business Deposit Account , 7-FFA
          ) {
            case 1:
              params.accountNumber =
                process.env.SolId + 10 + accountNumberSeqKeyInMOngo;
              break;
            case 2:
              params.accountNumber =
                process.env.SolId + 31 + accountNumberSeqKeyInMOngo;
              break;
            case 3:
              params.accountNumber =
                process.env.SolId + 30 + accountNumberSeqKeyInMOngo;
              break;
            case 4:
              params.accountNumber =
                process.env.SolId + 60 + accountNumberSeqKeyInMOngo;
              break;
            case 5:
              params.accountNumber =
                process.env.SolId + 50 + accountNumberSeqKeyInMOngo;
              break;
            case 6:
              params.accountNumber =
                process.env.SolId + 20 + accountNumberSeqKeyInMOngo;
              break;
            case 7:
              params.accountNumber =
                process.env.SolId + 11 + accountNumberSeqKeyInMOngo;
              break;
            default:
              params.accountNumber =
                process.env.SolId + 10 + accountNumberSeqKeyInMOngo;
          }
          return customerAccountService
            .create(params, self.accountDetails)
            .then(function (account) {
              console.log(account, "v");
              return customerAccountMapper.createMapping(account);
            })
            .catch(function (err) {
              throw err;
            });
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

async function editAccount(params) {
  params.userType = appUtils.isAdmin(params.userType);
  return customerAccountService.editAccount(params).then((result) => {
    if (result) {
      return customerAccountMapper.editAccountMapping(result, params);
    } else {
      throw customException.accountIdNotExists();
    }
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
      const getSenderAccountDetails =
        await customerAccountService.getSenderAccountDetails(params);

      if (!getSenderAccountDetails.length) {
        throw customException.senderAccountNumberNotExists();
      }
      if (getSenderAccountDetails[0].accountType == 4) {
        if (+params.transactionAmount > +isExist.laaLimit) {
          throw customException.setTxnLimitExceeded();
        }
      }
      if (getSenderAccountDetails[0].accountType == 5) {
        if (+params.transactionAmount > +isExist.odaLimit) {
          throw customException.setTxnLimitExceeded();
        }
      }
      let estimatedBalanceAfterTxn  =  getSenderAccountDetails[0].balance - (+params.transactionAmount)
    
      if(getSenderAccountDetails[0].accountType == 1 &&  estimatedBalanceAfterTxn <= (process.env.MINIMUM_BALANCE||2000) ){
        throw customException.setMinBalanceLimitExceeded(process.env.MINIMUM_BALANCE);
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
            // return awsSNS.sendSms( isExist.mobileNo,
            //   `Hello ${isExist.name}, your verification OTP for the fund transfer is ${self.payload.otp}. Please enter this code to complete your transaction. Thank you for using our service. - FEDORA INDIA`
            // )
            return appUtils
              .sendSmsToUser(
                isExist.mobileNo,
                `Hello ${isExist.name}, your verification OTP for the fund transfer is ${self.payload.otp}. Please enter this code to complete your transaction. Thank you for using our service. - FEDORA INDIA`
              )
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
      let SenderMsgStr = ` Your a/c no. ****${(result?.senderAccountUpdate?.accountNumber)
        .toString()
        .slice(-4)} is debited for Rs.${
        result?.finalTransaction?.transactionAmount
      } on ${
        result?.finalTransaction?.createdAt
      } By(Cash/Transfer) Avl Bal Rs:${
        result?.senderAccountUpdate?.balance
      }- Fedora India`;

      let receiverMsgStr = `Your A/c ${(result?.receiverAccountUpdate?.accountNumber)
        .toString()
        .slice(-4)} is Credited for Rs:${
        result?.finalTransaction?.transactionAmount
      } on ${result?.finalTransaction?.createdAt} by (
        Remark field- By Cash/By Transfer)ref no ${
          result?.finalTransaction?._id
        } Avl Bal Rs:${result?.receiverAccountUpdate.balance} -
        Fedora India`;

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
  console.log(senderAccount, "senderAccount", params);

  if (senderAccount.accountType == 4 || senderAccount.accountType == 5) {
    if (senderAccount.balance < 0) {
      if (
        Math.abs(senderAccount.balance) + +params.transactionAmount >
        senderAccount.allotedAmount
      ) {
        throw customException.reachedMaximumLimit();
      }
    } else {
      if (
        senderAccount.balance - +params.transactionAmount >
        senderAccount.allotedAmount
      ) {
        throw customException.reachedMaximumLimit();
      }
    }
  } else {
    let estimatedBalanceAfterTxn  =  senderAccount.balance - +params.transactionAmount;
    if( estimatedBalanceAfterTxn <= process.env.MINIMUM_BALANCE||2000 ){
        throw customException.setMinBalanceLimitExceeded(process.env.MINIMUM_BALANCE);
    }
    if (senderAccount.balance < params.transactionAmount) {
      throw customException.notSufficientBalance();
    }

  }

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
            return customerAccountMapper.fundTransferToOtherBankMapping(
              senderAccount,
              receiverAccount.otherBankDetails[i],
              transactionDetails
            );
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

async function addBalance(params) {
  params.userType = appUtils.isSuperAdminAndAdminAndManager(params.userType);

  let beneficiaryAccountExists =
    await customerAccountService.getReceiverAccount(params);
  console.log(
    "🚀 ~ file: customerAccountFacade.js:582 ~ addBalance ~ beneficiaryAccountExists",
    beneficiaryAccountExists
  );

  if (!beneficiaryAccountExists || beneficiaryAccountExists.length == 0) {
    throw customException.receiverAccountNumberNotExists();
  }

  if (params.transactionType == 2) {
    if (
      beneficiaryAccountExists[0].accountType == 4 ||
      beneficiaryAccountExists[0].accountType == 5
    ) {
      if (beneficiaryAccountExists[0].balance < 0) {
        if (
          Math.abs(beneficiaryAccountExists[0].balance) + +params.amount >
          beneficiaryAccountExists[0].allotedAmount
        ) {
          throw customException.reachedMaximumLimit();
        }
      } else {
        if (
          beneficiaryAccountExists[0].balance - +params.amount >
          beneficiaryAccountExists[0].allotedAmount
        ) {
          throw customException.reachedMaximumLimit();
        }
      }
    } else {
      if (beneficiaryAccountExists[0].balance < +params.amount) {
        throw customException.notSufficientBalance();
      }
    }
  }
  return customerAccountService
    .addBalance(params)
    .then(async function (result) {
      if (result) {
        return transactionDao
          .initiateTransactionByAdmin(params, result)
          .then((insetTransaction) => {
            eventEmitter.emit(
              "sendNotification",
              result,
              params,
              insetTransaction
            );
            return customerAccountMapper.addBalanceMapping(
              result,
              insetTransaction
            );
          });
      } else {
        throw customException.notInitiated();
      }
    });
}

eventEmitter.on(
  "sendNotification",
  async (result, params, insetTransaction) => {
    console.log(insetTransaction, "params===", (+params.amount).toFixed(2));
    if (params.userType != 1) {
      let getUser = await userDao.getUserByID(result.customerId);

      let message = ``;
      if (params.transactionType == 1) {
        message = `Your A/c ******${result.accountNumber.slice(
          -4
        )} is Credited for Rs:${(+params.amount).toFixed(
          2
        )} on ${result.updatedAt.toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        })} by ${
          params.remark ? params.remark : ""
        }  Avl Bal Rs:${(+result.balance).toFixed(2)} - Fedora India`;
      } else {
        message = `Your a/c no. ******${result.accountNumber.slice(
          -4
        )} is debited for Rs.${(+params.amount).toFixed(
          2
        )} on ${result.updatedAt.toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        })} By ${
          params.remark ? params.remark : ""
        } Avl Bal Rs:${(+result.balance).toFixed(2)} - Fedora India`;
      }
      //  awsSNS.sendSms( getUser.mobileNo, message)
      appUtils.sendSmsToUser(getUser.mobileNo, message);
    }
  }
);

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
  editAccount
};

//========================== Export Module End ================================
