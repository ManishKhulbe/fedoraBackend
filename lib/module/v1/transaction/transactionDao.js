
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
const appUtils = require("../../../appUtils");
const db = mongoose.connection
const transactionView = db.collection('transactionView')

// console.log(mongoose.Collection() ,"bh")
//========================== Load Modules End ==============================================

function createTransaction(fundDebit ,fundCredit , params , status , transactionId) {
    // let transactions = new transactionModel(params);
    console.log(fundDebit ,fundCredit , params,"fundDebit ,fundCredit , params",transactionId ) 
let transaction ={}
transaction.accountNumberFrom = fundDebit.accountNumber
transaction.accountNumberTo=fundCredit.accountNumber
transaction.senderAccountBalance= fundDebit.balance
transaction.receiverAccountBalance = fundCredit.balance
transaction.transactionAmount=parseInt(params.transactionAmount)
transaction.remark=params.remark
transaction.status= 2
transaction.senderUserId=fundDebit.customerId
transaction.receiverUserId=fundCredit.customerId
transaction.senderAccountTypeId=fundDebit.accountId
transaction.receiverAccountTypeId=fundCredit.accountId
console.log(transaction)
// // console.log(transaction,">>>>>>>>>>>>>>>>>>>>>>>>>>>>")
    return  transactionDao.findOneAndUpdate({_id : transactionId} ,{$set : transaction} ,{new : true}).then((res)=>{
        
        console.log(res ,"MMMMMMMMMM")// return res
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

async function cancelTransactionStatus(params){
   
    var result = await transactionDao.updateOne(
        { _id: params},
        { $set: { status: 3 }},{new : true} 
        );
      
        return result
    }

    async function cancelTransaction(params){
   
        var result = await transactionDao.findOneAndUpdate(
            { _id: params},
            { $set: { status: 3 }},{new : true} 
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



function getAllViewTransactionsAndFilter(params){
    console.log(params ,">>>>>>>><<<<<<<<<<<<")
    let aggPipe = [];
   
    //match by accountNumberFrom and accountNumberTo
    if(params.accountNumber ){
        aggPipe.push({
            $match: { $or: [ { accountNumberFrom: parseInt(params.accountNumber) }, { accountNumberTo:parseInt(params.accountNumber)  } ] }
        })

    }
        // aggPipe.push({
        //     $match: {
        //       isDeleted: 0,
        //     },
        //   });

    aggPipe.push({ "$sort": { "createdAt": -1 } });

    let count, pageNo;
    if (params.count && params.pageNo) {
        count = parseInt(params.count)
        pageNo = parseInt(params.pageNo)
        aggPipe.push({ $skip: pageNo * count });
        aggPipe.push({ $limit: count })
    }
    return transactionView.aggregate(aggPipe).toArray().then((res)=>{
        // console.log(res)
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
async function getAllTransactionsAndFilterByAdmin(params){
    console.log(params ,"Mparamsss")
    let query = {}
    let aggPipe = [];
    let sort = {};
   
    var startDate = new Date(params.startDate);
    var endDate = new Date(params.endDate).setHours(23,59,0)
    //timestamp to date
    var date1 = new Date(endDate);
    console.log(startDate,endDate ,"Mparamsss",date1.getHours() , date1.getMinutes())
    // var year = parseInt(params.searchYear)?parseInt(params.searchYear):date.getFullYear();
    aggPipe.push({
        $match :{
            isDeleted : 0
        }
    })
    aggPipe.push({
        $addFields: { "year": { $year: "$createdAt" }  }
    })
    aggPipe.push({
        $addFields: { "month": { $month: "$createdAt" }  }
    })
    aggPipe.push({
        $addFields: { "day": { $dayOfMonth: "$createdAt" }  }
    })
    if (params.searchYear) {
        aggPipe.push({
                $match: { "year": { $eq: parseInt(params.searchYear) } }
            })
    }
   
    if (params.searchMonth) {
        aggPipe.push({
                $match: { "month": { $eq: parseInt(params.searchMonth) } }
            })
    }
    if (params.searchDay) {
        aggPipe.push({
                $match: { "day": { $eq: parseInt(params.searchDay) } }
            })
    }
   
    if (params.startDate && params.endDate) {
        aggPipe.push({
                    $match: { 
                        $and :[
                           { createdAt: { $gte: startDate }} ,
                            {createdAt: { $lte: date1 } }
                        ]
                    }
                        }) 
    }


    if(params.status){
        aggPipe.push({
            $match: { status: parseInt(params.status)  }
        })
    }

    aggPipe.push({
        $lookup: {
            from: "users",
            localField: "senderUserId",
            foreignField: "_id",
            as: "senderDetails"
        }
    })

    aggPipe.push({
        "$unwind": {
            path: "$senderDetails",
            "preserveNullAndEmptyArrays": true
        }
    })

    aggPipe.push({
        $lookup: {
            from: "users",
            localField: "receiverUserId",
            foreignField: "_id",
            as: "receiverDetails"
        }
    })

    aggPipe.push({
        "$unwind": {
            path: "$receiverDetails",
            "preserveNullAndEmptyArrays": true
        }
    })

    aggPipe.push({
        $lookup: {
            from: "accounts",
            localField: "receiverAccountTypeId",
            foreignField: "_id",
            as: "receiverAccountDetails"
        }
    })

    aggPipe.push({
        "$unwind": {
            path: "$receiverAccountDetails",
            "preserveNullAndEmptyArrays": true
        }
    })

    aggPipe.push({
        $lookup: {
            from: "accounts",
            localField: "senderAccountTypeId",
            foreignField: "_id",
            as: "senderAccountDetails"
        }
    })

    aggPipe.push({
        "$unwind": {
            path: "$senderAccountDetails",
            "preserveNullAndEmptyArrays": true
        }
    })


    aggPipe.push({
        $project :{
            _id : 1,
            accountNumberFrom :1,
            accountNumberTo :1,
            senderUserId:1,
            receiverUserId:1,
            transactionAmount : 1,
            remark :1,
            createdAt : 1,
            status : 1,
            year: 1,
            month: 1,
            day: 1,
            senderAccountType:"$senderAccountDetails.accountType",
            receiverAccountType:'$receiverAccountDetails.accountType',
            senderName : '$senderDetails.name',
            receiverName : '$receiverDetails.name',
            senderMobileNo : '$senderDetails.mobileNo',
            receiverMobileNo : '$receiverDetails.mobileNo'
        }
    })
  

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
 
if(params.senderAccountType){
    aggPipe.push({
        $match: {
            senderAccountType : parseInt(params.senderAccountType)
        },
      });
}
 
if(params.receiverAccountType){
    aggPipe.push({
        $match: {
            receiverAccountType : parseInt(params.receiverAccountType)
        },
      });
}
//check params.search not contains integer
//     if (params.search && !appUtils.isInteger(params.search)) {
   if (params.search && !appUtils.isNumber(params.search)) {
    console.log("str")
    aggPipe.push({
      $match: {
        $or: [
                  {"senderName": {$regex: ".*" + params.search + ".*", $options: "i"}},
                  {"receiverName": {$regex: ".*" + params.search + ".*", $options: "i"}},
             ],
      },
    });
  }

  if (params.search && !appUtils.isString(params.search)) {
    console.log("numm")
    aggPipe.push({
      $match: {
        $or: [
                  {"senderMobileNo": {$regex: ".*" + params.search + ".*", $options: "i"}},
                  {"accountNumberTo": parseInt(params.search)  },
                  {"accountNumberFrom":parseInt(params.search) },
                  {"receiverMobileNo": {$regex: ".*" + params.search + ".*", $options: "i"}},
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

    
return transactionDao.aggregate(aggPipe).then((res)=>{
        // console.log(res)
    if(res){
        return res
    }else
    return false
})
}


// getAllViewTransactionsAndFilterByAdmin

// function cancel(id) {
//     transactions.updateOne(
//       { _id: id }, 
//       { $set: { state: "canceled" } }
//     );
//   }


function getAllViewTransactionsAndFilterByAdmin(params){
    console.log(params ,"bb")

    let aggPipe = [];
    let sort = {};
   
    var startDate = new Date(params.startDate);
    var endDate = new Date(params.endDate).setHours(23,59,0)
    //timestamp to date
    var date1 = new Date(endDate);
    console.log(startDate,endDate ,"Mparamsss",date1.getHours() , date1.getMinutes())
    // var year = parseInt(params.searchYear)?parseInt(params.searchYear):date.getFullYear();
   
    if (params.searchYear) {
        aggPipe.push({
                $match: { "year": { $eq: parseInt(params.searchYear) } }
            })
    }
   
    if (params.searchMonth) {
        aggPipe.push({
                $match: { "month": { $eq: parseInt(params.searchMonth) } }
            })
    }
    if (params.searchDay) {
        aggPipe.push({
                $match: { "day": { $eq: parseInt(params.searchDay) } }
            })
    }
   
    if (params.startDate && params.endDate) {
        aggPipe.push({
                    $match: { 
                        $and :[
                           { createdAt: { $gte: startDate }} ,
                            {createdAt: { $lte: date1 } }
                        ]
                    }
                        }) 
    }


    if(params.status){
        aggPipe.push({
            $match: { status: parseInt(params.status)  }
        })
    }
    
 
if(params.accountType ){
    aggPipe.push({
        $match: {
            $or:[
                {senderAccountType : parseInt(params.accountType)},
               { receiverAccountType : parseInt(params.accountType)}
            ]
        },
      });
}

if(params.senderAccountType ){
    aggPipe.push({
        $match: {
        senderAccountType : parseInt(params.senderAccountType)
        },
      });
}
 
if(params.receiverAccountType){
    aggPipe.push({
        $match: {
            receiverAccountType : parseInt(params.receiverAccountType)
        },
      });
}
//check params.search not contains integer
//     if (params.search && !appUtils.isInteger(params.search)) {
   if (params.search && !appUtils.isNumber(params.search)) {
    console.log("str")
    aggPipe.push({
      $match: {
        $or: [
                  {"senderName": {$regex: ".*" + params.search + ".*", $options: "i"}},
                  {"receiverName": {$regex: ".*" + params.search + ".*", $options: "i"}},
             ],
      },
    });
  }

  if (params.search && !appUtils.isString(params.search)) {
    console.log("numm")
    aggPipe.push({
      $match: {
        $or: [
                  {"senderMobileNo": {$regex: ".*" + params.search + ".*", $options: "i"}},
                  {"accountNumberTo": parseInt(params.search)  },
                  {"accountNumberFrom":parseInt(params.search) },
                  {"receiverMobileNo": {$regex: ".*" + params.search + ".*", $options: "i"}},
             ],
      },
    });
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


    // let count, pageNo;
    // if (params.pageNo && params.count) {
    //   pageNo = parseInt(params.pageNo);
    //   count = parseInt(params.count);
    //   aggPipe.push({ $skip: pageNo * count });
    //   aggPipe.push({ $limit: count });
    // }
    let pageNo, count;
    let nestedPipe = [];
    if (params.pageNo && params.count) {
      count = parseInt(params.count);
      pageNo = parseInt(params.pageNo);
      nestedPipe.push(
          {$skip: pageNo * count} 
        )
        nestedPipe.push(
           {$limit: count }
        )
    }
  
  
  aggPipe.push({
    $facet :{
      totalCount :[
        {$count : "dataCount"}
      ],
      pipelineResults : nestedPipe
    }
  })
  
  aggPipe.push({
    $unwind: "$totalCount",
  })
  
    return transactionView.aggregate(aggPipe).toArray()
    // find().toArray()
    .then((res)=>{
        console.log(res,"vvvvvvvvvvvv")
        if(res){
            return res
        }else
        return false
    })
}
  function getTotalTransactions(params){
    console.log(params)
    return transactionDao.count({isDeleted : 0}).then((res)=>{
        
        if(res){
            return res
        }else{
            return false
        }
    })
  }


  function getAllTransactionsByMonth(params){
   console.log(params)
    let aggPipe = []
    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth()+1
    // console.log(month)

    aggPipe.push({
        $match :{
            isDeleted : 0
        }
    })
    if(params.searchYear){
        aggPipe.push({
            $addFields : {"year" :{$year : '$createdAt'}}},
           { $match : {"year" : { $eq: parseInt(params.searchYear) } }}
            )
    }else{
        aggPipe.push({
            $addFields : {"year" :{$year : '$createdAt'}}},
           { $match : {"year" : { $eq: year } }}
            )
    }
   
    if(params.searchMonth){
        aggPipe.push({
            $addFields: { "month": { $month: "$created" }  }
        },
            {
                $match: { "month": { $eq: parseInt(params.searchMonth) } }
            }
      )
    }else{
        aggPipe.push({
            $addFields: { "month": { $month: "$created" }  }
        },
            {
                $match: { "month": { $eq: month } }
            }
      )
    }

   
    aggPipe.push({
        $count :  "totalTransactionsPerMonth",
    })

    return transactionDao.aggregate(aggPipe).then((res)=>{
        // console.log(res)
    if(res.length != 0 ){
        return res
    }else
    return false
})


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
    getAllViewTransactionsAndFilter
};

//========================== Export Module End ===============================
