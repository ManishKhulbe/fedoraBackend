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

    var { email } = req.query;
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

    var { email } = req.query;
    var { } = req.headers;
    var errors = [];
    if (_.isEmpty(email)) {
        errors.push({ fieldName: "email", message: constant.MESSAGES.KEY_CANT_EMPTY.replace("{{key}}", "email") });
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
   
    if (errors && errors.length > 0) {
        validationError(errors, next);
    }
    next();
}


let validateAddUser = function (req, res, next) {
    let {name, email, mobileNo ,userType , zipCode } = req.body;
    var errors = [];

    //check a string not contains any integer
    if(!appUtils.isString(name)){
        errors.push({ fieldName: "name", message: constant.MESSAGES.KEY_MUST_BE_STRING.replace("{{key}}", "name") });
    }
    
    if (_.isEmpty(name)) {
        errors.push({ fieldName: "name", message: constant.MESSAGES.KEY_CANT_EMPTY.replace("{{key}}", "name") });
    }

    // if (userType == 2  && _.isEmpty(membershipId)) {
    //     errors.push({ fieldName: "membershipId", message: constant.MESSAGES.KEY_CANT_EMPTY.replace("{{key}}", "membershipId") });
    // }

    if(mobileNo.length != 10){
        errors.push({ fieldName: "mobileNo", message: constant.MESSAGES.INVALID_MOBILE_NO });
    }
    if(!appUtils.isValidEmail(email)){
        errors.push({ fieldName: "email", message: constant.MESSAGES.INVALID_EMAIL });
    }

    if(zipCode){
        if(zipCode.length != 6){
            errors.push({ fieldName: "zipCode", message: constant.MESSAGES.INVALID_ZIP_CODE });
        }
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
    var errors = [];
    let { email} = req.body
    console.log(email,'vvv')
    if(email && !appUtils.isValidEmail(email)){
        errors.push({ fieldName: "email", message: constant.MESSAGES.INVALID_EMAIL.replace("{{key}}", "email") });
    }
    if (errors && errors.length > 0) {
        validationError(errors, next);
    }
    next();
}

let validateAddOtherBankDetails = function (req, res, next) {
    let {bankName, accountNumber, IFSCcode} = req.body;
    var errors = [];
    if(_.isEmpty(bankName)){
        errors.push({ fieldName: "bankName", message: constant.MESSAGES.KEY_CANT_EMPTY.replace("{{key}}", "bankName") });
    }
    if(_.isEmpty(accountNumber)){
        errors.push({ fieldName: "accountNumber", message: constant.MESSAGES.KEY_CANT_EMPTY.replace("{{key}}", "accountNumber") });
    }
    if(_.isEmpty(IFSCcode)){
        errors.push({ fieldName: "IFSCcode", message: constant.MESSAGES.KEY_CANT_EMPTY.replace("{{key}}", "ifscCode") });
    }
   if(accountNumber.length < 9 || accountNumber.length > 18){
        errors.push({ fieldName: "accountNumber", message: constant.MESSAGES.INVALID_ACCOUNT_NUMBER });
    }
    //check account number is number or not
    let isnum = /^\d+$/.test(accountNumber);
    if(!isnum){
        errors.push({ fieldName: "accountNumber", message: constant.MESSAGES.KEY_MUST_BE_NUMBER.replace("{{key}}", "accountNumber") });
    }
    if(IFSCcode.length != 11){
        errors.push({ fieldName: "IFSCcode", message: constant.MESSAGES.INVALID_IFSC_CODE });
    }
    let ifscArr = IFSCcode.split('');
    console.log(ifscArr,'ifscArr')
    //check first 4 character is alphabet or not
    let isAlphabet = /^[a-zA-Z]+$/.test(ifscArr[0]+ifscArr[1]+ifscArr[2]+ifscArr[3]);
    if(!isAlphabet){
        errors.push({ fieldName: "IFSCcode", message: constant.MESSAGES.INVALID_IFSC_CODE_CHAR });
    }
    //check last 6 character is number or not
    let isnum1 = /^\d+$/.test(ifscArr[4]+ifscArr[5]+ifscArr[6]+ifscArr[7]+ifscArr[8]+ifscArr[9]+ifscArr[10]);
    if(!isnum1){
        errors.push({ fieldName: "IFSCcode", message: constant.MESSAGES.INVALID_IFSC_CODE_CHAR });
    }

    if (errors && errors.length > 0) {
        validationError(errors, next);
    }
    next();
}

// 7DS1GgypiAMOw8fSmOdvLYHJo6tjjReil0z0sgsOVn8aNanM4nYwayGZlc02bpdv
// 639ac2b74f6d8f9b666c2e9f

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
    validateLoginAsAdmin,
    validateAddUser,
    validateAddOtherBankDetails
};
//========================== Export module end ==================================
