//========================== Load Modules Start ===========================

//========================== Load external Module =========================
var _ = require("lodash");

//========================== Load Internal Module =========================
var appUtils = require("../../../appUtils");
var constant = require("../../../constant");
var exceptions = require("../../../customException");

//========================== Load Modules End =============================



//========================== Export Module Start ===========================

var validateAccountDetails = function (req, res, next) {

    var { accountType, accountInterestRate, accountOverdraft} = req.body;
    var { } = req.headers;
    var errors = [];
   //check accountType is not empty
   if(!accountType){
    errors.push({ field: "accountType", message: "accountType is required" });
    }
    //check accountInterestRate is not empty
    if(!accountInterestRate){
        errors.push({ field: "accountInterestRate", message: "accountInterestRate is required" });
    }
    //check accountOverdraft is not empty
    if(!accountOverdraft){
        errors.push({ field: "accountOverdraft", message: "accountOverdraft is required" });
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
    validateAccountDetails,
   
};
//========================== Export module end ==================================
