/**
 * This file will have request and response object mappings.
 */
 var _ = require("lodash");
 const contstants = require("../../../constant");
 const config = require("../../../config");
 
 function createMapping(params) {
  
   var respObj = {
     message: "Created Successfully",
     UserDetails: {
      accountId : params._id ,
       accountType: params.accountType,
       accountInterestRate: params.accountInterestRate,
       accountOverdraft: params.accountOverdraft,
       accountLastAccessTime: params.accountLastAccessTime,
     },
   };
   return respObj;
 }
 
function accountListMapping(params , requestParams){
    var respObj = {
        message: "List of Accounts",
        AccountDetails: params,
        count : params.length,
      };
      return respObj;
    }

function editAccountMapping(params , requestParams){
  var respObj = {
  message: "Account Updated Successfully",
  AccountDetails: params,
 };
 return respObj;
}

function deleteAccountMapping(params){
  var respObj = {
    message: "Deleted Successfully",
   };
   return respObj;
}
 
 module.exports = {
    createMapping,
    accountListMapping,
    editAccountMapping,
    deleteAccountMapping
 };
 