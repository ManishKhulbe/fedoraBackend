"use strict";
//========================== Load Modules Start =======================

//========================== Load internal modules ====================
var mongoose = require("mongoose");
var promise = require("bluebird");

var _ = require("lodash");
//========================== Load internal modules ====================
const userModel = require('./userModel');


// init user dao
let BaseDao = require('../../../dao/baseDao');
const userDao = new BaseDao(userModel);


//========================== Load Modules End ==============================================

function createUser(params) {
    var user = new userModel(params);
    return userDao.save(user);
}
async function register(params){
    var user = new userModel(params);
    console.log(user)
    return userDao.save(user).then(function (result) {
        if (result) {
          return result;
        } else {
          return false;
        }
      });
}

function updateUser(query,update) {
    update.updated = new Date();   
    let option = {};
    option.new = true;
    return userDao.findOneAndUpdate(query, update, option);
}
function isUserIdExist(params){
    let query = {};
    query._id = params.userId;
    return userDao.findOne(query).then(function (result) {
      if (result) {
        return result;
      } else {
        return false;
      }
    });

}
function createMpin(param){
    let query ={}
    let option = {};
    let update = {};
    option.new = true;
    query._id= param.userId
    update.mPIN=  param.mPin
    return userDao.findOneAndUpdate(query, update, option);
}

function update(query,update) {
    update.updated = new Date();   
    let option = {};
    option.new = true;
    return userDao.findOneAndUpdate(query, update, option);
}

function getByKey(query) {
    return userDao.findOne(query)
}

function isEmailExist(params) {
    let query = {};
    if(params.userId){
        query._id = {$ne:params.userId};
    }
    if(params.email){
        query.email = params.email;
    
        return userDao.findOne(query)
        .then(function (result) {
            if (result) {
                return true;
            }
            else {
                return false;
            }
        })
    }else{
        return _PromiseFunction;
    }
}

function isMobileNumberExists(params){
    let query = {};
    if(params.mobileNo){
        query.mobileNo = params.mobileNo;
    }
        return userDao.findOne(query)
        .then(function (result) {
            if (result) {
                return true;
            }
            else {
                return false;
            }
        })
}
function isMobileNumberExist(params){
    let query = {};
    if(params.mobileNo){
        query.mobileNo = params.mobileNo;
    }
        return userDao.findOne(query)
        .then(function (result) {
            if (result) {
                return result;
            }
            else {
                return false;
            }
        })
}
function emailCheck(params) {
    let query = {};
    if(params.userId){
        query._id = {$ne:params.userId};
    }else{
        if(params.user.userType===1){
            if(params.user.userId){
                query._id = {$ne:params.user.userId};
            }
        }
    }
    if(params.email){
        query.email = params.email;
    
        return userDao.findOne(query)
        .then(function (result) {
            if (result) {
                return true;
            }
            else {
                return false;
            }
        })
    }else{
        return _PromiseFunction;
    }
}


const _PromiseFunction = new Promise((resolve, reject) => {
   resolve(true);
});


function userList(params) {
    let query = {};
    if (params.userType) {
        query.userType=params.userType
    }
    if (params.status) {
        query.status=params.status
    }
    if (params.companyId) {
        query.companyId=params.companyId
    }
    if (params.search) {
        query.name= { $regex: params.search,$options : "i"}
    }
    let sort={};
    if(params.sortField&&params.sortType&&params.sortType!==""){
        sort[params.sortField]=params.sortType
    }else{
        sort["employeeId"]=1
    }
    let fields={
        _id:1,
        name:1,
        profileImage:1, 
        email: 1,
        userType:1,
        gender: 1,
        dob:1,
        designation:1,
        companyName:1,
        employeeId:1,
        workEmail: 1,
        phoneNo: 1,
        created:1,
        status:1
    }
    if (params.pageNo) {
        let pageNo = parseInt(params.pageNo) - 1;
        let limit = parseInt(params.limit);
        return userModel.find(query,fields).lean().sort(sort).skip(pageNo * limit).limit(limit);
    }
    else {
        return userModel.find(query,fields).lean().sort(sort)

    }
}


function count(params) {
    let query = {};
    if (params.userType) {
        query.userType=params.userType
    }
    if (params.status) {
        query.status=params.status
    }
    if (params.companyId) {
        query.companyId=params.companyId
    }
    if (params.search) {
        query["$or"] = [{ "name": { $regex: params.search } }]
    }
    return userDao.count(query)
}

function editProfileImage(params) {
    let query = {};
    let update = {};
    let option = {};
    option.new = true;
    query._id = params.userId;
    update.profileImage = params.location;
    return userDao.findOneAndUpdate(query, update, option).then(function (result) {
        if (result) {
            return result;
        } else {
            return false;
        }
    })
}
//========================== Export Module Start ==============================

module.exports = {
    createUser,
    updateUser,
    getByKey,
    isEmailExist,
    userList,
    update,
    emailCheck,
    count,
    isMobileNumberExists,
    register,
    createMpin,
    isUserIdExist,
    isMobileNumberExist,
    editProfileImage
};

//========================== Export Module End ===============================
