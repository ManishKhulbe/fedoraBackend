
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
 function getGrievanceMapping(params,total ,query) {
  console.log("🚀 ~ file: grievanceMapper.js:18 ~ getGrievanceMapping ~ params,total ,query", params,total ,query)
  
let pending;
let watched;
let actionTaken;
let countAccToStatus = params?params[0].countAccToStatus:[];
  for(let i=0;i<countAccToStatus.length;i++){
    if(countAccToStatus[i]._id == 1){
      pending = countAccToStatus[i].count
    }
    if(countAccToStatus[i]._id == 2){
      watched = countAccToStatus[i].count
    }
    if(countAccToStatus[i]._id == 3){
      actionTaken = countAccToStatus[i].count
    }
  }
  console.log("🚀 ~ file: grievanceMapper.js:46 ~ getGrievanceMapping ~ respObj", params,total ,query)
   var respObj = {
     message: "Service List",
     GrievanceList: params?params[0].pipelineResults: [],
     dataCount : params?params[0].totalCount.dataCount: 0,
     totalGrievance : total.length != 0?total[0].totalCount: 0,
     pending : pending ? pending: 0,
    watched : watched ? watched : 0,
    actionTaken : actionTaken? actionTaken : 0,
     pageNo: query.pageNo,
     count: query.count,
   };

   return respObj;
 }

 function editGrievanceMapping(params){
    var respObj = {
        message: "Edit Successfully",
        GrievanceList: params
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
 