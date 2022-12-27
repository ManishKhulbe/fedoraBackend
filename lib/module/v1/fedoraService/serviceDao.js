
"use strict";
//========================== Load Modules Start =======================

//========================== Load internal modules ====================
var mongoose = require("mongoose");
var promise = require("bluebird");

var _ = require("lodash");
//========================== Load internal modules ====================
const serviceModel = require('./serviceModel');
const appUtils = require('../../../appUtils')
// var apputils = require("../../../appUtils");
// init user dao
let BaseDao = require('../../../dao/baseDao');
const serviceDao = new BaseDao(serviceModel);


//========================== Load Modules End ==============================================

function create(params ) {
    let service = {}
    // service.serviceType = params.serviceType
    if(params.serviceName){

        service.serviceName = params.serviceName
    }
    if(params.location){
    service.serviceLogo = params.location
    }
    if(params.description){
        service.description = params.description

    }
    if(params.serviceType){
        service.serviceType = params.serviceType
    }
   
    
    let newService = new serviceModel(service);

    return serviceDao.save(newService).then((res)=>{
        return res
    })
    .catch((err)=>{
        return false
    })
}
function createOptions(params , isExists){


    console.log(params ,"nn" , isExists)
let query ={}
let update = {}
update.options = {
    optionName : params.optionName,
    optionIcon : params.location,
    optionAction : params.optionAction,
    optionType : params.optionType
}
     
if(params.serviceId){
    query._id = appUtils.objectIdConvert(params.serviceId)  
}
    return serviceDao.findOneAndUpdate(query , {$push : update } ,{new : true} ).then((res)=>{
        // console.log(res ,"res")
        return res
    })
    .catch((err)=>{
        return false
    })
}

function isExistsService(params){
    console.log(params ,"nn")
    let aggPipe = [];

    aggPipe.push({
        $match: {
          isDeleted: 0,
        },
      });
    aggPipe.push(
        {
          $addFields: {
            serviceName :{
              $replaceAll :{
                input: "$serviceName",
              find: " ",
              replacement: ""
               }
            }
          },
        },
    )

    let paramsServiceName = params.serviceName.replace(/\s/g, '').toLowerCase()


    aggPipe.push(
        {
            $addFields: {
                serviceName: {
                    $toLower: "$serviceName"
                }
            }
        }
    );
    aggPipe.push({
        $match: {
            serviceName: paramsServiceName
        }
    });

 
return serviceDao.aggregate(aggPipe).then((res)=>{
        // console.log(res)
        if(res.length != 0){
            return true
        }else
        return false
    })
}

function getAlServiceAndFilter(params){
    let aggPipe = [];

    aggPipe.push({
        $match: {
          isDeleted: 0,
        },
      });
    //   serviceName
    aggPipe.push({ "$sort": { "createdAt": -1 } });

    if(params.serviceName){
        aggPipe.push({
            $match: {
                serviceName: {
                    $regex: ".*" + params.serviceName + ".*",
                        $options: "i",
                },
            },
        });
    }
    if(params.status){
        aggPipe.push({
            $match :{
                status : parseInt(params.status) 
            }
        })
    }

    if(params.serviceType){
        aggPipe.push({
            $match :{
                serviceType : parseInt(params.serviceType) 
            }
        })
    }

    let count, pageNo;
    if (params.count && params.pageNo) {
        count = parseInt(params.count)
        pageNo = parseInt(params.pageNo)
        aggPipe.push({ $skip: pageNo * count });
        aggPipe.push({ $limit: count })
    }
    return serviceDao.aggregate(aggPipe).then((res)=>{
        // console.log(res)
        if(res){
            return res
        }else
        return false
    })
}

function isServiceIdExists(params){
    return serviceDao.findOne({_id : appUtils.objectIdConvert(params.serviceId) }).then((res)=>{
        if(res){
            return res
        }else
        return false
    })
}

function edit(params){
console.log(params ,"bb")


    let update = {}
    let query = {}
    query._id = appUtils.objectIdConvert(params.serviceId) ;
    if(params.serviceName){
        update["serviceName"] =params.serviceName ;
    }
    if(params.description){
        update["description"] =params.description ;
    }
    if(params.location){
        update["serviceLogo"] = params.location;
    }
    if(params.status){
        update["status"] = params.status;
    }
    if(params.serviceType){
        update["serviceType"] = parseInt(params.serviceType);
    }

    let options = {};
    options.new = true;
   
    return serviceDao
    .findOneAndUpdate(query, { $set: update }, options)
    .then(function (result) {
        
      if (result) {
        return result;
      } else {
        return false;
      }
    });

}

function softDeleteService(params){
    let query = {}
    query._id = appUtils.objectIdConvert(params.serviceId) ;
    let update = {}
    update.isDeleted = 1
    let options = {};
    options.new = true;
   
    return serviceDao
    .findOneAndUpdate(query, { $set: update }, options)
    .then(function (result) {

        if (result) {
            return result;
        } else {
            return false;
        }
    });
}

function deleteService(params){
    let query = {}
    // console.log(params ,"nn")
    query._id = appUtils.objectIdConvert(params.serviceId) ;
    return serviceDao
    .remove(query)
    .then(function (result) {

        if (result) {
            return result;
        } else {
            return false;
        }
    });
}

// URNrkgS1DpehdsP0vPjYwuaSMo5TeTxuMgH9B1Mw5mGr2d9mUbwmhovZlc5rsd13
// 63aa860167bf9e29937e2906
// 63aa860267bf9e29937e2909

function editOptionAction(params){
    console.log(params ,"nn")
    let query = {}
    let update = {}
    query._id = appUtils.objectIdConvert(params.serviceId) ;
    query['options._id'] = appUtils.objectIdConvert(params.optionId) ;
    
    if(params.optionName){
        update["options.$.optionName"] = params.optionName;
    }
    if(params.optionAction){
        update["options.$.optionAction"] =params.optionAction ;
    }
    if(params.optionType){
        update["options.$.optionType"] =params.optionType ;
    }
    if(params.location){
        update["options.$.optionIcon"] =params.location ;
        
    }
    
    let options = {};
    options.new = true;
   
    return serviceDao
    .findOneAndUpdate   (query, { $set: update }, options)
    .then(function (result) {
          console.log(result ,"result")
        if (result) {
          return result;
        } else {
          return false;
        }
     });

}

function deleteOptionAction(params){
    console.log(params ,"nn")
    let query = {}
    query._id = appUtils.objectIdConvert(params.serviceId) ;
   
    console.log(query ,"nn")
    return serviceDao.findByIdAndUpdate(query ,{ $pull: { options: { _id: appUtils.objectIdConvert(params.optionId) } } } ,{new : true} ).then((res)=>{
        console.log(res ,"res")
        
        if(res){
            return res
        }else
        return false
    }
    )
}

//========================== Export Module Start ==============================

module.exports = {
    create,
    getAlServiceAndFilter,
    isExistsService,
    isServiceIdExists,
    edit,
    softDeleteService,
    deleteService,
    createOptions,
    editOptionAction,
    deleteOptionAction
};

//========================== Export Module End ===============================
