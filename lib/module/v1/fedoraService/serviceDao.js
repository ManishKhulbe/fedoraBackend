
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
    service.serviceType = params.serviceType
    service.serviceLogo = params.location
    service.discription = params.discription
    
    let newService = new serviceModel(service);

    return serviceDao.save(newService).then((res)=>{
        return res
    })
    .catch((err)=>{
        return false
    })
}


function isExistsService(params){
    
    return serviceDao.findOne({serviceType : params.serviceType}).then((res)=>{
        if(res){
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

    aggPipe.push({ "$sort": { "createdAt": -1 } });
    if(params.serviceType){
        aggPipe.push({
            $match: {
                serviceType: params.serviceType,
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
    if(params.serviceType){
        update["serviceType"] = parseInt(params.serviceType) ;
    }
    if(params.discription){
        update["discription"] =params.discription ;
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
