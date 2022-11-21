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



async function fundTransfer(session, params) {
  let self = this;
  // while (true) {
  try {
    await session.startTransaction();
    console.log(params, "m");

    const senderAccount = await customerAccountDao.findOne(
      { accountNumber: parseInt(params.senderAccountNumber) },
      {},
      { session }
    );


    console.log(senderAccount, "mmmm");
    const receiverAccount = await customerAccountDao.findOne(
      { accountNumber: parseInt(params.receiverAccountNumber) },
      {},
      { session }
    );


    console.log(receiverAccount, "mmmm");
    if (!senderAccount || senderAccount == null) {
      throw customException.senderAccountNumberNotExists();
    }
    if (!receiverAccount || receiverAccount == null) {
      throw customException.receiverAccountNumberNotExists();
    }
    if (senderAccount.balance < params.transactionAmount) {
      throw customException.notSufficientBalance();
    }



    const insetTransaction = await transactionDao.createInitialTransaction(
      params
    );


    if (!insetTransaction || insetTransaction == null) {
      throw customException.notInitiated();
    }
    self.transactionId = insetTransaction._id;



    let query1 = {};
    query1.accountNumber = parseInt(params.senderAccountNumber);
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
    query2.accountNumber = parseInt(params.receiverAccountNumber);
    query2.customerId = receiverAccount.customerId;
    const receiverAccountUpdate = await customerAccountDao
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
      senderAccount,
      receiverAccount,
      params,
      1,
      self.transactionId
    );
  
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
      transactionId: self.transactionId,
    };


  } catch (error) {
    // Abort the transaction


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
