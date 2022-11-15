
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
        accountId,
        accountNumber,
     } = req.body;
     console.log(req.body,"req.body")

     if (!accountId.match(/^[0-9a-fA-F]{24}$/))  {
        errors.push({ field: "accountId", message: "Enter valid object Id " });   
    }
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


var validationError = function (errors, next) {
    if (errors && errors.length > 0) {
        return next(exceptions.getCustomErrorException(constant.MESSAGES.validationError, errors))
    }
    next();
}

module.exports = {
    validateCustomerAccCreate,
   
};
//========================== Export module end ==================================
