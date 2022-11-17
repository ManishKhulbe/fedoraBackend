

"use strict";
//========================== Load Modules Start =======================

//========================== Load internal modules ====================
var mongoose = require("mongoose");
var promise = require("bluebird");

var _ = require("lodash");
//========================== Load internal modules ====================
const onlineServiceModel = require('./onlineServiceModel');

var apputils = require("../../../appUtils");
// init user dao
let BaseDao = require('../../../dao/baseDao');
const onlineServiceDao = new BaseDao(onlineServiceModel);


//========================== Load Modules End ==============================================

function apply(params) {

params.customerId = params.userId
    let account = new onlineServiceModel(params);
    return onlineServiceDao.save(account);
}

async function list(params) {
console.log(params,"MMM")
    let aggPipe = [];
    let query = {};

    if (params.status) {
        query.status = parseInt(params.status)
    }
    if (params.serviceId) {
        query.serviceId = apputils.objectIdConvert(params.serviceId)
    }

    aggPipe.push({
        "$match": query
    });
   
    aggPipe.push({
        $sort: {
            createdAt: -1
        }
    })
    aggPipe.push({
        $lookup: {
            from: "users",
            localField: "customerId",
            foreignField: "_id",
            as: "customerDetails"
        }
    })

    aggPipe.push({
        "$unwind": {
            path: "$customerDetails",
            preserveNullAndEmptyArrays: true
        }
    })
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
          from: "services",
          localField: "serviceId",
          foreignField: "_id",
          as: "serviceDetails",
        },
      });
      aggPipe.push({
        $unwind: {
          path: "$serviceDetails",
          preserveNullAndEmptyArrays: true,
        },
      });
   
      aggPipe.push({
        $project: {
        customerId: 1,
        customerName: "$customerDetails.name",
        customerMobileNo :'$customerDetails.mobileNo',
        accountType :'$accountDetails.accountType',
        serviceName : "$serviceDetails.serviceName",
        serviceDescription : "$serviceDetails.description",
        accountType: "$accountDetails.accountType",
        remark: 1,
        status: 1,
        reply:1,
        createdAt : 1,
        year : { $year: "$createdAt" },
        month : { $month: "$createdAt" },
        day : { $dayOfMonth: "$createdAt" },
        }
      });


    if (params.search) {
        aggPipe.push({
            $match: {
                        name: {
                            '$regex': ".*" +params.search + ".*",
                            '$options': 'ix'
                        }
                    }
        })
    }

    if (params.searchYear) {
        aggPipe.push({
            $match: {
                "year": parseInt(params.searchYear)
            }
        })
    }
    if (params.searchMonth) {
        aggPipe.push({
            $match: {
                "month": parseInt(params.searchMonth)
            }
        })
    }
    if (params.searchDay) {
        aggPipe.push({
            $match: {
                "day": parseInt(params.searchDay)
            }
        })
    }
  
    let sortType = -1;
    if (params.sortType == 1) {
        sortType = 1;
    } else {
        sortType = -1;
    }
    let sort = {}
   
    if (params.sortField === "createdAt") {
        sort = {
            "createdAt": sortType
        }
    }
    
    if (params.sortField != undefined) {
        aggPipe.push({
            "$sort": sort
        });
    }

    let count, pageNo;
    if (params.count && params.pageNo) {
        count = parseInt(params.count)
        pageNo = parseInt(params.pageNo)
    
        aggPipe.push({
            $skip: pageNo * count
        });
        aggPipe.push({
            $limit: count
        })
    }
    return await onlineServiceDao.aggregate(aggPipe).then((res)=>{
        return res;
    })
}


function edit(params) {
console.log(params,"MMM")
let update = {}
let query = {}
query._id = apputils.objectIdConvert(params.onlineServiceId)
if(params.status){
    update.status = parseInt(params.status)
}
if(params.reply){
    update.reply = params.reply
}
if(params.serviceId){
    update.serviceId = params.serviceId
}
if(params.remark){
    update.remark = params.remark
}

if(params.accountId){
    update.accountId = apputils.objectIdConvert(params.accountId)
}
if(params.customerId){
    update.customerId = apputils.objectIdConvert(params.customerId)
}
if(params.fulfilDate){
    update.fulfilDate = params.fulfilDate
}

let options = {};
options.new = true;

return onlineServiceDao
.findOneAndUpdate(query, { $set: update }, options)
.then(function (result) {
    console.log(result ,".123.")
    if (result) {
        return result;
    } else {
        return false;
    }
});

}
function softDeleteOnlineService(params){
    console.log(params)
    let update = {}
    let query = {}
    query._id = apputils.objectIdConvert(params.onlineServicesId) ;
    if(params.isDeleted){
        update["isDeleted"] = parseInt(params.isDeleted) ;
    }

    let options = {};
    options.new = true;

    return onlineServiceDao
    .findOneAndUpdate(query, { $set: update }, options)
    .then(function (result) {
      if (result) {
        return result;
      } else {
        return false;
      }
    });
}

function deleteOnlineService(params){
    console.log(params ,"..")
    let query = {}
    query._id = apputils.objectIdConvert(params.onlineServicesId) ;
    return onlineServiceDao
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

function pendingOnlineServices(params){
    let query = {}
    query.status = 0
    query.isDeleted = 0
  
    return onlineServiceDao.count(query).then((res)=>{
        return res;
    })
  

}
//========================== Export Module Start ==============================

module.exports = {
   apply,
   list ,
   edit,
   deleteOnlineService,
   softDeleteOnlineService,
   pendingOnlineServices
};

//========================== Export Module End ===============================








