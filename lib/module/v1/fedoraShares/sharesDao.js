
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

    return shareDao.find().then((res)=>{
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
    addSharePrice,editSharePrice,getSharePrice
};

//========================== Export Module End ===============================
