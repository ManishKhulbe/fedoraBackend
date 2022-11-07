"use strict";
//========================== Load Modules Start =======================

//========================== Load internal modules ====================
var mongoose = require("mongoose");
var promise = require("bluebird");

var _ = require("lodash");
//========================== Load internal modules ====================
const customerAccountModel = require('./customerAccountModel');
const appUtils = require('../../../appUtils')

// init user dao
let BaseDao = require('../../../dao/baseDao');
const customerAccountDao = new BaseDao(customerAccountModel);


//========================== Load Modules End ==============================================

function create(params) {
    console.log(params,">>>>>>>>>>>")
    let userId = appUtils.objectIdConvert(params.userId)
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

//========================== Export Module Start ==============================

module.exports = {
    create,
    isAccountTypeExists,
    getTotalAccount,
    getAllAccountAndFilter
};

//========================== Export Module End ===============================
