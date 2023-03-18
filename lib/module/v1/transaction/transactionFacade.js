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
const mongoose = require("mongoose");
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
const client = require("twilio")(accountSid, authToken);
const BaseDao = require("../../../dao/baseDao");
const transactionModel = require("./transactionModel");
const customerAccountModel = require("../customerAccount/customerAccountModel");
const customerAccountDao = new BaseDao(customerAccountModel);
const transactionDao = new BaseDao(transactionModel);
//========================== Load Modules End ==============================================

function createTransaction(
  fundDebit,
  fundCredit,
  params,
  status,
  transactionId
) {
  return transactionService
    .createTransaction(fundDebit, fundCredit, params, status, transactionId)
    .then(function (result) {
      return result;
    });
}

function createInitialTransaction(params) {
  return transactionService
    .createInitialTransaction(params)
    .then(function (result) {
      return result;
    });
}

function changeTransactionStatus(params, status) {
  return transactionService
    .changeTransactionStatus(params, status)
    .then(function (result) {
      return result;
    });
}

function cancelTransactionStatus(params) {
  return transactionService
    .cancelTransactionStatus(params)
    .then(function (result) {
      return result;
    });
}
function getTransactions(params) {
  const getAllTransactions =
    transactionService.getAllTransactionsAndFilter(params);

  return Promise.all([getAllTransactions]).then(function (result) {
    return transactionMapper.transactionListMapping(result[0], params);
  });
}

function detailsById(params) {
  return transactionService.detailsById(params).then((result) => {
    return transactionMapper.transactionDetailMapping(result, params);
  });
}

function getTransactionsFromView(params) {
  const getAllTransactions =
    transactionService.getAllViewTransactionsAndFilter(params);

  return Promise.all([getAllTransactions]).then(function (result) {
    return transactionMapper.transactionListMapping(result[0], params);
  });
}
function listByAdmin(params) {
  params.userType = appUtils.isSuperAdminAndAdminAndManagerAndViewer(
    params.userType
  );

  const getAllTransactionsByAdmin =
    transactionService.getAllTransactionsAndFilterByAdmin(params);
  const getTotalTransations = transactionService.getTotalTransactions(params);
  const getAllTransactionsByMonth =
    transactionService.getAllTransactionsByMonth(params);

  return Promise.all([
    getTotalTransations,
    getAllTransactionsByAdmin,
    getAllTransactionsByMonth,
  ]).then(function (result) {
    return transactionMapper.transactionListByAdminMapping(
      result[0],
      result[1],
      result[2],
      params
    );
  });
}

function listByAdminFromTransactionView(params) {
  params.userType = appUtils.isSuperAdminAndAdminAndManagerAndViewer(
    params.userType
  );

  const getAllTransactionsByAdmin =
    transactionService.getAllViewTransactionsAndFilterByAdmin(params);
  const getTotalTransations = transactionService.getTotalTransactions(params);
  const getAllTransactionsByMonth =
    transactionService.getAllTransactionsByMonth(params);

  return Promise.all([
    getTotalTransations,
    getAllTransactionsByAdmin,
    getAllTransactionsByMonth,
  ]).then(function (result) {
    // console.log(result[1])
    return transactionMapper.transactionListByAdminMapping(
      result[0],
      result[1],
      result[2],
      params
    );
  });
}

async function editTransaction(params) {
  params.userType = appUtils.isAdmin(params.userType);
  const session = await mongoose.connection.startSession();
  session.startTransaction();
  try {
    const transactionDetails = await transactionService.detailsById(params);

    if (transactionDetails.status != 1) {
      throw customException.transactionNotInPendingStatus();
    }

    //edit transaction status
    let editTransaction = await transactionDao
      .findOneAndUpdate(
        { _id: appUtils.objectIdConvert(params.transactionId) },
        { $set: { status: +params.status } },
        { new: true, session: session }
      )
      .then(function (result) {
        if (result) {
          return result;
        } else {
          return false;
        }
      });

    if (!editTransaction) {
      throw customException.unableToUpdateStatus();
    }

    if (params.status == 3) {
      //update sender account balance
      let query1 = {};
      query1.accountNumber = editTransaction.accountNumberFrom;
      query1.customerId = editTransaction.senderUserId;

      const senderAccountUpdate = await customerAccountDao
        .findOneAndUpdate(
          query1,
          { $inc: { balance: parseFloat(editTransaction.transactionAmount) } },
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
        throw customException.failedToCredit(params);
      }
      
     
      let insertTxn= {}
      if(editTransaction){
        insertTxn.accountNumberFrom= process.env.ADMIN_ACCOUNT_NUMBER ,
        insertTxn.accountNumberTo= editTransaction.accountNumberFrom,
        insertTxn.IFSCcode= editTransaction.IFSCcode ,
        insertTxn.bankName= editTransaction.bankName,
        insertTxn.senderUserId= params.userID ,
        insertTxn.receiverUserId= editTransaction.senderUserId,
        insertTxn.receiverAccountTypeId= senderAccountUpdate._id,
        insertTxn.couponWalletAmount= editTransaction.couponWalletAmount,
        insertTxn.receiverAccountBalance= senderAccountUpdate.balance,
        insertTxn.transactionAmount= editTransaction.transactionAmount,
        insertTxn.transactionType= 1,
        insertTxn.status= 2,
        insertTxn.remark= ` Amount ${editTransaction.transactionAmount} refunded in respect to transaction id ${editTransaction._id} by admin
        `,
        insertTxn.paymentType= editTransaction.paymentType
      }
      console.log(insertTxn ,"editTransaction")
      const insertNewRefundTransaction = await transactionDao.save(
        insertTxn
      );

      if (!insertNewRefundTransaction) {
        throw customException.failedToMoveTransaction(params);
      }

    }

    await session.commitTransaction();
    // End the session
    session.endSession();

    return transactionMapper.editOtherBankTransactionMapping(editTransaction);
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
    // End the session
    session.endSession();
    throw error;
  } finally {
    session.endSession();
  }
}

function getStatement(params) {
  // const getStatement = transactionService.getStatement(params)

  return transactionService.getStatement(params).then((result) => {
    return transactionMapper.statementMapping(result, params);
  });
}
//========================== Export Module Start ==============================

module.exports = {
  createTransaction,
  getTransactions,
  createInitialTransaction,
  changeTransactionStatus,
  cancelTransactionStatus,
  listByAdmin,
  listByAdminFromTransactionView,
  getTransactionsFromView,
  detailsById,
  editTransaction,
  getStatement,
};

//========================== Export Module End ================================
