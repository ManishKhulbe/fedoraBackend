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

   // console.log(params[0].additional)
   // let m = JSON.parse(params[0].additional)
   // console.log(m)

   // var respObj = {
   //     message: "Notifications fetched",
   //     customerId: params[0].customerId,
   //     profileImg : params[0].profileImg,
   //     title : params[0].title,
   //     subTitle : params[0].subTitle,
   //     body : params[0].body,
   //     additional: params[0].additional,
   //     createdAt : params[0].createdAt

   //   };
     var respObj = {
      message: "Notifications fetched",
        notificationDetails : params[0]
    };
     return respObj;
}
 
 module.exports = {
   
    getNotificationMapper,
    getNotificationDetailsMapper

 };
 