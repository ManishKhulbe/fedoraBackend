"use strict";
//========================== Load Modules Start =======================

//========================== Load internal modules ====================
var mongoose = require("mongoose");
var promise = require("bluebird");

var _ = require("lodash");
//========================== Load internal modules ====================
const accountModel = require('./accountModel');

var apputils = require("../../../appUtils");
// init user dao
let BaseDao = require('../../../dao/baseDao');
const accountDao = new BaseDao(accountModel);


//========================== Load Modules End ==============================================

function create(params) {
    let account = new accountModel(params);
    return accountDao.save(account);
}

function isAccountTypeExists(params){
    console.log(params,">>>>>>>>>>>")
    return accountDao.findOne({ accountType :params.accountType})
}

function getInterestByType(params){
  // console.log(params,">>>>>>>>>>>f")
    return accountDao.findOne({accountType : parseInt(params.accountType)}).then(function (result) {
        if (result) {
            return result;
        } else {
            return false;
        }
    })
}
function accountList(params){
    let aggPipe = [];
    let query = {};
    if (params.accountType) {
        query.accountType = parseInt(params.accountType)
    }
    query.isDeleted = 0;
    aggPipe.push({
        "$match": query
    });
    return accountDao.aggregate(aggPipe)
}

function editAccount(params){
console.log(params,">>>>>>>>>>>")

  var update = {};
let query = {};
   query._id = params.accountId;

  if(params.accountInterestRate){
    update["accountInterestRate"] = params.accountInterestRate;
  }
  update["accountLastAccessTime"] = new Date();

  let options = {};
  options.new = true;
  return accountDao
    .findOneAndUpdate(query, { $set: update }, options)
    .then(function (result) {
      if (result) {
        return result;
      } else {
        return false;
      }
    });
}

function softDeleteAccount(params){
    console.log(params)
    let update = {}
    let query = {}
    query._id = apputils.objectIdConvert(params.accountId) ;
    if(params.isDeleted){
        update["isDeleted"] = parseInt(params.isDeleted) ;
    }

    let options = {};
    options.new = true;

    return accountDao
    .findOneAndUpdate(query, { $set: update }, options)
    .then(function (result) {
      if (result) {
        return result;
      } else {
        return false;
      }
    });
}

function deleteAccount(params){
    console.log(params ,"..")
    let query = {}
    query._id = apputils.objectIdConvert(params.accountId) ;
    return accountDao
    .remove(query)
    .then(function (result) {
        console.log(result ,".s.")
        if (result) {
            return result;
        } else {

            return false;
        }
    });
}

function getAccountId(params){
    let query = {}
    query.accountType = parseInt(params.accountType) ;
    return accountDao
    .findOne(query)
    .then(function (result) {
        console.log(result ,".s.")
        if (result) {
            return result;
        } else {

            return false;
        }
    });
}

function isAccountIdExists(params){
  console.log(params,">>>>>>>>>>>f")
    let query = {}
    query._id = apputils.objectIdConvert(params.accountId) ;
    return accountDao
    .findOne(query)
    .then(function (result) {
        if (result) {
            return result;
        } else {

            return false;
        }
    });
}
function totalNoOfAccounts(params) {
  return accountDao.count()
  .then(function (result) {
      if (result) {
          return result;
      } else {
          return false;
      }
  })
}

//========================== Export Module Start ==============================

module.exports = {
    create,
    isAccountTypeExists,
    accountList,
    editAccount,
    softDeleteAccount,
    deleteAccount,
    getAccountId,
    isAccountIdExists,
    totalNoOfAccounts,
    getInterestByType
    
};

//========================== Export Module End ===============================
