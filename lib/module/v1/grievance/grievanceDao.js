
"use strict";
//========================== Load Modules Start =======================

//========================== Load internal modules ====================
var mongoose = require("mongoose");
var promise = require("bluebird");

var _ = require("lodash");
//========================== Load internal modules ====================
const grievanceModel = require('./grievanceModel');
const appUtils = require('../../../appUtils')
// var apputils = require("../../../appUtils");
// init user dao
let BaseDao = require('../../../dao/baseDao');
const grievanceDao = new BaseDao(grievanceModel);


//========================== Load Modules End ==============================================

function create(params ) {
    let newGrievance = new grievanceModel(params);

    return grievanceDao.save(newGrievance).then((res)=>{
        return res
    })
    .catch((err)=>{
        return false
    })
}


function totalGrievance(params){
    const date = params.date? new Date(params.date): new Date();
    const year = date.getFullYear();
    const month = date.getMonth()+1;
    const day = date.getDate();

    
    let aggPipe = [];

    aggPipe.push({
        $match: {
          isDeleted: 0,
        },
      });

    aggPipe.push({ "$sort": { "createdAt": -1 } });

    aggPipe.push({
        $addFields: {
            year:{
                $year: "$createdAt"
            },
            month:{
                $month: "$createdAt"
            },
            day:{
                $dayOfMonth: "$createdAt"
            }
        }
    })

    if(params.date){
        aggPipe.push({
            $match: {
                year: year,
                month: month,
                day: day
            }
        })
    }else{
        aggPipe.push({
            $match: {
                year: year,
                month: month
            }
        })
    }

    aggPipe.push({
        $count: "totalCount"
    })
  return grievanceDao.aggregate(aggPipe).then((res)=>{
    
        if(res){
            return res
        }else
        return false
    })
}

function getAlGrievanceAndFilter(params){
    console.log("🚀 ~ file: grievanceDao.js:85 ~ getAlGrievanceAndFilter ~ params", params)

    const date = params.date? new Date(params.date): new Date();
    const year = date.getFullYear();
    const month = date.getMonth()+1;
    const day = date.getDate();

    
    let aggPipe = [];

    aggPipe.push({
        $match: {
          isDeleted: 0,
        },
      });

    aggPipe.push({ "$sort": { "createdAt": -1 } });

    aggPipe.push({
        $addFields: {
            year:{
                $year: "$createdAt"
            },
            month:{
                $month: "$createdAt"
            },
            day:{
                $dayOfMonth: "$createdAt"
            }
        }
    })

    if(params.date){
        aggPipe.push({
            $match: {
                year: year,
                month: month,
                day: day
            }
        })
    }else{
        aggPipe.push({
            $match: {
                year: year,
                month: month
            }
        })
    }
 
    if(params.search ){
        if(/^\d+$/.test(params.search)){
            aggPipe.push({
                $match: {
                    customerMobile: {
                        $regex: ".*" + parseInt(params.search) + ".*",
                            $options: "i",
                    },
                },
            });
        }else{
            aggPipe.push({
                $match: {
                    customerName: {
                        $regex: ".*" + params.search + ".*",
                            $options: "i",
                    },
                },
            });
        }
        
    }
    if(params.status){
        aggPipe.push({
            $match :{
                status : parseInt(params.status) 
            }
        })
    }

    let pageNo, count;
    let nestedPipe = [];
    let nestedPipe2 = [];
    nestedPipe2.push({
        $group : {
            _id : "$status",
            count : {$sum : 1}
        }
    })
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
      pipelineResults : nestedPipe,
      countAccToStatus : nestedPipe2
    }
  })
  
  aggPipe.push({
    $unwind: "$totalCount",
  })
    return grievanceDao.aggregate(aggPipe).then((res)=>{
        console.log("🚀 ~ file: grievanceDao.js:85 ~ getAlGrievanceAndFilter ~ res", res)
    
        if(res.length!= 0){
            return res
        }else
        return false
    })
}


function edit(params){
console.log(params ,"bb")


    let update = {}
    let query = {}
    query._id = appUtils.objectIdConvert(params.grievanceId) ;
    if(params.status){
        update["status"] =+params.status ;
    }
  

    let options = {};
    options.new = true;
   
    return grievanceDao
    .findOneAndUpdate(query, { $set: update }, options)
    .then(function (result) {
        
      if (result.length != 0) {
        return result;
      } else {
        return false;
      }
    });

}

function deleteGrievance(params){
    let query = {}
    query._id = appUtils.objectIdConvert(params.grievanceId) ;
    let update = {}
    update.isDeleted = 1
    let options = {};
    options.new = true;
   
    return grievanceDao
    .findOneAndUpdate(query, { $set: update }, options)
    .then(function (result) {
        if (result) {
            return result;
        } else {
            return false;
        }
    });
}

function pendingGrievance(params){
    return grievanceDao.count({status : 1, isDeleted : 0})
}

//========================== Export Module Start ==============================

module.exports = {
    create,
    getAlGrievanceAndFilter,
    edit,
    deleteGrievance,
    totalGrievance,
    pendingGrievance
   
};

//========================== Export Module End ===============================
