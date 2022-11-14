//========================== Load Modules Start ===========================

//========================== Load external Module =========================
var _ = require("lodash");

//========================== Load Internal Module =========================
var appUtils = require("../../../appUtils");
var constant = require("../../../constant");
var exceptions = require("../../../customException");

//========================== Load Modules End =============================



//========================== Export Module Start ===========================

var validateLogin = function (req, res, next) {

    var { deviceToken, deviceID, deviceTypeID,email,password } = req.body;
    var { } = req.headers;
    var errors = [];
    if (_.isEmpty(deviceToken)) {
        errors.push({ fieldName: "deviceToken", message: constant.MESSAGES.KEY_CANT_EMPTY.replace("{{key}}", "deviceToken") });
    }
    if (_.isEmpty(deviceID)) {
        errors.push({ fieldName: "deviceID", message: constant.MESSAGES.KEY_CANT_EMPTY.replace("{{key}}", "deviceID") });
    }
    if (_.isEmpty(deviceTypeID)) {
        errors.push({ fieldName: "deviceTypeID", message: constant.MESSAGES.KEY_CANT_EMPTY.replace("{{key}}", "deviceTypeID") });
    }
    email = req.body.email = _.toLower(email);
    if (_.isEmpty(email)) {
        errors.push({ fieldName: "email", message: constant.MESSAGES.KEY_CANT_EMPTY.replace("{{key}}", "Email id") });
    }else if(!appUtils.isValidEmail(email)){
        errors.push({ fieldName: "email", message: constant.MESSAGES.INVALID_EMAIL });
    }

    if (_.isEmpty(password)) {
        errors.push({ fieldName: "password", message: constant.MESSAGES.KEY_CANT_EMPTY.replace("{{key}}", "Password") });
    }

    if (errors && errors.length > 0) {
        validationError(errors, next);
    }
    next();
};

var validateDetails = function (req, res, next) {

    var { userId} = req.body;
    var { } = req.headers;
    var errors = [];
    if (_.isEmpty(userId)) {
        errors.push({ fieldName: "userId", message: constant.MESSAGES.KEY_CANT_EMPTY.replace("{{key}}", "userId") });
    }
    
    if (errors && errors.length > 0) {
        validationError(errors, next);
    }
    next();
};

var validateForgot = function (req, res, next) {

    var { email } = req.body;
    var { } = req.headers;
    var errors = [];

    email = req.body.email = _.toLower(email);
    if (_.isEmpty(email)) {
        errors.push({ fieldName: "email", message: constant.MESSAGES.KEY_CANT_EMPTY.replace("{{key}}", "Email id") });
    }else if(!appUtils.isValidEmail(email)){
        errors.push({ fieldName: "email", message: constant.MESSAGES.INVALID_EMAIL });
    }

    if (errors && errors.length > 0) {
        validationError(errors, next);
    }
    next();
};

var validateEdit= function (req, res, next) {

    var { userId} = req.body;
    var { } = req.headers;
    var errors = [];
    if (_.isEmpty(userId)) {
        errors.push({ fieldName: "userId", message: constant.MESSAGES.KEY_CANT_EMPTY.replace("{{key}}", "userId") });
    }
    
    if (errors && errors.length > 0) {
        validationError(errors, next);
    }
    next();
};

var validateReset = function (req, res, next) {

    var { password } = req.body;
    var { } = req.headers;
    var errors = [];
    if (_.isEmpty(password)) {
        errors.push({ fieldName: "password", message: constant.MESSAGES.KEY_CANT_EMPTY.replace("{{key}}", "password") });
    }
    
    if (errors && errors.length > 0) {
        validationError(errors, next);
    }
    next();
};

var validateUserInfo = function (req, res, next) {

    var { employeeId } = req.body;
    var { } = req.headers;
    var errors = [];
    if (_.isEmpty(employeeId)) {
        errors.push({ fieldName: "employeeId", message: constant.MESSAGES.KEY_CANT_EMPTY.replace("{{key}}", "employeeId") });
    }
    
    if (errors && errors.length > 0) {
        validationError(errors, next);
    }
    next();
};

var validateChangePassword = function (req, res, next) {

    var { oldPassword,password } = req.body;
    var { } = req.headers;
    var errors = [];
    if (_.isEmpty(oldPassword)) {
        errors.push({ fieldName: "oldPassword", message: constant.MESSAGES.KEY_CANT_EMPTY.replace("{{key}}", "oldPassword") });
    }
    if (_.isEmpty(password)) {
        errors.push({ fieldName: "password", message: constant.MESSAGES.KEY_CANT_EMPTY.replace("{{key}}", "password") });
    }
    
    if (errors && errors.length > 0) {
        validationError(errors, next);
    }
    next();
};

var validateUserList = function (req, res, next) {
    let {userType} = req.body;
    var errors = [];
    
    if (_.isEmpty(userType)) {
        errors.push({ fieldName: "userType", message: constant.MESSAGES.KEY_CANT_EMPTY.replace("{{key}}", "userType") });
    }
    
    if (errors && errors.length > 0) {
        validationError(errors, next);
    }
    next();
};

var validateStatusChange = function (req, res, next) {
    let {status,userId} = req.body;
    var errors = [];
    
    if (_.isEmpty(status)) {
        errors.push({ fieldName: "status", message: constant.MESSAGES.KEY_CANT_EMPTY.replace("{{key}}", "status") });
    }
    
    if (_.isEmpty(userId)) {
        errors.push({ fieldName: "userId", message: constant.MESSAGES.KEY_CANT_EMPTY.replace("{{key}}", "userId") });
    }
    
    if (errors && errors.length > 0) {
        validationError(errors, next);
    }
    next();
};

let validateRegistration = function (req, res, next) {
    let {accountNumber, membershipId ,name ,mobileNo ,acceptedTermsAndCondition , email} = req.body;
    var errors = [];
    let isnum = /^\d+$/.test(accountNumber);
    if(!isnum){
        errors.push({ fieldName: "accountNumber", message: constant.MESSAGES.KEY_MUST_BE_NUMBER.replace("{{key}}", "accountNumber") });
    }
    if(!accountNumber){
        errors.push({ fieldName: "accountNumber", message: constant.MESSAGES.KEY_CANT_EMPTY.replace("{{key}}", "accountNumber") });
    }
    if(_.isEmpty(membershipId)){
        errors.push({ fieldName: "membershipId", message: constant.MESSAGES.KEY_CANT_EMPTY.replace("{{key}}", "membershipId") });
    }
    if(_.isEmpty(name)){
        errors.push({ fieldName: "name", message: constant.MESSAGES.KEY_CANT_EMPTY.replace("{{key}}", "name") });
    }
    if(!mobileNo){
        errors.push({ fieldName: "mobileNo", message: constant.MESSAGES.KEY_CANT_EMPTY.replace("{{key}}", "mobileNo") });
    }
   
    //check mobileno length should be 10
    if(mobileNo.length != 10){
        errors.push({ fieldName: "mobileNo", message: constant.MESSAGES.INVALID_MOBILE_NO });

    }
    //check email is valid or not
    // if(!appUtils.isValidEmail(email)){
    //     errors.push({ fieldName: "email", message: constant.MESSAGES.INVALID_EMAIL });
    // }
  
    if (errors && errors.length > 0) {
        validationError(errors, next);
    }
    next();

}

let validateOtp = function (req, res, next) {
    let {otp} = req.body;
    var errors = [];
    if(_.isEmpty(otp)){
        errors.push({ fieldName: "otp", message: constant.MESSAGES.KEY_CANT_EMPTY.replace("{{key}}", "otp") });
    } 
    if (errors && errors.length > 0) {
        validationError(errors, next);
    }
    next();
}

let validateMpin = function (req, res, next) {
    let {mPin} = req.body;
    var errors = [];
    if(!mPin){
        errors.push({ fieldName: "mPin", message: constant.MESSAGES.KEY_CANT_EMPTY.replace("{{key}}", "mPin") });
    }
    if(mPin.length  > 4){
        errors.push({ fieldName: "mPin", message: constant.MESSAGES.MPIN_LENGTH.replace("{{key}}", "mPin")  });
    }
    if (errors && errors.length > 0) {
        validationError(errors, next);
    }
    next();
}

let validateForgetPin = function (req, res, next) {
    let {mobileNo} = req.body;
    var errors = [];
    if(mobileNo.length != 10){
        errors.push({ fieldName: "mobileNo", message: constant.MESSAGES.INVALID_MOBILE_NO });
    }
    let isnum = /^\d+$/.test(mobileNo);
    if(!isnum){
        errors.push({ fieldName: "mobileNo", message: constant.MESSAGES.KEY_MUST_BE_NUMBER.replace("{{key}}", "mobileNo") });
    }
    if(_.isEmpty(mobileNo)){
        errors.push({ fieldName: "mobileNo", message: constant.MESSAGES.KEY_CANT_EMPTY.replace("{{key}}", "mobileNo") });
    }
    if (errors && errors.length > 0) {
        validationError(errors, next);
    }
    next();
}


let validateForgetPinOtp = function (req, res, next) {
    let {otp} = req.body;
    var errors = [];
    if(!otp){
        errors.push({ fieldName: "otp", message: constant.MESSAGES.KEY_CANT_EMPTY.replace("{{key}}", "otp") });
    }
    if (errors && errors.length > 0) {
        validationError(errors, next);
    }
    next();
}

let validateLoginAsAdmin = function (req, res, next) {
    next();
}

var validationError = function (errors, next) {
    if (errors && errors.length > 0) {
        return next(exceptions.getCustomErrorException(constant.MESSAGES.validationError, errors))
    }
    next();
}

module.exports = {
    validateLogin,
    validateForgot,
    validateDetails,
    validateEdit,
    validateReset,
    validateUserInfo,
    validateChangePassword,
    validateUserList,
    validateStatusChange,
    validateRegistration,
    validateOtp,
    validateMpin,
    validateForgetPin,
    validateForgetPinOtp,
    validateLoginAsAdmin
};
//========================== Export module end ==================================
