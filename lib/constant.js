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
		 NOTIFICATION : 'notification',
		 GRIEVANCE : 'grievance',
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
        INCORRECT_PASS          : "Invalid password",
        USER_NOT_REGISTERED     : "User is not registered",
        OLD_PASSWORD_MISMATCH:	"Old password does not match.",
		INVALID_MOBILE_NO:	"Please fill valid mobile number.",
		MOBILENO_ALREADY_EXIST : "Entered mobile number already exists",
		OTP_EXPIRED : 'OTP expired',
		KEY_MUST_BE_NUMBER: 'Account number must be a number',
		INCORRECT_MPIN :'MPin is incorrect',
		MOBILENO_NOT_REGISTERED :"Your entered mobile number is not registered",
		ACCOUNTTYPE_ALREADY_EXIST :'Account type already exists ',
		ACCEPT_TERMS_CONDITIONS:' Please accept terms and conditions first ',
		MPIN_LENGTH : 'MPin must be of 4 digit',
		UNAUTHORIZED_ACCESS : 'Access denied',
		NOT_SUFFICIENT_BALANCE : 'Not sufficient balance',
		ACCOUNTNUMBER_NOT_EXISTS : 'Sender account number does not exists',
		RECEIVER_ACCOUNTNUMBER_NOT_EXISTS : "Receiver account number does not exists",
		MEMBERSHIPID_NOT_EXISTS :'Entered membershipId does not exists',
		MOBILENO_NOT_EXISTS:'Entered mobile no does not exists',
		ACCOUNTNO_NOT_EXISTS :"Entered account number does not exist",
		EMPLOYEE_NOT_ACTIVE :'Employee is not active',
		INCORRECT_PASSWORD :'Incorrect password',
		MEMBERID_ALREADY_EXIST : 'MemberId already exists',
		EMAIL_NOT_EXISTS : 'Entered email does not exists',
		UNABLE_TO_SENT_OTP : 'Unable to sent OTP',
		ACCOUNT_ID_NOT_EXISTS : 'Entered Account id does not exists',
		INVALID_OTP :'Entered OTP is invalid',
		KEY_MUST_BE_STRING :'Key must be a string ',
		NOT_INITIATED :'Transaction not initiated',
		FAILED_TO_CHANGE_STATUS :'Failed to change status',
		FAILED_TO_DEBIT :'Failed to debit',
		FAILED_TO_CREDIT :'Failed to credit',
		FAILED_TO_MOVE_TRANSACTION :'Failed to move transaction',
		SERVICE_ALREADY_EXISTS :'Service already exists with similar name',
		KEY_SHOULD_BE_INTEGER :'Key should be an integer',
		SAME_CUSTOMER_ALREADY_EXISTS_ACCOUNTTYPE :'Same customer already exists with same account type',
		NO_DATA_FOUND :'No data found',
		REGISTRATION_NOT_EXISTS :'Registration not exists please check mobile no and membership id',
		ENTERED_NAME_NOT_EXISTS :'Entered name does not exists',
		ACCOUNTNUMBER_ALREADY_EXISTS :'Account number already exists',
		INTEREST_TYPE_NOT_EXISTS :'Interest type does not exists',
		USER_ALREADY_EXIST :'User already exists , please try to login with your mobile no and mPin',
		INACTIVE_USER :'User is inactive',
		EMAIL_NOT_REGISTERED : "User is not registered with us",
		EMAIL_REGISTERED_AS_USER : "Email is registered as user",
		KEY_SHOULD_BE_POSITIVE_INTEGER :'Key should be a positive integer',
		INVALID_ZIP_CODE :'Please fill valid zip code',
		ADDRESS_TYPE_NOT_EXISTS :"ADDRESS TYPE NOT EXISTS",
		USER_AND_ADDRESS_TYPE_NOT_FOUND :"address type not found for this user",
		SERVICE_ID_NOT_EXISTS :'Service id does not exists',
		MOBILENO_ALREADY_EXIST :'Mobile number already exists',
		ONLINE_SERVICE_NOT_EDITABLE : "You are not allowed to perform the current action this time ",
		INVALID_ACCOUNT_NUMBER : "Please fill valid account number length should be 9 to 18 digits",
		INVALID_IFSC_CODE : "Please fill valid IFSC code length should be 11 digits",
		INVALID_IFSC_CODE_CHAR : "Please fill valid IFSC code  should be alphanumeric first 4 characters should be alphabets and last 6 characters should be numeric",
		SAME_OTHER_BANK_ACCOUNT : "same  details already exists in your profile",
		UNABLE_TO_UPDATE_STATUS : "Unable to update status",
		TRANSACTION_NOT_IN_PENDING_STATUS : "Transaction not in pending status",
		SET_TXN_LIMIT_EXCEEDED : "Set transaction limit exceeded",
		REACHED_MAXIMUM_LIMIT : "Reached maximum allotted limit",
		NOT_ABLE_TO_SEND_MAIL :"some error happen while sending mail to customer , please check your sendGrid key also"
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