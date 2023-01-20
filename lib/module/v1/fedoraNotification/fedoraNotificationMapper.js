// 

/**
 * This file will have request and response object mappings.
 */
 var _ = require("lodash");
 const contstants = require("../../../constant");
 const config = require("../../../config");

 

 function getNotificationMapper(params){

    var respObj = {
        message: "Notifications fetched",
        notificationsDetails: params,
      };
      return respObj;
 }

 function getNotificationDetailsMapper(params){
   console.log(params)






let additional = JSON.parse(params[0].additional)

   var respObj = {
      message: "Notifications fetched",
        notificationDetails : { 
         notificationId : params[0]._id,
         customerId : params[0].customerId,
         profileImg : params[0].profileImg,
         title : params[0].title,
         subTitle : params[0].subTitle,
         body : params[0].body,
         isDeleted : params[0].isDeleted,
         createdAt : params[0].createdAt,
        },
        transactionId : additional._id,
        accountNumberFrom : additional.accountNumberFrom,
         accountNumberTo : additional.accountNumberTo,
         transactionAmount : additional.transactionAmount,
         status : additional.status,
         transactionDate : additional.createdAt,
         remark : additional.remark,
    };
     return respObj;
}


function deleteNotificationsMapper(params ){

  var respObj = {
    message: "cron started successfully",
    params
  };
 
   return respObj;
}

function seenNotificationMapper(params){
   var respObj = {
      message: "seen notification successful",
      params
    };
   
     return respObj;
}
 
 module.exports = {
   
    getNotificationMapper,
    getNotificationDetailsMapper,
    deleteNotificationsMapper,
    seenNotificationMapper

 };
 