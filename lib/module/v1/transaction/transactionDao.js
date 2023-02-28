"use strict";
//========================== Load Modules Start =======================

//========================== Load internal modules ====================
var mongoose = require("mongoose");
var promise = require("bluebird");

var _ = require("lodash");
//========================== Load internal modules ====================
const transactionModel = require("./transactionModel");

// var apputils = require("../../../appUtils");
// init user dao
let BaseDao = require("../../../dao/baseDao");
const transactionDao = new BaseDao(transactionModel);
const appUtils = require("../../../appUtils");
const { result } = require("lodash");
const db = mongoose.connection;
const transactionView = db.collection("transactionView");

//========================== Load Modules End ==============================================

function createTransaction(
  fundDebit,
  fundCredit,
  params,
  status,
  transactionId
) {
  console.log(
    fundDebit,
    fundCredit,
    params,
    "fundDebit ,fundCredit , params",
    transactionId
  );
  let transaction = {};
  transaction.accountNumberFrom = fundDebit.accountNumber;
  transaction.accountNumberTo = fundCredit.accountNumber;
  transaction.senderAccountBalance = fundDebit.balance;
  transaction.receiverAccountBalance = fundCredit.balance;
  transaction.transactionAmount = parseInt(params.transactionAmount);
  transaction.remark = params.remark;
  transaction.status = 2;
  transaction.senderUserId = fundDebit.customerId;
  transaction.receiverUserId = fundCredit.customerId;
  transaction.senderAccountTypeId = parseInt(fundDebit.accountType);
  transaction.receiverAccountTypeId = parseInt(fundCredit.accountType);
  console.log(transaction);
  // // console.log(transaction,">>>>>>>>>>>>>>>>>>>>>>>>>>>>")
  return transactionDao
    .findOneAndUpdate(
      { _id: transactionId },
      { $set: transaction },
      { new: true }
    )
    .then((res) => {
      console.log(res, "MMMMMMMMMM"); // return res
      return res;
    })
    .catch((err) => {
      return false;
    });
}

function createInitialTransaction(params) {
  console.log(params);
  let transaction = {};
  transaction.accountNumberFrom = params.senderAccountNumber;
  transaction.accountNumberTo = params.receiverAccountNumber;
  transaction.transactionAmount = parseInt(params.transactionAmount);
  if (params.remark) {
    transaction.remark = params.remark;
  }
  transaction.status = 0;

  return transactionDao
    .save(transaction)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return false;
    });
}

function initiateTransaction(senderAccount, receiverAccount, params, status) {
  let newTransaction = {};
  newTransaction.accountNumberFrom = senderAccount.accountNumber;
  newTransaction.accountNumberTo = receiverAccount.accountNumber;
  newTransaction.IFSCcode = receiverAccount.IFSCcode;
  newTransaction.bankName = receiverAccount.bankName;
  newTransaction.senderUserId = senderAccount.customerId;
  newTransaction.receiverUserId = senderAccount.customerId;
  newTransaction.senderAccountTypeId = senderAccount.accountType;
  newTransaction.transactionAmount = +params.transactionAmount;
  newTransaction.senderAccountBalance = senderAccount.balance;
  newTransaction.status = status;
  newTransaction.remark = params.remark;
  newTransaction.paymentType = 2;
  newTransaction.transactionType = 2;
  // console.log(newTransaction)

  return transactionDao
    .save(newTransaction)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return false;
    });
}

function initiateTransactionByAdmin(params, result) {
  console.log(
    "🚀 ~ file: transactionDao.js:100 ~ initiateTransactionByAdmin ~ params ,result",
    params,
    result
  );
  let newTransaction = {};
  newTransaction.accountNumberFrom = process.env.ADMIN_ACCOUNT_NUMBER;
  newTransaction.accountNumberTo = result.accountNumber;
  newTransaction.senderUserId = params.userId;
  newTransaction.receiverUserId = result.customerId;
  newTransaction.senderAccountTypeId = 1;
  newTransaction.receiverAccountTypeId = result.accountType;
  newTransaction.transactionAmount = +params.amount;
  newTransaction.receiverAccountBalance = result.balance;
  newTransaction.senderAccountBalance = result.balance;
  newTransaction.status = 2;
  newTransaction.remark = params.remark;
  newTransaction.transactionType = +params.transactionType;

  return transactionDao
    .save(newTransaction)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return false;
    });
}
function changeTransactionStatus(params, status) {
  // console.log(params ,"MM" )
  var result = transactionDao.updateOne(
    { _id: params._id },
    { $set: { state: status } }
  );
  return result;
}

async function cancelTransactionStatus(params) {
  var result = await transactionDao.updateOne(
    { _id: params },
    { $set: { status: 3 } },
    { new: true }
  );

  return result;
}

async function cancelTransaction(params) {
  var result = await transactionDao.findOneAndUpdate(
    { _id: params },
    { $set: { status: 3 } },
    { new: true }
  );

  return result;
}

function getAllTransactionsAndFilter(params) {
  console.log(params, ">>>>>>>><<<<<<<<<<<<");
  let aggPipe = [];

  //match by accountNumberFrom and accountNumberTo
  if (params.accountNumber) {
    aggPipe.push({
      $match: {
        $or: [
          { accountNumberFrom: parseInt(params.accountNumber) },
          { accountNumberTo: parseInt(params.accountNumber) },
        ],
      },
    });
  }
  aggPipe.push({
    $match: {
      isDeleted: 0,
    },
  });

  aggPipe.push({ $sort: { createdAt: -1 } });

  let count, pageNo;
  if (params.count && params.pageNo) {
    count = parseInt(params.count);
    pageNo = parseInt(params.pageNo);
    aggPipe.push({ $skip: pageNo * count });
    aggPipe.push({ $limit: count });
  }
  return transactionDao.aggregate(aggPipe).then((res) => {
    if (res) {
      return res;
    } else return false;
  });
}

function getStatement(params) {
  console.log(
    "🚀 ~ file: transactionDao.js:186 ~ getStatement ~ params:",
    params
  );
  let aggPipe = [];

  aggPipe.push({
    $match: {
      $and: [
        {
          $or: [
            { receiverUserId: appUtils.objectIdConvert(params.customerId) },
            { senderUserId: appUtils.objectIdConvert(params.customerId) },
          ],
        },
        {
          $or: [
            { accountNumberFrom: params.accountNumber },
            { accountNumberTo: params.accountNumber },
          ],
        },
      ],
    },
  });

  if(params.startDate && params.endDate){
    aggPipe.push({
      $match: {
        createdAt: {
          $gte: new Date(params.startDate),
          $lte: new Date(params.endDate),
        },
      },
    });
  }

  let sortType = 1;
  if(params.sortType == 1){
    sortType = 1;
  }else{
    sortType = -1;
}

  if(params.sortField){
    aggPipe.push({
      $sort:{
          [params.sortField]: sortType
      }
    })
  }
  else{
    aggPipe.push({
      $sort:{
          createdAt: sortType
      }
    })
}

let count, pageNo;
if (params.count && params.pageNo) {
  count = parseInt(params.count);
  pageNo = parseInt(params.pageNo);
  aggPipe.push({ $skip: pageNo * count });
  aggPipe.push({ $limit: count });
}

  return transactionView
    .aggregate(aggPipe)
    .toArray()
    .then((res) => {
      if (res) {
        return res;
      } else return false;
    });
}

function getAllViewTransactionsAndFilter(params) {
  console.log(params, ">>>>>>>><<<<<<<<<<<<");
  let aggPipe = [];

  //match by accountNumberFrom and accountNumberTo
  if (params.accountNumber) {
    aggPipe.push({
      $match: {
        $or: [
          { accountNumberFrom: params.accountNumber },
          { accountNumberTo: params.accountNumber },
        ],
      },
    });
  }
  // aggPipe.push({
  //     $match: {
  //       isDeleted: 0,
  //     },
  //   });

  aggPipe.push({ $sort: { updatedAt : -1 } });

  let count, pageNo;
  if (params.count && params.pageNo) {
    count = parseInt(params.count);
    pageNo = parseInt(params.pageNo);
    aggPipe.push({ $skip: pageNo * count });
    aggPipe.push({ $limit: count });
  }
  return transactionView
    .aggregate(aggPipe)
    .toArray()
    .then((res) => {
      if (res) {
        return res;
      } else return false;
    });
}

async function getAllTransactionsAndFilterByAdmin(params) {
  console.log(params, "Mparamsss");
  let query = {};
  let aggPipe = [];
  let sort = {};

  var startDate = new Date(params.startDate);
  var endDate = new Date(params.endDate).setHours(23, 59, 0);
  //timestamp to date
  var date1 = new Date(endDate);
  console.log(
    startDate,
    endDate,
    "Mparamsss",
    date1.getHours(),
    date1.getMinutes()
  );
  // var year = parseInt(params.searchYear)?parseInt(params.searchYear):date.getFullYear();
  aggPipe.push({
    $match: {
      isDeleted: 0,
    },
  });
  aggPipe.push({
    $addFields: { year: { $year: "$createdAt" } },
  });
  aggPipe.push({
    $addFields: { month: { $month: "$createdAt" } },
  });
  aggPipe.push({
    $addFields: { day: { $dayOfMonth: "$createdAt" } },
  });
  if (params.searchYear) {
    aggPipe.push({
      $match: { year: { $eq: parseInt(params.searchYear) } },
    });
  }

  if (params.searchMonth) {
    aggPipe.push({
      $match: { month: { $eq: parseInt(params.searchMonth) } },
    });
  }
  if (params.searchDay) {
    aggPipe.push({
      $match: { day: { $eq: parseInt(params.searchDay) } },
    });
  }

  if (params.startDate && params.endDate) {
    aggPipe.push({
      $match: {
        $and: [
          { createdAt: { $gte: startDate } },
          { createdAt: { $lte: date1 } },
        ],
      },
    });
  }

  if (params.status) {
    aggPipe.push({
      $match: { status: parseInt(params.status) },
    });
  }

  aggPipe.push({
    $lookup: {
      from: "users",
      localField: "senderUserId",
      foreignField: "_id",
      as: "senderDetails",
    },
  });

  aggPipe.push({
    $unwind: {
      path: "$senderDetails",
      preserveNullAndEmptyArrays: true,
    },
  });

  aggPipe.push({
    $lookup: {
      from: "users",
      localField: "receiverUserId",
      foreignField: "_id",
      as: "receiverDetails",
    },
  });

  aggPipe.push({
    $unwind: {
      path: "$receiverDetails",
      preserveNullAndEmptyArrays: true,
    },
  });

  aggPipe.push({
    $lookup: {
      from: "accounts",
      localField: "receiverAccountTypeId",
      foreignField: "_id",
      as: "receiverAccountDetails",
    },
  });

  aggPipe.push({
    $unwind: {
      path: "$receiverAccountDetails",
      preserveNullAndEmptyArrays: true,
    },
  });

  aggPipe.push({
    $lookup: {
      from: "accounts",
      localField: "senderAccountTypeId",
      foreignField: "_id",
      as: "senderAccountDetails",
    },
  });

  aggPipe.push({
    $unwind: {
      path: "$senderAccountDetails",
      preserveNullAndEmptyArrays: true,
    },
  });

  aggPipe.push({
    $project: {
      _id: 1,
      accountNumberFrom: 1,
      accountNumberTo: 1,
      senderUserId: 1,
      receiverUserId: 1,
      transactionAmount: 1,
      remark: 1,
      createdAt: 1,
      status: 1,
      year: 1,
      month: 1,
      day: 1,
      senderAccountType: "$senderAccountDetails.accountType",
      receiverAccountType: "$receiverAccountDetails.accountType",
      senderName: "$senderDetails.name",
      receiverName: "$receiverDetails.name",
      senderMobileNo: "$senderDetails.mobileNo",
      receiverMobileNo: "$receiverDetails.mobileNo",
    },
  });

  let sortType = -1;
  let sortField = "created";
  if (params.sortType == 1) {
    sortType = 1;
  }

  if (params.sortField) {
    sortField = params.sortField;
  }
  sort[sortField] = sortType;
  aggPipe.push({ $sort: sort });

  if (params.senderAccountType) {
    aggPipe.push({
      $match: {
        senderAccountType: parseInt(params.senderAccountType),
      },
    });
  }

  if (params.receiverAccountType) {
    aggPipe.push({
      $match: {
        receiverAccountType: parseInt(params.receiverAccountType),
      },
    });
  }

  if (params.search && !appUtils.isNumber(params.search)) {
    console.log("str");
    aggPipe.push({
      $match: {
        $or: [
          {
            senderName: { $regex: ".*" + params.search + ".*", $options: "i" },
          },
          {
            receiverName: {
              $regex: ".*" + params.search + ".*",
              $options: "i",
            },
          },
        ],
      },
    });
  }

  if (params.search && !appUtils.isString(params.search)) {
    console.log("numm");
    aggPipe.push({
      $match: {
        $or: [
          {
            senderMobileNo: {
              $regex: ".*" + params.search + ".*",
              $options: "i",
            },
          },
          { accountNumberTo: parseInt(params.search) },
          { accountNumberFrom: parseInt(params.search) },
          {
            receiverMobileNo: {
              $regex: ".*" + params.search + ".*",
              $options: "i",
            },
          },
        ],
      },
    });
  }

  let count, pageNo;
  if (params.pageNo && params.count) {
    pageNo = parseInt(params.pageNo);
    count = parseInt(params.count);
    aggPipe.push({ $skip: pageNo * count });
    aggPipe.push({ $limit: count });
  }

  return transactionDao.aggregate(aggPipe).then((res) => {
    // console.log(res)
    if (res) {
      return res;
    } else return false;
  });
}

function getAllViewTransactionsAndFilterByAdmin(params) {
  console.log(params, "bb");

  let aggPipe = [];
  let sort = {};

  var startDate = new Date(params.startDate);
  var endDate = new Date(params.endDate).setHours(23, 59, 0);
  //timestamp to date
  var date1 = new Date(endDate);
  console.log(
    startDate,
    endDate,
    "Mparamsss",
    date1.getHours(),
    date1.getMinutes()
  );

  if (params.searchYear) {
    aggPipe.push({
      $match: { year: { $eq: parseInt(params.searchYear) } },
    });
  }

  if (params.searchMonth) {
    aggPipe.push({
      $match: { month: { $eq: parseInt(params.searchMonth) } },
    });
  }
  if (params.searchDay) {
    aggPipe.push({
      $match: { day: { $eq: parseInt(params.searchDay) } },
    });
  }

  if (params.startDate && params.endDate) {
    aggPipe.push({
      $match: {
        $and: [
          { createdAt: { $gte: startDate } },
          { createdAt: { $lte: date1 } },
        ],
      },
    });
  }

  if (params.status) {
    aggPipe.push({
      $match: { status: parseInt(params.status) },
    });
  }

  if (params.accountType) {
    aggPipe.push({
      $match: {
        $or: [
          { senderAccountType: parseInt(params.accountType) },
          { receiverAccountType: parseInt(params.accountType) },
        ],
      },
    });
  }

  if (params.senderAccountType) {
    aggPipe.push({
      $match: {
        senderAccountType: parseInt(params.senderAccountType),
      },
    });
  }

  if (params.receiverAccountType) {
    aggPipe.push({
      $match: {
        receiverAccountType: parseInt(params.receiverAccountType),
      },
    });
  }

  if (params.search && !appUtils.isNumber(params.search)) {
    console.log("str");
    aggPipe.push({
      $match: {
        $or: [
          {
            senderName: { $regex: ".*" + params.search + ".*", $options: "i" },
          },
          {
            receiverName: {
              $regex: ".*" + params.search + ".*",
              $options: "i",
            },
          },
        ],
      },
    });
  }

  if (params.search && !appUtils.isString(params.search)) {
    console.log("numm");
    aggPipe.push({
      $match: {
        $or: [
          {
            senderMobileNo: {
              $regex: ".*" + params.search + ".*",
              $options: "i",
            },
          },
          { accountNumberTo: parseInt(params.search) },
          { accountNumberFrom: parseInt(params.search) },
          {
            receiverMobileNo: {
              $regex: ".*" + params.search + ".*",
              $options: "i",
            },
          },
        ],
      },
    });
  }

  let sortType = -1;
  let sortField = "created";
  if (params.sortType == 1) {
    sortType = 1;
  }

  if (params.sortField) {
    sortField = params.sortField;
  }
  sort[sortField] = sortType;
  aggPipe.push({ $sort: sort });

  let pageNo, count;
  let nestedPipe = [];
  if (params.pageNo && params.count) {
    count = parseInt(params.count);
    pageNo = parseInt(params.pageNo);
    nestedPipe.push({ $skip: pageNo * count });
    nestedPipe.push({ $limit: count });
  }

  aggPipe.push({
    $facet: {
      totalCount: [{ $count: "dataCount" }],
      pipelineResults: nestedPipe,
    },
  });

  aggPipe.push({
    $unwind: "$totalCount",
  });

  return transactionView
    .aggregate(aggPipe)
    .toArray()
    .then((res) => {
      console.log(res, "vvvvvvvvvvvv");
      if (res) {
        return res;
      } else return false;
    });
}
function getTotalTransactions(params) {
  console.log(params);
  return transactionDao.count({ isDeleted: 0 }).then((res) => {
    if (res) {
      return res;
    } else {
      return false;
    }
  });
}

function getAllTransactionsByMonth(params) {
  console.log(params);
  let aggPipe = [];
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;

  aggPipe.push({
    $match: {
      isDeleted: 0,
    },
  });
  if (params.searchYear) {
    aggPipe.push(
      {
        $addFields: { year: { $year: "$createdAt" } },
      },
      { $match: { year: { $eq: parseInt(params.searchYear) } } }
    );
  } else {
    aggPipe.push(
      {
        $addFields: { year: { $year: "$createdAt" } },
      },
      { $match: { year: { $eq: year } } }
    );
  }

  if (params.searchMonth) {
    aggPipe.push(
      {
        $addFields: { month: { $month: "$created" } },
      },
      {
        $match: { month: { $eq: parseInt(params.searchMonth) } },
      }
    );
  } else {
    aggPipe.push(
      {
        $addFields: { month: { $month: "$created" } },
      },
      {
        $match: { month: { $eq: month } },
      }
    );
  }

  aggPipe.push({
    $count: "totalTransactionsPerMonth",
  });

  return transactionDao.aggregate(aggPipe).then((res) => {
    if (res.length != 0) {
      return res;
    } else return false;
  });
}

function detailsById(params) {
  return transactionView
    .find({ _id: appUtils.objectIdConvert(params.transactionId) })
    .toArray()
    .then((result) => {
      if (result.length != 0) {
        return result[0];
      } else {
        return false;
      }
    });
}

function editTransaction(params, session) {
  return transactionDao
    .findOneAndUpdate(
      { _id: appUtils.objectIdConvert(params.transactionId) },
      { $set: { status: +params.status } },
      { new: true, session: session }
    )
    .then((result) => {
      if (result) {
        return result;
      } else {
        return false;
      }
    });
}

//========================== Export Module Start ==============================

module.exports = {
  createTransaction,
  getAllTransactionsAndFilter,
  changeTransactionStatus,
  createInitialTransaction,
  cancelTransactionStatus,
  getAllTransactionsAndFilterByAdmin,
  getTotalTransactions,
  getAllTransactionsByMonth,
  cancelTransaction,
  getAllViewTransactionsAndFilterByAdmin,
  getAllViewTransactionsAndFilter,
  detailsById,
  initiateTransaction,
  editTransaction,
  initiateTransactionByAdmin,
  getStatement,
};

//========================== Export Module End ===============================
