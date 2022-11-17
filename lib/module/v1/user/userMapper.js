/**
 * This file will have request and response object mappings.
 */
var _ = require("lodash");
const contstants = require("../../../constant");
const config = require("../../../config");

function loginMapping(params) {
 
  var respObj = {
    message: "Successfully Login",
    UserDetails: {
      userId: params._id,
      name: params.name,
      mobileNo: params.mobileNo,
      email: params.email,
      membershipId: params.membershipId,
      accountNumber: params.accountNumber,
      status: params.status,
      created: params.created,
    },
  };
  return respObj;
}

function registerMapping(params) {
  console.log(params, "final");
  let userObj = params.user;
  var respObj = {
    message: "Registered SuccessFully",
    accessToken: params.redisSession,
    UserDetails: {
      userId: userObj._id,
      name: userObj.name,
      mobileNo: userObj.mobileNo,
      email: userObj.email,
      membershipId: userObj.membershipId,
      status: userObj.status,
      created: userObj.created,
    },
    userType: params.user.userType,
  };
  console.log(respObj)
  return respObj;
}

function otpSentMapping() {
  var respObj = {
    message: "OTP sent SuccessFully",
  };

  return respObj;
}
function mPinCreatedMapping(param){
  console.log(param)
  var respObj = {
    message: "MPIN created successfully",
    UserDetails :{
      userId : param._id,
      name : param.name,
      membershipId : param.membershipId,
      userType : param.userType
    }

  };

  return respObj;
}

function otpMatchSuccessfullyMapping(params , redisSession){
  var respObj = {
    message: "OTP match successfully",
    accessToken:redisSession,
    UserDetails :{
      mobileNo : params.params.mobileNo,
      userId : params.userId
    }
  };

  return respObj;
}

function createMapping(params) {
  let userInfo = params.user;
  if (userInfo.password) {
    delete userInfo.password;
  }
  if (userInfo.deviceToken) {
    delete userInfo.deviceToken;
  }
  if (userInfo.deviceID) {
    delete userInfo.deviceID;
  }
  if (userInfo.deviceTypeId) {
    delete userInfo.deviceTypeId;
  }
  if (userInfo.status) {
    delete userInfo.status;
  }
  if (userInfo.updated) {
    delete userInfo.updated;
  }
  var respObj = {
    message: "User Created Successfully",
    mediaPath: config.cfg.s3.mediaPath,
    result: userInfo,
  };
  return respObj;
}

function editMapping(params) {
  let userInfo = params.user;
  if (userInfo.password) {
    delete userInfo.password;
  }
  if (userInfo.deviceToken) {
    delete userInfo.deviceToken;
  }
  if (userInfo.deviceID) {
    delete userInfo.deviceID;
  }
  if (userInfo.deviceTypeId) {
    delete userInfo.deviceTypeId;
  }
  if (userInfo.status) {
    delete userInfo.status;
  }
  if (userInfo.updated) {
    delete userInfo.updated;
  }

  var respObj = {
    message: "User Updated Successfully",
    mediaPath: config.cfg.s3.mediaPath,
    result: userInfo,
  };
  return respObj;
}

function detailsMapping(params) {
  let userInfo = params.user;
  if (userInfo.password) {
    delete userInfo.password;
  }
  if (userInfo.deviceToken) {
    delete userInfo.deviceToken;
  }
  if (userInfo.deviceID) {
    delete userInfo.deviceID;
  }
  if (userInfo.deviceTypeId) {
    delete userInfo.deviceTypeId;
  }
  if (userInfo.status) {
    delete userInfo.status;
  }
  if (userInfo.updated) {
    delete userInfo.updated;
  }

  var respObj = {
    message: "User Details",
    mediaPath: config.cfg.s3.mediaPath,
    result: userInfo,
  };
  return respObj;
}

function forgetMapper() {
  var respObj = {
    message: "Email has been send successfully",
  };
  return respObj;
}

function resetMapper() {
  var respObj = {
    message: "Password has been reset successfully",
  };
  return respObj;
}

function contactFileMapper(params) {
  let userInfo = params.user;
  if (userInfo.password) {
    delete userInfo.password;
  }
  if (userInfo.deviceToken) {
    delete userInfo.deviceToken;
  }
  if (userInfo.deviceID) {
    delete userInfo.deviceID;
  }
  if (userInfo.deviceTypeId) {
    delete userInfo.deviceTypeId;
  }
  if (userInfo.status) {
    delete userInfo.status;
  }
  if (userInfo.updated) {
    delete userInfo.updated;
  }

  var respObj = {
    message: "User Details",
    filePath: params.filePath,
    mediaPath: config.cfg.s3.mediaPath,
    result: userInfo,
  };
  return respObj;
}

function changePasswordMapper() {
  var respObj = {
    message: "Password has been changed successfully",
  };
  return respObj;
}

function userListMapper(params) {
  var respObj = {
    message: "User list",
    mediaPath: config.cfg.s3.mediaPath,
    totalCount: params.totalCount,
    result: params.result,
  };
  return respObj;
}

function statusChangeMapper(params) {
  let message;
  if (params.status == 1) {
    message = "User has been activated successfully";
  } else {
    message = "User has been inactivated successfully";
  }
  var respObj = {
    message: message,
  };
  return respObj;
}

function editUserMapping(params) {

  var respObj = {
    message: "User Updated Successfully",
    result: {
      userId: params._id,
      name: params.name,
      mobileNo: params.mobileNo,
      email: params.email,
      membershipId: params.membershipId,
      updatedAt : params.updatedAt,
      userType: params.userType,
    },
  };
  return respObj;
}

function editProfileImageMapping(params){
  var respObj = {
    message: "Profile image updated successfully",
    result: params
  };
  return respObj;
}

function addUserMapping(params){
  var respObj = {
    message: "user added successfully",
    UserDetails: params
  };
  return respObj;
}

function userListMapping(params){
  var respObj = {
    message: "user list",
    result: params
  };
  return respObj;
}

function deleteUserMapping(params){
  var respObj = {
    message: "Deleted Successfully",
    result: params
  };
  return respObj;
}

function loginAsAdminMapping(params){
 
  var respObj = {
    message: "Login Successfully",
    accessToken:params.redisSession,
    userDetails: {
      customerId : params.user._id,
      name : params.user.name,
      email : params.user.email,
      mobileNo: params.usermobileNo,
      membershipId : params.user.membershipId,
      userType : params.user.userType,
      createdAt : params.user.createdAt,
      updatedAt : params.user.updatedAt
    }
  };
  
  return respObj;
}

function logOutMapping(params){
  console.log(params ,"Vv")
  var respObj = {
    message: "Logout Successfully",
    result: params
  };
  return respObj;
}

function validateForgetPassOtpMapping(params ,redisSession ){
  var respObj = {
    message: "Otp verified successfully",
    accessToken : redisSession.token,
    result: params
  };
  return respObj;
}

function resetPasswordMapping(params){
  var respObj = {
    message: "Password reset successfully",
    result: params
  };
  return respObj;
}

function totalNoOfMapping(params , noOF){
  var respObj = {
    message: "Total no of "+noOF,
    result: params
  };
  return respObj;
}


module.exports = {
  registerMapping,
  loginMapping,
  createMapping,
  editMapping,
  detailsMapping,
  forgetMapper,
  resetMapper,
  contactFileMapper,
  changePasswordMapper,
  userListMapper,
  statusChangeMapper,
  otpSentMapping,
  mPinCreatedMapping,
  otpMatchSuccessfullyMapping,
  editProfileImageMapping,
  addUserMapping,
  editUserMapping,
  userListMapping,
  deleteUserMapping,
  loginAsAdminMapping,
  logOutMapping,
  validateForgetPassOtpMapping,
  resetPasswordMapping,
  totalNoOfMapping,
  
};
