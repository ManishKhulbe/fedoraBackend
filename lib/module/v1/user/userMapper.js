/**
 * This file will have request and response object mappings.
 */
var _ = require("lodash");
const contstants = require("../../../constant");
const config = require("../../../config");

function loginMapping(params) {
//  console.log(params ,"bbb")
// let date = new Date(params.updatedAt);
// let year = date.getFullYear();
// let month = date.getMonth() + 1;
// let dt = date.getDate();
// let hours = date.getHours();
// let minutes = date.getMinutes();


// if(hours > 12){
//   hours -= 12
// }
// lastAccessed : `${dt}-${month}-${year} AT ${hours}:${minutes}`,

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
      created: params.createdAt?params.createdAt : 0,
  
      updatedAt : params.updatedAt?params.updatedAt:0

    },
  };
  return respObj;
}

function firstLoginMapping( params){
console.log(params ,"bbbbdbbbbbbbb")
  var respObj = {
    message: "user first login",
    accessToken : params.redisSession,
    UserDetails: {
      userId: params.user._id,
      name: params.user.name,
      mobileNo: params.user.mobileNo,
      email: params.user.email,
      membershipId: params.user.membershipId,
      accountNumber: params.user.accountNumber,
      status: params.user.status,
      created: params.user.created,
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
function deviceTokenUpdateMapper(params){
  var respObj = {
    message: "Device token Updated SuccessFully",
    customerId : params._id,
    deviceToken : params.deviceToken
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

function otpMatchSuccessfullyMapping(params){
  console.log(params)
  var respObj = {
    message: "OTP match successfully",
    accessToken:params.redisSession,
    UserDetails :{
      name : params.user.name,
      membershipId : params.user.membershipId,
      userType : params.user.userType,
      profileImage: params.user.profileImage,
      isRegister : params.user.isRegister,
      mobileNo : params.user.mobileNo,
      status : params.user.status,
      userId : params.user._id,
      created : params.user.created,
      email : params.user.email,
    },
    userType : params.user.userType,
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
      address : params.address,
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

function userListMapping(params,totalUserCount , totalNoOfActiveUser , totalNoOfInActiveUser){
  var respObj = {
    message: "user list",
    result: params[0].pipelineResults,
    dataCount : params[0]?.totalCount?.dataCount,
    totalUserCount,
    totalNoOfActiveUser,
    totalNoOfInActiveUser
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

function sharePriceMapping(params){
  var respObj = {
    message: "added success",
    result: params
  };
  return respObj;
}

function editSharePriceMapping(params){
  var respObj = {
    message: "edit success",
    result: params
  };
  return respObj;
}
function getSharePriceMapping(params){
  var respObj = {
    message: "fetched success",
    result: params
  };
  return respObj;
}

function getAdminDashBoardMapping(totalNoOfUser,totalNoOfAccount,totalNoOfAccountByType,pendingOnlineServices ,pendingOnlineServicesByType){
  
  var respObj = {
    message: "fetched successfully",
    totalNoOfUser,totalNoOfAccount,totalNoOfAccountByType,pendingOnlineServices,pendingOnlineServicesByType
  };
  return respObj;
}

function getUserDashBoardMapping(totalDeposit , totalLoan , params){

  var respObj = {
    message: "fetched successfully",
    totalDeposit : totalDeposit?totalDeposit[0].count: 0 , 
    totalLoan : totalLoan?totalLoan[0].count: 0,
    params
  };
  return respObj;
}

function getUserDetailsMapping(params ,accountDetails){
  // let date = new Date(params.updatedAt);
  // let year = date.getFullYear();
  // let month = date.getMonth() + 1;
  // let dt = date.getDate();
  // let hours = date.getHours();
  // let minutes = date.getMinutes();


  // if(hours > 12){
  //   hours -= 12
  // }
  // lastAccessed : `${dt}-${month}-${year} AT ${hours}:${minutes}`
  let  respObj = {
  
    message: "fetched successfully",
    userDetails : params,
    accountDetails

  };
  return respObj;
}

function getUserBeneficiaryMapping(params){
  var respObj = {
    message: "fetched successfully",
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
  sharePriceMapping,
  editSharePriceMapping,
  getSharePriceMapping,
  getAdminDashBoardMapping,
  firstLoginMapping,
  getUserDetailsMapping,
  getUserBeneficiaryMapping,
  deviceTokenUpdateMapper,
  getUserDashBoardMapping
};
