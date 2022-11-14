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
const apputils = require('../../../appUtils')

//========================== Load Modules End ==============================================

function createUser(params) {
    if(params.password){
        params.password = apputils.createHashSHA256(params.password)
    }
    if(params.userType){
        params.userType = parseInt(params.UserType)
    }
    // console.log(params)
    var user = new userModel(params);
    // console.log(user)
    return userDao.save(user)
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

function isCustomerIdExist(params){
    let query = {};
    console.log(params)
    query._id = apputils.objectIdConvert(params.customerId)  ;
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

function getByMobileAndMPin(params) {
    let query = {};
    query.mobileNo = params.mobileNo;
    query.mPIN = params.mPIN;
    return userDao.findOne(query).then(function (result) {
        if (result) {
            return result;
        } else {
            return false;
        }
    });
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
function getUserByID(params) {
    let query = {};
    if (params) {
        query._id = apputils.objectIdConvert(params)   
      }  
    return userDao.findOne(query)
}


function editUser(params) {
    let query = {};
    let update = {};
    let option = {};
    option.new = true;
    if(params.customerId){
        query._id = apputils.objectIdConvert(params.customerId)
    }
   if(params.name){
       update.name = params.name;
   }
    if(params.email){

    update.email = params.email;
    }
    if(params.mobileNo){

    update.mobileNo = params.mobileNo;
    }
    if(params.UserType){
        update.userType = params.UserType;
    }
    if(params.membershipId){
        update.membershipId = params.membershipId;
    }
    if(params.status){
        update.status = params.status;
    }
    // update.updated = new Date();
    return userDao.findOneAndUpdate(query, update, option).then((res)=>{
        if(res){
            return res;
        }else{
            return false;
        }
    })
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
        query.mobileNo = parseInt(params.mobileNo);
    }
        return userDao.findOne(query)
        .then(function (result) {
            console.log(result ,">>")
            if (result) {
                return true;
            }
            else {
                return false;
            }
        })
}
function isMembershipIdExists(params){
    let query = {};
    if(params.membershipId){
        query.membershipId = params.membershipId;
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
function isAccountNumberExists(params){
    let query = {};
    if(params.accountNumber){
        query.accountNumber = params.accountNumber;
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

function usersList(params){
    let aggPipe = [];
    let query = {};
  
    if (params.status) {
      query.status = parseInt(params.status);
    }
    aggPipe.push({ $match: query });
    aggPipe.push({ $match: {isDelete : 0 } });
  
    aggPipe.push({
      $sort: {
        createdAt: -1,
      },
    });

    aggPipe.push({
      $project: {
        _id: 1,
        name:1,
        mobileNo : 1,
        email : 1,
        membershipId : 1,
        userType : 1,
        status : 1,
        isDelete : 1,
        profileImage: 1,
        createdAt: 1
      },
    });

  //check if string contains number
    if (params.search && params.search.match(/\d+/g)) {
        aggPipe.push({
            $match: {
                $or: [
                    { mobileNo: { $regex: ".*" + params.search + ".*", $options: "i" } },
                    { membershipId: { $regex: ".*" + params.search + ".*", $options: "i" } },
                ],
            },
        });
    } 

    if(params.search && !params.search.match(/\d+/g)) {
        aggPipe.push({
            $match: {
                $or: [
                    { name: { $regex: ".*" + params.search + ".*", $options: "i" } }
                ],
            },
        });
    }

    
    let sortType = -1;
  
    if (params.sortType == 1) {
      sortType = 1;
    } else {
      sortType = -1;
    }
    let sort = {};
   
  
    if (params.sortField == "name") {
      sort.name = sortType;
    }
    if (params.sortField == "createdAt") {
      sort.createdAt = sortType;
    }
    
    aggPipe.push({ $sort: sort });
  
    let pageNo, count;
    if (params.pageNo && params.count) {
      count = parseInt(params.count);
      pageNo = parseInt(params.pageNo);
      aggPipe.push({ $skip: pageNo * count });
      aggPipe.push({ $limit: count });
    }
  
    return userDao.aggregate(aggPipe).then((res) => {
        if (res) {
            return res;
        } else {
            return false;
        }
        });
}


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

function softDeleteUser(params){
    let query = {};
    let update = {};
    let option = {};
    option.new = true;
    query._id = params.customerId;
    update.isDelete = 1;
    return userDao.findOneAndUpdate(query, update, option).then(function (result) {
        if (result) {
            return result;
        } else {
            return false;
        }
    })
}

function deleteUser(params){
//permanent delete

    let query = {};
    query._id = params.customerId;
    return userDao.deleteOne(query).then(function (result) {
        if (result) {
            return result;
        } else {
            return false;
        }
    })

}

function isEmailIdExist(params) {
    let query = {};
    query.email = params.email;
    // query.email = { $ne: params.userId };
    return userDao.findOne(query).then(function (result) {
     
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
    editProfileImage,
    isMembershipIdExists,
    isAccountNumberExists,
    getUserByID,
    getByMobileAndMPin,
    isCustomerIdExist,
    editUser,
    usersList,
    softDeleteUser,
    deleteUser,
    isEmailIdExist
};

//========================== Export Module End ===============================
