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
  console.log(result1);
 
  return {AccountDetails : result0[0]?.pipelineResults, 
    dataCount : result0[0]?.totalCount?.dataCount,
    TotalAccount : result1,
    };
}

function deleteAccountMapping(params){
  var respObj = {
    message: "Deleted Successfully",
   };
   return respObj;
}

function fundTransfer1Mapping(res){
  var respObj = {
    message: "Transaction Successful",
    fundDebit  : res.senderAccountUpdate,
    fundCredit : res.receiverAccountUpdate,
    transactionDetails : res.finalTransaction
    };
    return respObj;
}
function fundTransferMapping( fundDebit,
  fundCredit,transactionDetails){
  var respObj = {
    message: "Transaction Successful",
    fundDebit,fundCredit,transactionDetails
   };
   return respObj;
}

function getUserAccountMapping(result){
  var respObj = {
    message: "Account Details",
    AccountDetails : result
    };
    return respObj;
}

function checkBalanceMapping(res){
  var respObj = {
    message: "Current Balance",
    AccountBalance : res[0].balance
    };
    return respObj;
}

function getReceiverDetailsMapping(res){
  var respObj = {
    message: "Receiver Details",
    ReceiverDetails : res
    };
    return respObj;
}

function addBalanceMapping(res){
  var respObj = {
    message: "Add Successfully D",
    ReceiverDetails : res
    };
    return respObj;
}

function calculateInterestMapping(params){
  var respObj = {
    message: "executed successfully",
    operationDetails : params
    };
    return respObj;
}
module.exports = {
  createMapping,
  accountListMapping,
  deleteAccountMapping,
  fundTransferMapping,
  getUserAccountMapping,
  checkBalanceMapping,
  getReceiverDetailsMapping,
  addBalanceMapping,
  fundTransfer1Mapping,
  calculateInterestMapping
};
