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
if(parseInt(userParams.accountNumber)  === params[i].accountNumberFrom){
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
   var respObj = {
     message: "top 5 latest transaction",
     transactionDetails: transactionList,
   };
   return respObj;
 }
 
 function transactionListByAdminMapping(totalTransaction,transactionList , monthlyTotalTransactions){
  console.log(transactionList , totalTransaction)
  var respObj = {
    message: " transaction list",
    transactionList: transactionList,
    totalTransactions : totalTransaction?totalTransaction:0,
    monthlyTotalTransactions : monthlyTotalTransactions.length!= 0 ?monthlyTotalTransactions[0].totalTransactionsPerMonth:0
  };
  return respObj;
 }
 module.exports = {
    transactionListMapping,
    transactionListByAdminMapping

 };
 