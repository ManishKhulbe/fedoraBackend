


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

var validateCreateService = function (req, res, next) {
let errors=[]

let {serviceName,location  ,description } = req.body

    if(!serviceName){
        errors.push({ fieldName: "serviceName", message: constant.MESSAGES.KEY_CANT_EMPTY.replace("{{key}}", "serviceName") });
    }
    //check serviceType is integer or not
    // if (serviceType && !appUtils.isNumber(serviceType)) {
    //     errors.push({ fieldName: "serviceType", message: constant.MESSAGES.KEY_SHOULD_BE_INTEGER.replace("{{key}}", "serviceType") });
    // }

    if (errors && errors.length > 0) {
        validationError(errors, next);
    }
    next();
};

var validateEditService = function (req, res, next) {
    let errors=[]
    let {
        serviceType
        } = req.body;

        //servicetype should be integer
        if (serviceType && !appUtils.isNumber(serviceType)) {
            errors.push({ fieldName: "serviceType", message: constant.MESSAGES.KEY_SHOULD_BE_INTEGER.replace("{{key}}", "serviceType") });
        }

    if (errors && errors.length > 0) {
        validationError(errors, next);
    }
    next();

    }
var validationError = function (errors, next) {
    if (errors && errors.length > 0) {
        return next(exceptions.getCustomErrorException(constant.MESSAGES.validationError, errors))
    }
    next();
}

module.exports = {
    validateCreateService,
    validateEditService
   
};
//========================== Export module end ==================================
