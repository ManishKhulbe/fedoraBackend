/**
 * This file will have request and response object mappings.
 */
 var _ = require("lodash");
 const contstants = require("../../../constant");
 const config = require("../../../config");
 
 function transactionListMapping(params , userParams) {
  console.log(userParams,params )
let transactionList = []
for(let i = 0 ; i<params.length ; i++){
  if(params[i].transactionType != 0){
    transactionList.push({
      transactionId:params[i]._id,
      accountNumber:params[i].accountNumberTo,
      transactionType:params[i].transactionType,
      transactionAmount:params[i].transactionAmount,
      transactionDate:params[i].createdAt,
      remark:params[i].remark,
      status:params[i].status,
      accountNumber:params[i].accountNumberFrom,
      updatedAccountBalance : params[i].senderAccountBalance
  
    })

  }else{
    if(userParams.accountNumber  === params[i].accountNumberFrom ){
      transactionList.push({
        transactionId:params[i]._id,
        accountNumber:params[i].accountNumberTo,
        transactionType:2,
        transactionAmount:params[i].transactionAmount,
        transactionDate:params[i].createdAt,
        remark:params[i].remark,
        status:params[i].status,
        accountNumber:params[i].accountNumberFrom,
        updatedAccountBalance : params[i].senderAccountBalance
    
      })
    }else{
        transactionList.push({
            transactionId:params[i]._id,
            accountNumber:params[i].accountNumberFrom,
            transactionType:1,
            transactionAmount:params[i].transactionAmount,
            transactionDate:params[i].createdAt,
            remark:params[i].remark,
            status:params[i].status,
            accountNumber:params[i].accountNumberTo,
            updatedAccountBalance : params[i].receiverAccountBalance
       
        })
    }
  }

}
   var respObj = {
     message: "top 5 latest transaction",
     transactionDetails: transactionList,
   };
   return respObj;
 }
 
 function transactionListByAdminMapping(totalTransaction,transactionList , monthlyTotalTransactions){
  console.log(monthlyTotalTransactions ," totalTransaction")
  var respObj = {
    message: " transaction list",
    transactionList: transactionList[0]?.pipelineResults,
    dataCount : transactionList[0]?.totalCount?.dataCount,
    totalTransactions : totalTransaction?totalTransaction:0,
    monthlyTotalTransactions : monthlyTotalTransactions ?monthlyTotalTransactions[0].totalTransactionsPerMonth:0
  };
  return respObj;
 }

 function transactionDetailMapping(transactionDetails , params){

  var respObj = {
    transactionDetails :{
      transactionId : transactionDetails._id,
      accountNumberFrom : transactionDetails.accountNumberFrom,
      accountNumberTo: transactionDetails.accountNumberTo,
      transactionAmount: transactionDetails.transactionAmount,
      status: transactionDetails.status,
      createdAt: transactionDetails.createdAt,
      senderName: transactionDetails.senderName,
      receiverName: transactionDetails.receiverName,
      senderMobileNo: transactionDetails.senderMobileNo,
      receiverMobileNo: transactionDetails.receiverMobileNo,
      year: transactionDetails.year,
      month: transactionDetails.month,
      day: transactionDetails.day,
      remark : transactionDetails.remark,
      senderUserType : transactionDetails.senderUserType,
    },
    reqParams : params
  };
  return respObj;
 }


 function editOtherBankTransactionMapping(editTransaction){
  var respObj = {
    message: "transaction updated successfully",
    transactionId : editTransaction._id,
    transactionStatus : editTransaction.status,
    accountNumberFrom:   editTransaction.accountNumberFrom,
    accountNumberTo :editTransaction.accountNumberTo,
    transactionAmount : editTransaction.transactionAmount,
    senderAccountBalance : editTransaction.senderAccountBalance

  };
  return respObj;
 }

 function statementMapping(result , params){
  var respObj = {
    message: "statement list",
    dataCount : result[0]?.totalCount[0]?.dataCount,
    result : result[0]?.pipelineResults,
  };
  return respObj;
 }
 module.exports = {
    transactionListMapping,
    transactionListByAdminMapping,
    transactionDetailMapping,
    editOtherBankTransactionMapping,
    statementMapping

 };
 