
/**
 * This file will have request and response object mappings.
 */
 var _ = require("lodash");
 const contstants = require("../../../constant");
 const config = require("../../../config");
 
 function benificiaryListMapping(benificiaryList , userParams) {
 
   var respObj = {
     message: "Benificiary List",
     benificiaryDetails: benificiaryList,
   };
   return respObj;
 }
 
 
 module.exports = {
    benificiaryListMapping,

 };
 