const STATUS_CODE = {
	ERROR: 0,
	SUCCESS: 1
}

const ACCOUNT_ROLE = {
    USER: 1,
    COMPANY:2,
    ADMIN: 3,
}

const LOGIN_TYPE = {
}

const SOCIAL_ACCOUNT_TYPE = {
	FACEBOOK: 1,
	GOOGLE: 2
}

const DB_MODEL_REF = {
        WHITELIST   : "whitelist",
	USER        : "User",
	ACCOUNT :'Account',
        USERLOG     : "Userlog",
        MONGODBJOB  : "Mongodbcronjob",
		CUSTOMER_ACCOUNT : 'CustomerAccount',
		TRANSACTION:'transaction',
		ONLINE_SERVICES:'onlineServices',
		 BENEFICIARY :   "beneficiary",
		 SERVICE : 'service',
		 SHARES :'share',
		 TRANSACTIONVIEW:'transactionView',
}

const TRANSACTION_TYPE = {
	REFERRAL: 1
}

const NOTIFICATION_TYPE = {
	CHAT: 1,
	
}

const NOTIFICATION_TITLE = {
	CHAT: "New Message",	
}

const DEVICE_TYPE = {
	ANDROID: 1,
	IOS: 2,
        WEB:3
}

const REQUEST_STATUS = {
	SENT: 1,
	RECEIVED: 2,
	ACCEPTED: 3,
	DECLINED: 4,
	CANCEL: 5
}

const REQUEST_API_STATUS = {
	SENT: 'sent',
	ACCEPT: 'accept',
	DECLINE: 'decline',
	CANCEL: 'cancel',
	REMOVE: 'remove'
}

const ADMIN_ACCESS = {
	SENT: 'sent',
	ACCEPT: 'accept',
	DECLINE: 'decline',
	CANCEL: 'cancel',
	REMOVE: 'remove'
}


const MESSAGES = {
        KEY_CANT_EMPTY          : "{{key}} cannot be empty",
	INTERNAL_SERVER_ERROR   : "Please try after some time.",
        EMAIL_ALREADY_EXIST     : "Email already exist",
	INVALID_EMAIL           : "Please fill valid email address.",
	INVALID_PASSWORD        : "Password needs to have at least one lower case, one uppercase, one number, one special character, and must be at least 8 characters but no more than 35.",
	VALIDATION_ERROR        : "Validation error.",
	UNAUTHORIZED_ACCESS     : "Unauthorized access.",
	INVALID_PHONE           : "Please fill valid phone number.",
	BLOCKED_PHONE           : "Action blocked for illegal use of services.",
	STRIPE_ERROR            : "Stripe invalid request error.",
	TOKEN_EXPIRED           : "Token link has been expired.",
	SESSION_EXPIRED         : "Your session has expired due to login in another device.",
        INCORRECT_PASS          : "Invalid passoword",
        USER_NOT_REGISTERED     : "User has been not registered",
        OLD_PASSWORD_MISMATCH:	"Old password is not correct.",
		INVALID_MOBILE_NO:	"Please fill valid mobile number.",
		MOBILENO_ALREADY_EXIST : "Your Entered Mobile number is already exists",
		OTP_EXPIRED : 'OTP expired',
		KEY_MUST_BE_NUMBER: 'account number must be number',
		INCORRECT_MPIN :'MPIN is incorrect',
		MOBILENO_NOT_REGISTERED :"Your entered mobile number is not registered",
		ACCOUNTTYPE_ALREADY_EXIST :'account type is already exists ',
		ACCEPT_TERMS_CONDITIONS:' Please Accept terms and condition first ',
		MPIN_LENGTH : 'MPIN must be 4 digit',
		UNAUTHORIZED_ACCESS : 'Access denied',
		NOT_SUFFICIENT_BALANCE : 'Not sufficient balance',
		ACCOUNTNUMBER_NOT_EXISTS : 'Sender account number does not exists',
		RECEIVER_ACCOUNTNUMBER_NOT_EXISTS : "Receiver account number does not exists",
		MEMBERSHIPID_NOT_EXISTS :'Entered membershipId is not exists',
		MOBILENO_NOT_EXISTS:'Entered mobile no is not exists',
		ACCOUNTNO_NOT_EXISTS :'Entered account number is not exists',
		EMPLOYEE_NOT_ACTIVE :'Employee is not active',
		INCORRECT_PASSWORD :'Incorrect password',
		MEMBERID_ALREADY_EXIST : 'MemberId already exists',
		EMAIL_NOT_EXISTS : 'Entered email is not exists',
		UNABLE_TO_SENT_OTP : 'Unable to sent OTP',
		ACCOUNT_ID_NOT_EXISTS : 'Entered Account id not exists',
		INVALID_OTP :'Entered otp is invalid',
		KEY_MUST_BE_STRING :'key must be a string ',
		NOT_INITIATED :'Transaction not initiated',
		FAILED_TO_CHANGE_STATUS :'Failed to change status',
		FAILED_TO_DEBIT :'Failed to debit',
		FAILED_TO_CREDIT :'Failed to credit',
		FAILED_TO_MOVE_TRANSACTION :'Failed to move transaction',
		SERVICE_ALREADY_EXISTS :'Service already exists with similar name',
		KEY_SHOULD_BE_INTEGER :'key should be integer',
		SAME_CUSTOMER_ALREADY_EXISTS_ACCOUNTTYPE :'Same customer already exists with same account type',
		NO_DATA_FOUND :'No data found',
		REGISTRATION_NOT_EXISTS :'Registration not exists please check mobile no and membership id',
		ENTERED_NAME_NOT_EXISTS :'Entered name not exists',
		ACCOUNTNUMBER_ALREADY_EXISTS :'Account number already exists',
}

const EMAIL= {
        SUBJECT: {
            VERIFY_EMAIL: 'Mobcoder Contacts : Confirm Email Address',
            FORGOT_PWD_EMAIL: 'Mobcoder Contacts : Reset Password Request',
        },	
    }

// ========================== Export Module Start ==========================
module.exports = Object.freeze({
	STATUS_CODE         : STATUS_CODE,
	ACCOUNT_ROLE        : ACCOUNT_ROLE,
	LOGIN_TYPE          : LOGIN_TYPE,
	SOCIAL_ACCOUNT_TYPE : SOCIAL_ACCOUNT_TYPE,
	DB_MODEL_REF        : DB_MODEL_REF,
	TRANSACTION_TYPE    : TRANSACTION_TYPE,
	MESSAGES            : MESSAGES,
	NOTIFICATION_TYPE   : NOTIFICATION_TYPE,
	NOTIFICATION_TITLE  : NOTIFICATION_TITLE,
	DEVICE_TYPE         : DEVICE_TYPE,
	REQUEST_STATUS      : REQUEST_STATUS,
	REQUEST_API_STATUS  : REQUEST_API_STATUS,
        EMAIL               : EMAIL,
        ADMIN_ACCESS        : ADMIN_ACCESS
});
// ========================== Export Module End ============================