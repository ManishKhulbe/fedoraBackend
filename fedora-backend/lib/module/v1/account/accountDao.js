"use strict";
//========================== Load Modules Start =======================

//========================== Load internal modules ====================
var mongoose = require("mongoose");
var promise = require("bluebird");

var _ = require("lodash");
//========================== Load internal modules ====================
const accountModel = require('./accountModel');


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

//========================== Export Module Start ==============================

module.exports = {
    create,
    isAccountTypeExists
};

//========================== Export Module End ===============================
