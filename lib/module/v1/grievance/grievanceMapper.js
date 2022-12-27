
/**
 * This file will have request and response object mappings.
 */
 var _ = require("lodash");
 const contstants = require("../../../constant");
 const config = require("../../../config");
 
 function createGrievanceMapping(params) {

   var respObj = {
     message: "Created Successfully",
     grievanceDetails: params,
   };
   return respObj;
 }
 function getGrievanceMapping(params, query) {
   var respObj = {
     message: "Service List",
     GrievanceList: params,
     pageNo: query.pageNo,
     count: query.count,
   };
   return respObj;
 }

 function editGrievanceMapping(params){
    var respObj = {
        message: "Edit Successfully",
        GrievanceList: params,
      };
      return respObj;
 }

 function deleteGrievanceMapping(params){
    var respObj = {
        message: "Delete Successfully",
        GrievanceList: params,
      };
      return respObj;
 }


 
 module.exports = {
    createGrievanceMapping,
    getGrievanceMapping,
    editGrievanceMapping,
    deleteGrievanceMapping,
  

 };
 