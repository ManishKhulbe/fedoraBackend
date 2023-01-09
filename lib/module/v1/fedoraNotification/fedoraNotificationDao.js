
"use strict";
//========================== Load Modules Start =======================

//========================== Load internal modules ====================
var mongoose = require("mongoose");
var promise = require("bluebird");

var _ = require("lodash");
//========================== Load internal modules ====================
const fedoraNotificationModel = require('./fedoraNotificationModel');
const appUtils = require('../../../appUtils')

let BaseDao = require('../../../dao/baseDao');
const notificationDao = new BaseDao(fedoraNotificationModel);


//========================== Load Modules End ==============================================


function addNotification(params){
    console.log(params ,">>>>")
   
    let newNotification = new fedoraNotificationModel(params)
    // console.log(newShare ,">>>")
     return notificationDao.save(newNotification).then((res)=>{

        if(res){
            return res
        }
        else{
            return false;
        }
     })
}
function getNotification(params){

let date = new Date()
let year = date.getFullYear();
let month = date.getMonth()+1
let day = date.getDate()

console.log(year , month , day , date)
    let aggPipe = []

    aggPipe.push({
        $match :{
            customerId : params.userId
        }
    })
  
    // aggPipe.push({
    //     $addFields :{
    //       year : {  $year : '$createdAt'}
    //     } 
    // })
    // aggPipe.push({
    //     $addFields :{
    //         month : { $month : '$createdAt'}
    //      }
    // })
    // aggPipe.push({
    //     $addFields:{
    //         day :  {$dayOfMonth : '$createdAt'}   
    //      }
    // })

    aggPipe.push({
        $sort:{
            createdAt : -1
         }
    })

    let count, pageNo;
    if (params.count && params.pageNo) {
        count = parseInt(params.count)
        pageNo = parseInt(params.pageNo)
        aggPipe.push({ $skip: pageNo * count });
        aggPipe.push({ $limit: count })
    }

    return notificationDao.aggregate(aggPipe).then((res)=>{
        // console.log(res)
        if(res){
            return res
        }
        else{
            return false
        }
    })
}


function getNotificationDetails(params){
console.log(params )

    return notificationDao.find({_id : appUtils.objectIdConvert(params.notificationId)}).then((res)=>{
       
        if(res){
            return res
        }
        else{
            return false
        }
    })
}


function getNotificationDeleteByMonth(){
    let aggPipe = []
    let date = new Date()
    let year = date.getFullYear();
    let month = date.getMonth()
    let day = date.getDate()
    console.log(year , month , day , date)
      aggPipe.push({
        $addFields :{
          year : {  $year : '$createdAt'}
        } 
    })
    aggPipe.push({
        $addFields :{
            month : { $month : '$createdAt'}
         }
    })
    aggPipe.push({
        $addFields:{
            day :  {$dayOfMonth : '$createdAt'}   
         }
    })
    aggPipe.push({
        $match :{
            year : year,
            month : month
        }
    })

    return notificationDao.aggregate(aggPipe).map(function(doc) {
        // notificationDao.remove({ "_id": doc._id });
        notificationDao.findByIdAndUpdate({ "_id": doc._id },{isDeleted : 1});
      }).then((res)=>{
        console.log(res ,"bbb")
        if(res){
            return res
        }
        else{
            return false
        }
    })
}

function seenNotification(params){
    let notificationArray=JSON.parse(params.notificationIdArray) 
    console.log("🚀 ~ file: fedoraNotificationDao.js:155 ~ seenNotification ~ notificationArray", notificationArray)
    return notificationDao.updateMany({_id : {$in : notificationArray}},{$set : {isSeen : 1}}).then((res)=>{
        if(res){
            return res;
        }else{
            return false
        }
    })
}
//========================== Export Module Start ==============================

module.exports = {
    addNotification,
    getNotificationDetails,
    getNotification,
    getNotificationDeleteByMonth,
    seenNotification
};

//========================== Export Module End ===============================
