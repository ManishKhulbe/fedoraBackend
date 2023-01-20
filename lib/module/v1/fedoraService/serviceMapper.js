
/**
 * This file will have request and response object mappings.
 */
 var _ = require("lodash");
 const contstants = require("../../../constant");
 const config = require("../../../config");
 
 function createServiceMapping(params) {

   var respObj = {
     message: "Service Created Successfully",
     ServiceDetails: params,
   };
   return respObj;
 }
 function serviceListMapping(params, query) {
   var respObj = {
     message: "Service List",
     ServiceList: params,
     pageNo: query.pageNo,
     count: query.count,
   };
   return respObj;
 }

 function editServiceMapping(params){
    var respObj = {
        message: "Edit Successfully",
        ServiceList: params,
      };
      return respObj;
 }

 function deleteServiceMapping(params){
    var respObj = {
        message: "Delete Successfully",
        ServiceList: params,
      };
      return respObj;
 }

 function createOptionMapping(params){
    var respObj = {
        message: "Option Created Successfully",
        ServiceList: params,
      };
      return respObj;
 }
 
 module.exports = {
    createServiceMapping,
    serviceListMapping,
    editServiceMapping,
    deleteServiceMapping,
    createOptionMapping

 };
 