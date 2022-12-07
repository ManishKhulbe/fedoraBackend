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
  //  console.log(params)






// let additional = JSON.parse(params[0].additional)
// console.log(additional,"additional" ) 

   var respObj = {
      message: "Notifications fetched",
        notificationDetails : params[0],
        additional : params[0].additional
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
 
 module.exports = {
   
    getNotificationMapper,
    getNotificationDetailsMapper,
    deleteNotificationsMapper

 };
 