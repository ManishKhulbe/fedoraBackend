
/**
 * This file will have request and response object mappings.
 */
 var _ = require("lodash");
 const contstants = require("../../../constant");
 const config = require("../../../config");
 
 function applyMapping(params) {
  
   var respObj = {
     message: "Applied Successfully",
     serviceDetails: params
   }
   return respObj;
 }

 function listMapping(params ,totalOnlineService , pendingOnlineServices , completedOnlineServices,rejectedOnlineServices) {
console.log(params ,totalOnlineService , pendingOnlineServices , completedOnlineServices,rejectedOnlineServices)
    var respObj = {
        message: "Listed Successfully",
        serviceDetails: params[0]?.pipelineResults,
        dataCount : params[0]?.totalCount?.dataCount,
        totalOnlineService , 
        pendingOnlineServices , 
        completedOnlineServices,
        rejectedOnlineServices
    }
    return respObj;
}

function editMapping(params) {
  var respObj = {
    message: "edit Successfully",
    serviceDetails: params
}
return respObj;
}


function deleteOnlineServiceMapping(params){
  var respObj = {
    message: "deleted Successfully",
    serviceDetails: params
}
return respObj;
}
 
 module.exports = {
    applyMapping,
    listMapping,
    deleteOnlineServiceMapping,
    editMapping
 };
 