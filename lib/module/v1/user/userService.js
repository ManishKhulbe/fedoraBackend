"use strict";

//========================== Load Modules Start =======================
const appUtils      = require("../../../appUtils");
//========================== Load internal modules ====================
const userDao = require('./userDao');
const customerAccountDao = require('../customerAccount/customerAccountDao')
const customException = require("../../../customException");
const accountDao = require('../account/accountDao')
const onlineServiceDao = require('../onlineServices/onlineServiceDao')
const shareDao = require('../fedoraShares/sharesDao')
//========================== Load Modules End ==============================================

function login(params) {
console.log(params)
    let query = {};
    query.mobileNo = params.mobileNo;
    query.mPIN = appUtils.createHashSHA256(params.mPin);
    console.log(query)
    return userDao.getByMobileAndMPin(query)
    .then(function (result) {
        if (result) {
            return result;
        }else{
            return false;
        }
    })
}

function createAdmin(params) {
    console.log(params)
    return userDao.getByKey({email:params.email})
    .then(function (result) {
        if (!result) {
            
            return userDao.createUser(params);
        }else {
            return result;
        }
    })
}

function updateDeviceInfo(params){
    return userDao.updateDeviceInfo(params)
}
function createUser(params) {
    return userDao.createUser(params)
}
function register(params){
    return userDao.register(params)
}
function createMpin(params){
    return userDao.createMpin(params)
}
function isEmailExist(params) {
    return userDao.isEmailExist(params)
}
function isMobileNumberExists(params){
    return userDao.isMobileNumberExists(params)
}
function isMobileNumberExist(params){
    return userDao.isMobileNumberExist(params)
}
function isUserIdExist(params){
    return userDao.isUserIdExist(params)
}
function updateUser(params) {
    let update={};
    let query={_id:params.user.userId};
    if(params.name){
        update.name=params.name;
    }
    if(params.email){
        update.email=params.email;
    }
    if(params.password){
        update.password=params.password;
    }
    if(params.employeeId){
        update.employeeId=params.employeeId;
    }
    if(params.userType){
        update.userType=params.userType;
    }
    if(params.gender){
        update.gender=params.gender;
    }
    if(params.dob){
        update.dob=params.dob;
    }
    if(params.designation){
        update.designation=params.designation;
    }
    if(params.companyName){
        update.companyName=params.companyName;
    }
    if(params.profileImage){
        update.profileImage=params.profileImage;
    }
    if(params.workEmail){
        update.workEmail=params.workEmail;
    }
    if(params.skype){
        update.skype=params.skype;
    }
    if(params.website){
        update.website=params.website;
    }
    if(params.googleMap){
        update.googleMap=params.googleMap;
    }
    update.phoneNo=params.phoneNo;
    update.aboutUs=params.aboutUs;
    update.instagram=params.instagram;
    update.facebook=params.facebook;
    update.linkedin=params.linkedin;
    update.twitter=params.twitter;
    update.whatsApp=params.whatsApp;
    update.hangouts=params.hangouts;
    update.youtube=params.youtube;
    update.snapchat=params.snapchat;
    update.tiktok=params.tiktok;
    update.pinterest=params.pinterest;
    update.github=params.github;
    update.npm=params.npm;
    update.stackoverflow=params.stackoverflow;
    
    return userDao.updateUser(query,update)
}

function update(query,update) {
    return userDao.update(query,update)
}

function userList(params) {
    return userDao.userList(params)
}
function isAccountNumberExists(params){
  
    return customerAccountDao.isAccountNumberExists(params)
}
function getByKey (param) {
    return userDao.getByKey(param)
}

function emailCheck(params) {
    return userDao.emailCheck(params)
}

function count(params) {
    return userDao.count(params)
}
function editProfileImage(params) {
    return userDao.editProfileImage(params)
}
function addUser(params) {
    return userDao.createNewUser(params)
}
function isMembershipIdExists(params){
    return userDao.isMembershipIdExists(params)
}
function getUserByID(params){
    return userDao.getUserByID(params)
}
function isCustomerIdExist(params){
    return userDao.isCustomerIdExist(params)
}
function editUser(params) {
    return userDao.editUser(params)
}
function usersList(params){
    return userDao.usersList(params)
}
function deleteUser(params){
    if(params.isDeleted == 1){
        return userDao.softDeleteUser(params)
    }else{
        return userDao.deleteUser(params)
    }
}

function isEmailIdExist(params){
    return userDao.isEmailIdExist(params)
}

function loginAsAdmin(params , loginInfo) { 
    loginInfo.password = appUtils.createHashSHA256(loginInfo.password);

    return new Promise(function (resolve, reject) {
        if (params.password == loginInfo.password) {
            if (params.status == 2) { 
            
                throw customException.empNotActive();
            } else if (params.status == 1) {
                resolve (true);
            }
        } else {
            throw customException.incorrectPassword();
        }
    })
}

function resetPassword(params){
    return userDao.resetPassword(params)
}

function totalNoOfUsers(params){
    return userDao.totalNoOfUsers(params)
}
function totalNoOfAccounts(params){
    return accountDao.totalNoOfAccounts(params)
}
function totalNoOfAccountByType(params){
    return customerAccountDao.totalNoOfAccountByType(params)
}
function pendingOnlineServices(params){
    return onlineServiceDao.pendingOnlineServices(params)
}
function addSharePrice(params){
    return shareDao.addSharePrice(params)
}
function editSharePrice(params){
    return shareDao.editSharePrice(params)
}
function getSharePrice(params){
    return shareDao.getSharePrice(params)
}

//========================== Export Module Start ==============================

module.exports = {
    isMobileNumberExists,
    createAdmin,
    login,
    createUser,
    isEmailExist,
    updateUser,
    userList,
    getByKey,
    update,
    emailCheck,
    count,
    register,
    createMpin,
    isUserIdExist,
    isMobileNumberExist,
    editProfileImage,
    addUser,
    isMembershipIdExists,
    isAccountNumberExists,
    getUserByID,
    isCustomerIdExist,
    editUser,
    usersList,
    deleteUser,
    isEmailIdExist,
    loginAsAdmin,
    updateDeviceInfo,
    resetPassword,
    totalNoOfUsers,
    totalNoOfAccounts,
    totalNoOfAccountByType,
    pendingOnlineServices,
    addSharePrice,
    editSharePrice,
    getSharePrice

};

//========================== Export Module End ===============================
