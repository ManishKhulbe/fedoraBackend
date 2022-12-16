
//========================== Load Modules Start ===========================

//========================== Load external Module =========================
var _ = require("lodash");

//========================== Load Internal Module =========================
var appUtils = require("../../../appUtils");
var constant = require("../../../constant");
var exceptions = require("../../../customException");
var ObjectId = require('mongoose').Types.ObjectId;

//========================== Load Modules End =============================



//========================== Export Module Start ===========================

var validateCustomerAccCreate = function (req, res, next) {
let errors=[]
    let { 
        customerId,
        accountNumber,
     } = req.body;
     console.log(req.body,"req.body")

    //  if (!accountType)  {
    //     errors.push({ field: "accountType", message: "Enter accountType " });   
    // }
    if (!customerId.match(/^[0-9a-fA-F]{24}$/)) {
        errors.push({ field: "customerId", message: "Enter valid customerId " });
    }
    if(!accountNumber){
        errors.push({ fieldName: "accountNumber", message: constant.MESSAGES.KEY_CANT_EMPTY.replace("{{key}}", "accountNumber") });
    }
    if (errors && errors.length > 0) {
        validationError(errors, next);
    }
    next();
};

var validateReceiverDetails = function (req, res, next) {
    let errors=[]
    let {
        receiverAccountNumber} = req.query;
        if(!receiverAccountNumber){
            errors.push({ fieldName: "receiverAccountNumber", message: constant.MESSAGES.KEY_CANT_EMPTY.replace("{{key}}", "receiverAccountNumber") });
        }
        
        if (receiverAccountNumber.match(/^[0-9]+$/) == null) {
            errors.push({ fieldName: "receiverAccountNumber", message: constant.MESSAGES.KEY_SHOULD_BE_INTEGER.replace("{{key}}", "receiverAccountNumber") });
        }
      

    if (errors && errors.length > 0) {
        validationError(errors, next);
    }
    next();
};

var validateBeneficiaryDetails = function (req, res, next) {
    let errors=[]
   
    let {
        beneficiaryAccountNumber ,amount} = req.query;
   
        if(!amount){
           
            errors.push({ fieldName: "amount", message: constant.MESSAGES.KEY_CANT_EMPTY.replace("{{key}}", "amount") });
        }
       
        if(!beneficiaryAccountNumber){
            errors.push({ fieldName: "beneficiaryAccountNumber", message: constant.MESSAGES.KEY_CANT_EMPTY.replace("{{key}}", "beneficiaryAccountNumber") });
        }
        
        if (beneficiaryAccountNumber.match(/^[0-9]+$/) == null) {
            errors.push({ fieldName: "beneficiaryAccountNumber", message: constant.MESSAGES.KEY_SHOULD_BE_INTEGER.replace("{{key}}", "beneficiaryAccountNumber") });
        }
        //check amount is integer or not and a positive number
        if (amount.match(/^[0-9]+$/) == null) {
            errors.push({ fieldName: "amount", message: constant.MESSAGES.KEY_SHOULD_BE_INTEGER.replace("{{key}}", "amount") });
        }
        if (amount < 0) {
            errors.push({ fieldName: "amount", message: constant.MESSAGES.KEY_SHOULD_BE_POSITIVE_INTEGER.replace("{{key}}", "amount") });
        }

      

    if (errors && errors.length > 0) {
        validationError(errors, next);
    }
    next();
};

var validationError = function (errors, next) {
    if (errors && errors.length > 0) {
        return next(exceptions.getCustomErrorException(constant.MESSAGES.validationError, errors))
    }
    next();
}

module.exports = {
    validateCustomerAccCreate,
    validateReceiverDetails,
    validateBeneficiaryDetails
   
};
//========================== Export module end ==================================
