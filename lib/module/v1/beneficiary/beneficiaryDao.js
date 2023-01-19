
"use strict";
//========================== Load Modules Start =======================

//========================== Load internal modules ====================
var mongoose = require("mongoose");
var promise = require("bluebird");

var _ = require("lodash");
//========================== Load internal modules ====================
const beneficiaryModel = require('./beneficiaryModel');
const appUtils = require('../../../appUtils')

// init user dao
let BaseDao = require('../../../dao/baseDao');
const beneficiaryDao = new BaseDao(beneficiaryModel);


//========================== Load Modules End ==============================================

function create(fundDebit ,fundCredit , params ) {
    let benificiary = {}
    benificiary.accountNumber = fundCredit.accountNumber
    benificiary.accountID = fundCredit.accountId
    benificiary.senderUserID = fundDebit.customerId
    benificiary.receiverUserID = fundCredit.customerId


    let newBeneficiary = new beneficiaryModel(benificiary);
    console.log(fundDebit ,fundCredit ,"fundDebit ,fundCredit , paramsk" ) 

    return beneficiaryDao.save(newBeneficiary).then((res)=>{
        return res
    })
    .catch((err)=>{
        return false
    })
}


function getAllTransactionsAndFilter(params){
    let aggPipe = [];
 
    if(params.senderUserID ){
        params.senderUserID = appUtils.objectIdConvert(params.senderUserID)
        aggPipe.push({
            $match: {  senderUserID : params.senderUserID }
        })
    }

    if(params.receiverUserID ){
        params.receiverUserID = appUtils.objectIdConvert(params.receiverUserID)
        aggPipe.push({
            $match: {  receiverUserID : params.receiverUserID }
        })
    }

        aggPipe.push({
            $match: {
              isDeleted: 0,
            },
          });

    aggPipe.push({ "$sort": { "createdAt": -1 } });

    let count, pageNo;
    if (params.count && params.pageNo) {
        count = parseInt(params.count)
        pageNo = parseInt(params.pageNo)
        aggPipe.push({ $skip: pageNo * count });
        aggPipe.push({ $limit: count })
    }
    return beneficiaryDao.aggregate(aggPipe).then((res)=>{
      
        if(res){
            return res
        }else
        return false
    })
}



//========================== Export Module Start ==============================

module.exports = {
    create,
    getAllTransactionsAndFilter
};

//========================== Export Module End ===============================
