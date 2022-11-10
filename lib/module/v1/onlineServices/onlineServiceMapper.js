
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

 function listMapping(params) {

    var respObj = {
        message: "Listed Successfully",
        serviceDetails: params
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
 
 module.exports = {
    applyMapping,
    listMapping,

    editMapping
 };
 