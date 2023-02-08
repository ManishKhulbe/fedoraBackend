
"use strict";
//========================== Load Modules Start =======================

//========================== Load internal modules ====================
var mongoose = require("mongoose");
var promise = require("bluebird");

var _ = require("lodash");
//========================== Load internal modules ====================
const shareModel = require('./sharesModel');
const appUtils = require('../../../appUtils')
// var apputils = require("../../../appUtils");
// init user dao
let BaseDao = require('../../../dao/baseDao');
const shareDao = new BaseDao(shareModel);


//========================== Load Modules End ==============================================

function addSharePrice(params){
    console.log(params ,">>>>")
    params.perSharePrice = params.currentValue
    params.settingNumber = 1
    let newShare = new shareModel(params)
    // console.log(newShare ,">>>")
     return shareDao.save(newShare).then((res)=>{

        if(res){
            return res
        }
        else{
            return false;
        }
     })
}

function editSharePrice(params){
   
    return shareDao.findOneAndUpdate({_id : appUtils.objectIdConvert(params.shareId)},{perSharePrice :parseInt(params.currentValue)},{new: true}).then((res)=>{
        if(res){
            return res
        }
        else{
            return false;
        }
     })

}

function getSharePrice(params){
    return shareDao.find({settingNumber : 1}).then((res)=>{
        if(res){
            return res
        }
        else{
            return false
        }
    })
}
function isSequenceExists(  params){
    return shareDao.findOne({"settingNumber" : 2}).then((res)=>{
        if(res){
            return res
        }
        else{
            return false
        }
    })
}
function isSharesExists(  params){
    return shareDao.findOne({"settingNumber" : 1}).then((res)=>{
        if(res){
            return res
        }
        else{
            return false
        }
    }
    )
}

function addSequence(params){
    console.log("🚀 ~ file: sharesDao.js:64 ~ addSequence ~ params", params)
    let obj ={}
    if(params.sequenceKeyName){
       obj[params.sequenceKeyName] = params.sequenceKeyValue
       obj["settingNumber"]=2
    }
    const sequence =new shareModel(obj)
   
    return shareDao.save(sequence).then((res)=>{
        if(res){
            return res
        }
        else{
            return false
        }
    })
}

function setSequenceKeyValue(keyName , keyValue){
    return shareDao.findOneAndUpdate({"settingNumber" : 2},{[keyName] : keyValue},{new: true}).then((res)=>{
        if(res){
     
            return res
        }
        else{
            return false
        }
    })
}

//========================== Export Module Start ==============================

module.exports = {
    addSharePrice,editSharePrice,getSharePrice,
    addSequence,isSequenceExists,setSequenceKeyValue,isSharesExists
};

//========================== Export Module End ===============================
