
"use strict";
//========================== Load Modules Start =======================

//========================== Load internal modules ====================
var mongoose = require("mongoose");
var promise = require("bluebird");

var _ = require("lodash");
//========================== Load internal modules ====================
const transactionModel = require('./transactionModel');

// var apputils = require("../../../appUtils");
// init user dao
let BaseDao = require('../../../dao/baseDao');
const transactionDao = new BaseDao(transactionModel);


//========================== Load Modules End ==============================================

function createTransaction(fundDebit ,fundCredit , params , status) {
    // let transactions = new transactionModel(params);
    // console.log(fundDebit ,fundCredit , params,"fundDebit ,fundCredit , params" ) 
let transaction ={}
transaction.accountNumberFrom = fundDebit.accountNumber
transaction.accountNumberTo=fundCredit.accountNumber
transaction.senderAccountBalance= fundDebit.balance
transaction.transactionAmount=parseInt(params.transactionAmount)
transaction.transactionType=parseInt(params.transactionType)
transaction.remark=params.remark
transaction.status=status
transaction.senderAccountTypeId=fundDebit.accountId
transaction.receiverAccountTypeId=fundCredit.accountId
// console.log(transaction,">>>>>>>>>>>>>>>>>>>>>>>>>>>>")
    return transactionDao.save(transaction).then((res)=>{
        return res
    })
    .catch((err)=>{
        return false
    })
}




//========================== Export Module Start ==============================

module.exports = {
    createTransaction
};

//========================== Export Module End ===============================
