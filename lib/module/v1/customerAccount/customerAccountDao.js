"use strict";
//========================== Load Modules Start =======================

//========================== Load internal modules ====================
var mongoose = require("mongoose");
var promise = require("bluebird");

var _ = require("lodash");
//========================== Load internal modules ====================
const customerAccountModel = require('./customerAccountModel');
const appUtils = require('../../../appUtils')
var apputils = require("../../../appUtils");
// init user dao
let BaseDao = require('../../../dao/baseDao');
const customerAccountDao = new BaseDao(customerAccountModel);
const transactionDao = require('../transaction/transactionDao');
// const { options } = require("./customerAccountRoute");

//========================== Load Modules End ==============================================

function create(params) {
    console.log(params,">>>>>>>>>>>")
    let userId = appUtils.objectIdConvert(params.customerId)
    let accountId = appUtils.objectIdConvert(params.accountId)
    console.log(userId,">>>>>>>>>>>" ,accountId )
    let account = new customerAccountModel(params);
    console.log(account,"MMMMMMMMMM")
    return customerAccountDao.save(account);
}

function isAccountTypeExists(params){
    console.log(params,">>>>>>>>>>>")
    return accountDao.findOne({ accountType :params.accountType})
}



function rollback(params, transactionId ){
console.log(params, transactionId ,"mani")
customerAccountDao.updateOne({
    accountNumber: parseInt(params.senderAccountNumber), 
    pendingTransaction: { $in: [transactionId] }
  }, {
    $inc: { balance: parseFloat(params.transactionAmount) }, 
    $pull: { pendingTransaction: transactionId }
  });  
  console.log(params, transactionId ,"mani")
// Reverse credit
customerAccountDao.updateOne({
  accountNumber: parseInt(params.receiverAccountNumber), 
  pendingTransaction: { $in: [transactionId] }
}, {
  $inc: { balance: -parseFloat(params.transactionAmount) }, 
  $pull: { pendingTransaction: transactionId }
});  

   transactionDao.cancelTransactionStatus(transactionId);

}

function cleanup(from, to, id) {
  // Remove the transaction ids
  console.log(from, to, id ,"mani")
  customerAccountDao.updateOne(
    { _id: from._id }, 
    { $pull: { pendingTransaction: id } });
  
  // Remove the transaction ids
  customerAccountDao.updateOne(
    { _id: to._id }, 
    { $pull: { pendingTransaction: id } });

  // Update transaction to committed
  transactionDao.changeTransactionStatus(id, 2);
}
function isAccountNumberExists(params,user){
  let query = {};
  if(params.accountNumber){
      query.accountNumber = params.accountNumber;
  }
  if(user){
    // console.log()
    // console.log(user,"vvv")
    query.customerId =  user._id;
  }
      return customerAccountDao.findOne(query)
      .then(function (result) {
     
          if (result) {
            // console.log(result ,"bbb")
              return result;
          }
          else {
              return false;
          }
      })
}

async function getTotalAccount(params){
    var date = new Date();
    var year = parseInt(params.searchYear)?parseInt(params.searchYear):date.getFullYear();
    let query = {}
    let aggPipe = [];
    let sort = {};
    if (params.searchYear) {
        aggPipe.push({
            $addFields: { "year": { $year: "$createdAt" }  }
        },
            {
                $match: { "year": { $eq: parseInt(year) } }
            })
    }
   
    if (params.searchMonth) {
        aggPipe.push({
            $addFields: { "month": { $month: "$createdAt" }  }
        },
            {
                $match: { "month": { $eq: parseInt(params.searchMonth) } }
            })
    }
    if (params.startDate && params.endDate) {
        let endDate = new Date(params.endDate)
        endDate = endDate.setHours(23,59,0)
        query['$and'] = [
            { createdAt: { $gte: new Date(params.startDate) } },
            { createdAt: { $lte: new Date(endDate) } },
        ];
    }
    aggPipe.push({
        $lookup :{
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userDetails"
        }
    })

      aggPipe.push({
        "$unwind": {
            path: "$userDetails",
            "preserveNullAndEmptyArrays": true
        }
    })
  
    aggPipe.push({
        $lookup :{
            from: "accounts",
            localField: "accountId",
            foreignField: "_id",
            as: "accountDetails"
        }
    })

    aggPipe.push({
        "$unwind": {
            path: "$accountDetails",
            "preserveNullAndEmptyArrays": true
        }
    })

    aggPipe.push({
        $project : {
            userId : 1,
            accountId : 1,
            createdAt :1,
            updatedAt : 1,
            name : "$userDetails.name",
            accountType :'$accountDetails.accountType'
        }
    })
    if (params.AccountType) {
        aggPipe.push({ "$match": {amountType: parseInt(params.AccountType) }});
    }

    if (query){
        aggPipe.push({ "$match": query });
    }

    if (params.search) {
        aggPipe.push({
          $match: {"name": {$regex: ".*" + params.search + ".*", $options: "i"}},
      })
    }

    aggPipe.push({
        $group:
        {
            _id: null,
            totalAccount: { $sum: 1 }
        }
    })
    
    return await customerAccountDao.aggregate(aggPipe)
    // const mk = await customerAccountDao.aggregate(aggPipe)
    // console.log(mk ,"VVVVVVVVv")
}


async function getAllAccountAndFilter(params){
    var date = new Date();
    var year = parseInt(params.searchYear)?parseInt(params.searchYear):date.getFullYear();
    let query = {}
    let aggPipe = [];
    let sort = {};
    aggPipe.push({
        $match: {
          isDeleted: 0,
        },
      });

      aggPipe.push({
        $lookup: {
          from: "users",
          localField: "customerId",
          foreignField: "_id",
          as: "userDetails",
        },
      });
      aggPipe.push({
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: true,
        },
      });

      aggPipe.push({
        $lookup: {
          from: "accounts",
          localField: "accountId",
          foreignField: "_id",
          as: "accountDetails",
        },
      });
      aggPipe.push({
        $unwind: {
          path: "$accountDetails",
          preserveNullAndEmptyArrays: true,
        },
      });
    aggPipe.push({
        $project: {
            customerId: 1,
            accountId:1,
            balance : 1,
            accountCreated : 1,
            accountNumber : 1,
            name: "$userDetails.name" ,
            mobileNo : "$userDetails.mobileNo", 
            accountType : "$accountDetails.accountType",
            createdAt: 1,
            updatedAt: 1,
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day : { $dayOfMonth: "$createdAt" },
        },
      });
     
    if (params.searchYear) {
        aggPipe.push(
            {
                $match: { "year": { $eq: parseInt(year) } }
            })
    }
   
    if (params.searchMonth) {
        aggPipe.push(
            {
                $match: { "month": { $eq: parseInt(params.searchMonth) } }
            })
    }
    console.log(params.searchDay,"MMMMMMMMMMMMMMMMMMMMM")
    if (params.searchDay) {
        aggPipe.push(
            {
                $match: { "day": { $eq: parseInt(params.searchDay) } }
            })
    }
    // if (params.startDate && params.endDate) {
    //     let endDate = new Date(params.endDate)
    //     endDate = endDate.setHours(23,59,0)
    //     query['$and'] = [
    //         { createdAt: { $gte: new Date(params.startDate) } },
    //         { createdAt: { $lte: new Date(endDate) } },
    //     ];
    // }
  
  
   
    if (params.AccountType) {
        aggPipe.push({ "$match": {accountType: parseInt(params.AccountType) }});
    }

    if (params.search && !params.search.match(/\d+/g)) {
        aggPipe.push({
          $match: {"name": {$regex: ".*" + params.search + ".*", $options: "i"}},
      })
    }
//check params.search is a number
aggPipe.push({
  $addFields: {
      accountNumber: { $toString: "$accountNumber" },
  },
});

    if (params.search && params.search.match(/\d+/g)) {
        aggPipe.push({
          $match: {$or :[{accountNumber: {$regex: ".*" + params.search + ".*" , $options: "i"}},
          {mobileNo: {$regex: ".*" + params.search + ".*" , $options: "i"}}   ]}
        
      })

    }

    //sorting ====================
    let sortType = -1;
    if (params.sortType == 1) {
      console.log("params.sortType", params.sortType);
  
      sortType = 1;
    } else {
      sortType = -1;
    }
  console.log(sortType ,"sortType")
    if (params.sortType && params.sortField) {
        sort[params.sortField] = sortType;
    } else {
        sort["createdAt"] = -1;
    }
    aggPipe.push({
        $sort: sort,
    });

    aggPipe.push({ $sort: sort });

    //pagination ====================
    let count, pageNo;
    if (params.count && params.pageNo) {
        count = parseInt(params.count)
        pageNo = parseInt(params.pageNo)
        aggPipe.push({ $skip: pageNo * count });
        aggPipe.push({ $limit: count })
    }
    return await customerAccountDao.aggregate(aggPipe)
    //     const mk = await customerAccountDao.aggregate(aggPipe)
    // console.log(mk ,"VVVVVVVVv")
}


function softDeleteAccount(params){
    console.log(params)
    console.log(params ,"<MMMMMMMMMMMMM")
    let update = {}
    let query = {}
    query._id = apputils.objectIdConvert(params.customerAccountId) ;
    if(params.isDeleted){
        update["isDeleted"] = parseInt(params.isDeleted) ;
    }

    let options = {};
    options.new = true;

    return customerAccountDao
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
    query._id = apputils.objectIdConvert(params.customerAccountId) ;
    return customerAccountDao
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
function checkReceiverAccount(params){
// console.log(params,"patsduycgyv")
return customerAccountDao.find({accountNumber :parseInt(params.receiverAccountNumber) }).then((res)=>{
    // console.log(res,"VVVV")
    
    if(res){
        return res;
    }else{
        return false;
    }
})

}


function checkSenderBalance(params){
console.log(params,"MMMM")
let aggPipe = [];
let query = {};

query.accountNumber = parseInt(params.senderAccountNumber) 
query.customerId = params.userId
aggPipe.push({$match : query})
aggPipe.push({
  $match: {
    isDeleted: 0,
  },
});

aggPipe.push({
  $lookup: {
    from: "users",
    localField: "customerId",
    foreignField: "_id",
    as: "customerDetails",
  },
});
aggPipe.push({
  $unwind: {
    path: "$customerDetails",
    preserveNullAndEmptyArrays: true,
  },
});
aggPipe.push({
    $lookup: {
      from: "accounts",
      localField: "accountId",
      foreignField: "_id",
      as: "accountDetails",
    },
  });
  aggPipe.push({
    $unwind: {
      path: "$accountDetails",
      preserveNullAndEmptyArrays: true,
    },
  });
aggPipe.push({
  $project: {
    senderName : "$customerDetails.name",
    senderEmail : "$customerDetails.email",
    senderUserType :"$customerDetails.userType",
    senderAccountType : '$accountDetails.accountType',
    createdAt: 1,
    updatedAt: 1,
    status: 1,
    created: 1,
    balance:1,
    accountNumber:1,
    customerId : 1
  },
});

return customerAccountDao.aggregate(aggPipe).then(function (result) {
// console.log(result ,"BBB")
  if (result) {
    return result;
  } else {
    return false;
  }
});
}

function fundDebit(params , transactionAmount ,transactionId){
//substract the amount from sender account
console.log(transactionId ,">>>>>>>>>>>>>>>")
let update = {}
let query = {}
query.accountNumber = parseInt(transactionAmount.senderAccountNumber)
query.customerId = transactionAmount.userId
// update["balance"] = parseFloat(params[0].balance) - parseFloat(transactionAmount.transactionAmount) ;
let options = {};
options.new = true;
// return customerAccountDao.updateOne( query , { $inc: { balance: -parseFloat(transactionAmount.transactionAmount) }} ,options)
return customerAccountDao
.findOneAndUpdate(query , { $inc: { balance: -parseFloat(transactionAmount.transactionAmount) } ,$push: { pendingTransaction: transactionId }},options)
.then(function (result) {
    console.log(result ,"..")
    if (result) {
        return result;
    } else {
        return false;
    }
});
 
}

function fundCredit(receiver ,params ,transactionId){

let update = {}
let query = {}
query.accountNumber = parseInt(params.receiverAccountNumber)
query.customerId = receiver[0].customerId
// update["balance"] = parseFloat(receiver[0].balance) + parseFloat(params.transactionAmount) ;
let options = {};
options.new = true;
// .findOneAndUpdate(query, { $set: update }, options)
return customerAccountDao
.findOneAndUpdate(query , { $inc: { balance: parseFloat(params.transactionAmount) } , $push: { pendingTransaction: transactionId } },options)
.then(function (result) {
    // console.log(result ,".123.")
    if (result) {
        return result;
    } else {
        return false;
    }
});
 
}


function checkBalance(params){
  console.log(params ,"MMMM")
let query = {}
  query.customerId =  params.userId
  if(params.customerAccountId){
    query._id = appUtils.objectIdConvert(params.customerAccountId)
  }
  let options = {};
options.new = true;
console.log(query)
  return customerAccountDao.find(query).then((res)=>{
      if(res){
          return res;
      }else{
          return false;
      }
  })
}

function getUserAccount(params){
  console.log(params)
    let aggPipe = [];
    let query = {};
    query.customerId = params.userId
    aggPipe.push({$match : query})
    aggPipe.push({
      $match: {
        isDeleted: 0,
      },
    });

    aggPipe.push({
        $lookup: {
          from: "accounts",
          localField: "accountId",
          foreignField: "_id",
          as: "accountDetails",
        },
      });
      aggPipe.push({
        $unwind: {
          path: "$accountDetails",
          preserveNullAndEmptyArrays: true,
        },
      });

    aggPipe.push({
      $project: {
        accountNumber: "$accountNumber",
        balance: 1,
        accountType: "$accountDetails.accountType",
        createdAt: 1,
        updatedAt: 1,
      }
    });
return customerAccountDao.aggregate(aggPipe).then(function (result) {
  // console.log(result ,"BBB")
    if (result) {
      return result;
    } else {
      return false;
    }
  });

    
    }


    function getReceiverDetails(params){
        let aggPipe = [];
        let query = {};
        query.accountNumber = parseInt(params.receiverAccountNumber)
        aggPipe.push({$match : query})
        aggPipe.push({
          $match: {
            isDeleted: 0,
          },
        });
    
        aggPipe.push({
            $lookup: {
              from: "accounts",
              localField: "accountId",
              foreignField: "_id",
              as: "accountDetails",
            },
          });
          aggPipe.push({
            $unwind: {
              path: "$accountDetails",
              preserveNullAndEmptyArrays: true,
            },
          });
          aggPipe.push({
            $lookup: {
              from: "users",
              localField: "customerId",
              foreignField: "_id",
              as: "customerDetails",
            },
          });
          aggPipe.push({
            $unwind: {
              path: "$customerDetails",
              preserveNullAndEmptyArrays: true,
            },
          });
    
        aggPipe.push({
          $project: {
            accountNumber: "$accountNumber",
            balance: 1,
            accountType: "$accountDetails.accountType",
            receiverUserId : '$customerDetails._id',
            customerName :"$customerDetails.name",
            customerMobileNo : "$customerDetails.mobileNo",
            createdAt: 1,
            updatedAt: 1,
          }
        });
    return customerAccountDao.aggregate(aggPipe).then(function (result) {
      // console.log(result ,"BBB")

        if (result) {
          return result;
        } else {
          return false;
        }
      });

    }


    function addBalance(params){
      console.log(params ,"MMMM")
        let query = {}
        query.accountNumber = parseInt(params.beneficiaryAccountNumber)
        let options = {};
        options.new = true;
        
        return customerAccountDao
        .findOneAndUpdate
        (query , { $inc: { balance: parseFloat(params.amount) } },options)
        .then(function (result) {
            if (result) {
                return result;
            } else {

                return false;
            }
        });
    }


    function sameTypeAccountExists(params){
        let query = {}
        console.log(params ,"MMMM")
        query.customerId =  appUtils.objectIdConvert(params.customerId)
        query.accountId =  appUtils.objectIdConvert(params.accountId)
        let options = {};
        options.new = true;
        console.log(query)
        return customerAccountDao.find(query).then((res)=>{
       
            if(res){
                return res;
            }else{
                return false;
            }
        })
    }

    function totalNoOfAccountByType(params){
        let aggPipe = [];
        aggPipe.push({
          $match: {
            isDeleted: 0,
          },
        });



        aggPipe.push({
            $lookup: {
              from: "accounts",
              localField: "accountId",
              foreignField: "_id",
              as: "accountDetails",
            },
          });
          aggPipe.push({
            $unwind: {
              path: "$accountDetails",
              preserveNullAndEmptyArrays: true,
            },
          });
        
          aggPipe.push({
            $project: {
              accountType : "$accountDetails.accountType",
              _id: 1,
              customerId: 1,
              accountId: 1,
              balance: 1,
              accountCreated: 1,
              isDeleted: 1,
              accountNumber: 1,
              pendingTransaction: 1,
              createdAt: 1,
              updatedAt: 1,
            }
          });
       

          aggPipe.push({
            $group: {
              _id : "$accountType",
              count :{"$sum" : 1}
            }
          });
         
          aggPipe.push({
            $sort: {
              _id : 1
            }
          });

        return customerAccountDao.aggregate(aggPipe).then(function (result) {
            if (result) {
              return result;
            } else {
              return false;
            }
          });

    }

 function sameAccountNumberExists(param){
    let query = {}
    query.accountNumber = parseInt(param.accountNumber)
    let options = {};
    options.new = true;
    return customerAccountDao.find(query).then((res)=>{
        if(res){
            return res;
        }else{
            return false;
        }
    })
 }

 function getTotalAccount1(params){
  // let aggPipe = [];
  //       aggPipe.push({
  //         $match: {
  //           isDeleted: 0,
  //         },
  //       });

  //       aggPipe.push({
  //         $group: {
  //           _id : " ",
  //           count :{"$sum" : 1}
  //         }
  //       });
       
      return customerAccountDao.count({isDeleted : 0}).then(function (result) {
          if (result) {
            return result;
          } else {
            return false;
          }
        });  
 }


 function calculateInterest(params, interest ,interestTimePeriod){
  console.log(interest ,interestTimePeriod ,"MMMM")
  let query = {}
 
  let options = {};
  options.new = true;

  let secondPart = (interest.accountInterestRate * interestTimePeriod)/100
  console.log(secondPart ,"secondPart")
  //round off to 2 decimal places
  // secondPart = Math.round(secondPart * 100) / 100
  return customerAccountDao.updateMany({accountId : interest._id},
   [ 
   { $set :{
      balance :{
        $round :[
          {$add : [ "$balance" , { $multiply :[
            "$balance",
            secondPart
          ]}]}
         ,2
        ]
        }
      }
    }
     ],options).then((res)=>{
      // console.log(res ,"MMMkkk")
      if(res){
        return res;
      }else{
        return false;
      }
    })

 
}
//========================== Export Module Start ==============================

module.exports = {
    create,
    isAccountTypeExists,
    getTotalAccount,
    getAllAccountAndFilter,
    softDeleteAccount,
    deleteAccount,
    checkSenderBalance,
    fundDebit,
    fundCredit,
    checkReceiverAccount,
    getUserAccount,
    isAccountNumberExists,
    rollback,
    cleanup,
    checkBalance,
    getReceiverDetails,
    addBalance,
    sameTypeAccountExists,
    totalNoOfAccountByType,
    sameAccountNumberExists,
    getTotalAccount1,
    calculateInterest
};

//========================== Export Module End ===============================
