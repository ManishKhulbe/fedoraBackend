//implement mongodb transaction
const mongoose = require("mongoose");
const appUtils = require("../../../appUtils");
const customException = require("../../../customException");
const customerAccountModel = require("./customerAccountModel");
let BaseDao = require("../../../dao/baseDao");
const { options } = require("./customerAccountRoute");
const customerAccountDao = new BaseDao(customerAccountModel);
const transactionModel = require("../transaction/transactionModel");
const transactionDao = require("../transaction/transactionDao");
const { parentPort, workerData } = require("worker_threads");
const worker = require("worker_threads");
const index = require("../../../config/index");
const userDao = require("../user/userDao");

let session;

async function fundTransfer(params) {
  session = await mongoose.connection.startSession();

  let self = this;
  console.log("gga", params);
  // while (true) {

  try {
    session.startTransaction();
    console.log(params, "m");

    const senderAccount = await customerAccountDao.findOne(
      { accountNumber: params.senderAccountNumber , accountStatus : 1, isDeleted : 0 },
      {},
      { session }
    );

    const receiverAccount = await customerAccountDao.findOne(
      { accountNumber: params.receiverAccountNumber, accountStatus :  1 , isDeleted : 0 },
      {},
      { session }
    );

    console.log(receiverAccount, "mmmm",senderAccount);
    if (!senderAccount || senderAccount == null) {
      throw customException.senderAccountNumberNotExists();
    }
    if (!receiverAccount || receiverAccount == null) {
      throw customException.receiverAccountNumberNotExists();
    }

    if(senderAccount.accountType == 4 ||senderAccount.accountType == 5 ){
      if(senderAccount.balance < 0){
        if(Math.abs(senderAccount.balance) + (+params.transactionAmount) > senderAccount.allotedAmount ){
          throw customException.reachedMaximumLimit();
        }
      }else{
        if(senderAccount.balance - (+params.transactionAmount) > senderAccount.allotedAmount ){
          throw customException.reachedMaximumLimit();
        }
      }
    
    }else {
      if (senderAccount.balance < params.transactionAmount) {
        throw customException.notSufficientBalance();
      }

    }
    
    const insetTransaction = await transactionDao.createInitialTransaction(
      params
    );

    if (!insetTransaction || insetTransaction == null) {
      throw customException.notInitiated();
    }
    self.transactionId = insetTransaction._id;

    let query1 = {};
    query1.accountNumber = params.senderAccountNumber;
    query1.customerId = params.userId;

    const senderAccountUpdate = await customerAccountDao
      .findOneAndUpdate(
        query1,
        { $inc: { balance: -parseFloat(params.transactionAmount) } },
        { new: true, session: session }
      )
      .then(function (result) {
        console.log(result, "..");
        if (result) {
          return result;
        } else {
          return false;
        }
      });

    if (!senderAccountUpdate) {
      throw customException.failedToDebit(params);
    }

    let query2 = {};
    query2.accountNumber = params.receiverAccountNumber;
    query2.customerId = receiverAccount.customerId;
    let receiverAccountUpdate;

    receiverAccountUpdate = await customerAccountDao
      .findOneAndUpdate(
        query2,
        { $inc: { balance: parseFloat(params.transactionAmount) } },
        { new: true, session: session }
      )
      .then(function (result) {
        console.log(result, "..");
        if (result) {
          return result;
        } else {
          return false;
        }
      });

    if (!receiverAccountUpdate) {
      throw customException.failedToCredit(params);
    }

    let finalTransaction = await transactionDao.createTransaction(
      senderAccountUpdate,
      receiverAccountUpdate,
      params,
      1,
      self.transactionId
    );

    //successfullyAdd beneficiary

    // console.log( senderAccount.customerId ,"senderAccount" , receiverAccount.customerId ,"receiverAccount",
    // senderAccount.customerId ==receiverAccount.customerId )
    console.log(receiverAccountUpdate, "receiverAccountUpdate");
    if (!receiverAccount.customerId.equals(senderAccount.customerId)) {
      let beneficiaryDetails = [];
      beneficiaryDetails.push({
        userId: receiverAccountUpdate.customerId,
        accountNumber: receiverAccountUpdate.accountNumber,
        accountType: receiverAccountUpdate.accountType,
      });
      console.log(beneficiaryDetails, "beneficiaryDetails");
      let addBeneficiary = await userDao.addBeneficiary(
        beneficiaryDetails,
        senderAccount.customerId
      );
    }
    if (!finalTransaction || finalTransaction == null) {
      throw customException.failedToMoveTransaction(params);
    }

    // Commit the transaction
    await session.commitTransaction();
    // End the session
    session.endSession();

    return {
      senderAccountUpdate,
      receiverAccountUpdate,
      finalTransaction,
    };
  } catch (error) {
    // Abort the transaction

    console.log(error, ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    await transactionDao.cancelTransaction(self.transactionId, session);
    await session.abortTransaction();
    // End the session
    session.endSession();

    throw error;
  } finally {
    // End the session
    session.endSession();
  }
}

module.exports = {
  fundTransfer,
};
