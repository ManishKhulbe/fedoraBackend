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
    },
    membershipIdNumberNotExists: function () {
        return new Exception(16, constants.MESSAGES.MEMBERSHIPID_NOT_EXISTS)
    },
    mobileNumberNotExists : function () {
        return new Exception(17, constants.MESSAGES.MOBILENO_NOT_EXISTS)
    },
    accountNumberNotExists:function () {
        return new Exception(18, constants.MESSAGES.ACCOUNTNO_NOT_EXISTS)
    },
    empNotActive: function () {
        return new Exception(19, constants.MESSAGES.EMPLOYEE_NOT_ACTIVE)
    },
    incorrectPassword: function () {
        return new Exception(20, constants.MESSAGES.INCORRECT_PASS)
    },
    alreadyRegisteredMemberId : function () {
        return new Exception(21, constants.MESSAGES.MEMBERID_ALREADY_EXIST)
    },
    emailNotExists : function () {
        return new Exception(22, constants.MESSAGES.EMAIL_NOT_EXISTS)
    },
    unableToSentOtp : function () {
        return new Exception(23, constants.MESSAGES.UNABLE_TO_SENT_OTP)
    },
    invalidOtp : function(){
        return new Exception(24, constants.MESSAGES.INVALID_OTP)
    },
    accountIdNotExists : function(){
        return new Exception(25, constants.MESSAGES.ACCOUNT_ID_NOT_EXISTS)
    },
    notInitiated: function () {
        return new Exception(26, constants.MESSAGES.NOT_INITIATED)
    },
    failedToChangeStatus: function (id) {
        return new Exception(27, constants.MESSAGES.FAILED_TO_CHANGE_STATUS + id)
    },
    failedToDebit: function (params) {
        console.log(params ,"?")
        return new Exception(28, constants.MESSAGES.FAILED_TO_DEBIT)
    },
    failedToCredit: function () {
        return new Exception(29, constants.MESSAGES.FAILED_TO_CREDIT)
    },
    failedToMoveTransaction: function () {
        return new Exception(30, constants.MESSAGES.FAILED_TO_MOVE_TRANSACTION)
    },
    serviceAlreadyExists : function(){
        return new Exception(30, constants.MESSAGES.SERVICE_ALREADY_EXISTS)
    },
    sameCustomerAlreadyExistsAccountType : function(){
        return new Exception(31, constants.MESSAGES.SAME_CUSTOMER_ALREADY_EXISTS_ACCOUNTTYPE)
    },
    noDataFound : function(){
        return new Exception(32, constants.MESSAGES.NO_DATA_FOUND)
    },
    registrationNotExists : function(){
        return new Exception(33, constants.MESSAGES.REGISTRATION_NOT_EXISTS)
    },
    enteredNameNotExists : function(){
        return new Exception(34, constants.MESSAGES.ENTERED_NAME_NOT_EXISTS)
    },
    accountNumberAlreadyExist : function(){
        return new Exception(35, constants.MESSAGES.ACCOUNTNUMBER_ALREADY_EXISTS)
    },
    interestTypeNotExists : function(){
        return new Exception(36, constants.MESSAGES.INTEREST_TYPE_NOT_EXISTS)
    },
    alreadyRegisteredUser : function(){
        return new Exception(37, constants.MESSAGES.USER_ALREADY_EXIST)
    },
    inactiveUser : function(){
        return new Exception(38, constants.MESSAGES.INACTIVE_USER)
    },
    notRegisteredEmail : function (){
        return new Exception(39, constants.MESSAGES.EMAIL_NOT_REGISTERED)
    },
    userRegisteredAsUser : function(){
        return new Exception(40, constants.MESSAGES.EMAIL_REGISTERED_AS_USER)
    },
    addressTypeNotExists :  function(){
        return new Exception(40, constants.MESSAGES.ADDRESS_TYPE_NOT_EXISTS)
    },
    serviceIdNotExists : function(){
        return new Exception(41, constants.MESSAGES.SERVICE_ID_NOT_EXISTS)
    },
    onlineServiceIdNotExists : function() {
        return new Exception(42, constants.MESSAGES.SERVICE_ID_NOT_EXISTS)
    },
    onlineServiceIdActionNotApplicable : function(){
        return new Exception(43, constants.MESSAGES.ONLINE_SERVICE_NOT_EDITABLE)
    },
    alreadyRegisteredMobileNo : function(){
        return new Exception(44, constants.MESSAGES.MOBILENO_ALREADY_EXIST)
    },
    sameOtherBankAccount : function(){
        return new Exception(45, constants.MESSAGES.SAME_OTHER_BANK_ACCOUNT)
    },
    unableToUpdateStatus : function(){
        return new Exception(46, constants.MESSAGES.UNABLE_TO_UPDATE_STATUS)
    },
    transactionNotInPendingStatus : function(){
        return new Exception(47, constants.MESSAGES.TRANSACTION_NOT_IN_PENDING_STATUS)
    },
    setTxnLimitExceeded : function(){
        return new Exception(48, constants.MESSAGES.SET_TXN_LIMIT_EXCEEDED)
    },
    reachedMaximumLimit : function(){
        return new Exception(49, constants.MESSAGES.REACHED_MAXIMUM_LIMIT)
    }

    
};

//========================== Export Module   End ===========================
