
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
    
    let newService = new serviceModel(service);

    return serviceDao.save(newService).then((res)=>{
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
    return serviceDao.findOne({_id : params.serviceId}).then((res)=>{
        if(res){
            return true
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



//========================== Export Module Start ==============================

module.exports = {
    create,
    getAlServiceAndFilter,
    isExistsService,
    isServiceIdExists,
    edit,
    softDeleteService,
    deleteService
};

//========================== Export Module End ===============================
