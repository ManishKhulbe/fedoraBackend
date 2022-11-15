
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
transaction.status=2
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

function createInitialTransaction(params){
    console.log(params)
    let transaction ={}
transaction.accountNumberFrom = params.senderAccountNumber
transaction.accountNumberTo=params.receiverAccountNumber
transaction.transactionAmount=parseInt(params.transactionAmount)
if(params.transactionType){
    transaction.transactionType=parseInt(params.transactionType)
}
if(params.remark){
    transaction.remark=params.remark
}
transaction.status=0

// console.log(transaction,">>>>>>>>>>>>>>>>>>>>>>>>>>>>")
    return transactionDao.save(transaction).then((res)=>{
        return res
    })
    .catch((err)=>{
        return false
    })

}

function changeTransactionStatus(params , status ){
// console.log(params ,"MM" )
var result = transactionDao.updateOne(
    { _id: params._id}, 
    { $set: { state: status } }
  );
  return result 
}

function cancelTransactionStatus(params){
   
    var result = transactionDao.updateOne(
        { _id: params},
        { $set: { state: 3 } }
        );
        return result
    }

function getAllTransactionsAndFilter(params){
    console.log(params ,">>>>>>>><<<<<<<<<<<<")
    let aggPipe = [];
   
    //match by accountNumberFrom and accountNumberTo
    if(params.accountNumber ){
        aggPipe.push({
            $match: { $or: [ { accountNumberFrom: parseInt(params.accountNumber) }, { accountNumberTo:parseInt(params.accountNumber)  } ] }
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
    return transactionDao.aggregate(aggPipe).then((res)=>{
        
        if(res){
            return res
        }else
        return false
    })
}


function foodOrderListWithFilter(params){
    // console.log('params:: ',params)
    let query = {}
    let aggPipe = [];
    let sort = {};
    if (params.employeeId || params.status || params.vendorId ){
        query['$and'] = []
    }
    var date = new Date();
    var year = parseInt(params.searchYear)?parseInt(params.searchYear):date.getFullYear();

    if (params.searchYear) {
        aggPipe.push({
            $addFields: { "year": { $year: "$created" }  }
        },
            {
                $match: { "year": { $eq: parseInt(year) } }
            })
    }
   
    if (params.searchMonth) {
        aggPipe.push({
            $addFields: { "month": { $month: "$created" }  }
        },
            {
                $match: { "month": { $eq: parseInt(params.searchMonth) } }
            })
    }
    if (params.startDate && params.endDate) {
        let endDate = new Date(params.endDate)
        endDate = endDate.setHours(23,59,0)
        query['$and'] = [
            { created: { $gte: new Date(params.startDate) } },
            { created: { $lte: new Date(endDate) } },
        ];
    }
    if (params.employeeId) {
        query['$and'].push({
            employeeId: appUtils.objectIdConvert(params.employeeId),
        });

    }

    if (params.vendorId ){
        query['$and'].push({
            vendorId: appUtils.objectIdConvert(params.vendorId),
        });
    }

    if (params.status) {
        query['$and'].push({
            status: parseInt(params.status),
        });
    }
      if(params.vendorId){
     aggPipe.push({
        $match: 
            {vendorId:  appUtils.objectIdConvert(params.vendorId)}});
    }

    let sortType = -1;
    let sortField = 'created';
    if (params.sortType == 1) {
        sortType = 1;
    }

    if (params.sortField) {
        sortField = params.sortField;
    }
    sort[sortField] = sortType;
    aggPipe.push({ "$sort": sort });
    if (query){
        aggPipe.push({ "$match": query });
    }

    aggPipe.push(
        {
            $lookup: {
                from: "employees",
                localField: "employeeId",
                foreignField: "_id",
                as: "employeeId"
            }
        }
    )

    aggPipe.push({
        $lookup: {
            from: "employees",
            localField: "vendorId",
            foreignField: "_id",
            as: "vendorId"
        }
    })

    aggPipe.push({
        $lookup: {
            from: "fooditems",
            localField: "foods.foodId",
            foreignField: "_id",
            as: "foodDetails"
        }
    },)

    aggPipe.push({
        "$unwind": {
            path: "$employeeId",
            "preserveNullAndEmptyArrays": true
        }
    })

    aggPipe.push({
        "$unwind": {
            path: "$vendorId",
            "preserveNullAndEmptyArrays": true
        }
    })


   if (params.search) {
    aggPipe.push({
      $match: {
        $or: [
                  {"employeeId.firstName": {$regex: ".*" + params.search + ".*", $options: "i"}},
                  {"employeeId.lastName": {$regex: ".*" + params.search + ".*", $options: "i"}},
                  {"vendorId.firstName": {$regex: ".*" + params.search + ".*", $options: "i"}},
                  {"foodDetails.name": {$regex: ".*" + params.search + ".*", $options: "i"}},
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
    return FoodOrder.aggregate(aggPipe)
}


function cancel(id) {
    transactions.updateOne(
      { _id: id }, 
      { $set: { state: "canceled" } }
    );
  }
  
  



//========================== Export Module Start ==============================

module.exports = {
    createTransaction,
    getAllTransactionsAndFilter,
    changeTransactionStatus,
    createInitialTransaction,
    cancelTransactionStatus
};

//========================== Export Module End ===============================
