//========================== Load Modules Start ===========================

//========================== Load Internal Module =========================

// Load exceptions
var Exception = require("./model/Exception");
var constants = require("./constant");

//========================== Load Modules End =============================

//========================== Export Module Start ===========================

module.exports = {
    intrnlSrvrErr: function (err) {
        return new Exception(1, constants.MESSAGES.INTERNAL_SERVER_ERROR, err);
    },
    unauthorizeAccess: function (err) {
        return new Exception(2, constants.MESSAGES.UNAUTHORIZED_ACCESS, err)
    },
    alreadyRegistered: function (err) {
        return new Exception(3, constants.MESSAGES.EMAIL_ALREADY_EXIST, err)
    },
    invalidEmail: function () {
        return new Exception(4, constants.MESSAGES.INVALID_EMAIL)
    },
    getCustomErrorException: function (errMsg, error) {
        return new Exception(5, errMsg, error);
    },
    userNotFound: function () {
        return new Exception(6, constants.MESSAGES.USER_NOT_REGISTERED)
    },
    incorrectPass: function () {
        return new Exception(7, constants.MESSAGES.INCORRECT_MPIN)
    },
    alreadyRegistered: function () {
        return new Exception(8, constants.MESSAGES.MOBILENO_ALREADY_EXIST)
    },
    otpExpired: function () {
        return new Exception(9, constants.MESSAGES.OTP_EXPIRED)
    },
    notRegisteredMobileNo: function(){
        return new Exception(10, constants.MESSAGES.MOBILENO_NOT_REGISTERED)
    },
    alreadyExistsAccountType: function () {
        return new Exception(11, constants.MESSAGES.ACCOUNTTYPE_ALREADY_EXIST)
    },
    unauthorizedAccess: function () {
        return new Exception(12, constants.MESSAGES.UNAUTHORIZED_ACCESS)
    },
    notSufficientBalance: function () {
        return new Exception(13, constants.MESSAGES.NOT_SUFFICIENT_BALANCE)
    },
    senderAccountNumberNotExists: function () {
        return new Exception(14, constants.MESSAGES.ACCOUNTNUMBER_NOT_EXISTS)
    },
    receiverAccountNumberNotExists: function () {
        return new Exception(15, constants.MESSAGES.RECEIVER_ACCOUNTNUMBER_NOT_EXISTS)
    }
};

//========================== Export Module   End ===========================
