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
      params,
      //   accountId : params._id ,
      //    accountType: params.accountType,
      //    accountInterestRate: params.accountInterestRate,
      //    accountOverdraft: params.accountOverdraft,
      //    accountLastAccessTime: params.accountLastAccessTime,
    },
  };
  return respObj;
}

function accountListMapping(result0, result1, params) {
  console.log(params);
  let dataCount = result0.length 
  return {AccountDetails : result0, 
    TotalAccount : dataCount,
    };
}

function deleteAccountMapping(params){
  var respObj = {
    message: "Deleted Successfully",
   };
   return respObj;
}

function fundTransferMapping( fundDebit,
  fundCredit,transactionDetails){
  var respObj = {
    message: "Transaction Successfull",
    fundDebit,fundCredit,transactionDetails
   };
   return respObj;
}

module.exports = {
  createMapping,
  accountListMapping,
  deleteAccountMapping,
  fundTransferMapping
};
