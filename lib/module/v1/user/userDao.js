"use strict";
//========================== Load Modules Start =======================

//========================== Load internal modules ====================
var mongoose = require("mongoose");
var promise = require("bluebird");

var _ = require("lodash");
//========================== Load internal modules ====================
const userModel = require("./userModel");

// init user dao
let BaseDao = require("../../../dao/baseDao");
const userDao = new BaseDao(userModel);
const apputils = require("../../../appUtils");

//========================== Load Modules End ==============================================

function createUser(params) {
  // console.log(params)
  var user = new userModel(params);
  // console.log(user)
  return userDao.save(user);
}

function createNewUser(params) {
  // console.log(params);
  if (params.password) {
    params.password = apputils.createHashSHA256(params.password);
  }
  if (params.UserType) {
    params.userType = parseInt(params.UserType);
  }
if(params.membershipId){
  // console.log(params.membershipId)
  params.membershipId = params.membershipId.toUpperCase()
  // console.log(params.membershipId)
}

params.address = {
  addressLine1: params.addressLine1,
  addressLine2: params.addressLine2,
  city: params.city,
  state: params.state,
  country: params.country,
  zipCode: params.zipCode,
};

  var user = new userModel(params);
  console.log(user, "nn");
  return userDao.save(user).then((result) => {
    if (result) {
      return result;
    } else {
      return false;
    }
  });
}
async function register(params) {
  var user = new userModel(params);
  console.log(user);
  return userDao.save(user).then(function (result) {
    if (result) {
      return result;
    } else {
      return false;
    }
  });
}

function updateUser(query, update) {
  update.updated = new Date();
  let option = {};
  option.new = true;
  return userDao.findOneAndUpdate(query, update, option);
}
function isUserIdExist(params) {
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

function isCustomerIdExist(params) {
  let query = {};
  console.log(params);
  query._id = apputils.objectIdConvert(params.customerId);
  return userDao.findOne(query).then(function (result) {
    if (result) {
      return result;
    } else {
      return false;
    }
  });
}

function getUserDeviceToken(params){
  let query = {};
  // console.log(params);
  query._id = params
  return userDao.findOne(query).then(function (result) {
    console.log(result)
    if (result) {
      return result;
    } else {
      return false;
    }
  });
}
function createMpin(param) {
  let query = {};
  let option = {};
  let update = {};
  option.new = true;
  query._id = param.userId;
  update.mPIN = param.mPin;
  return userDao.findOneAndUpdate(query, update, option);
}

function getByMobileAndMPin(params) {
  let query = {};
  query.mobileNo = params.mobileNo;
  query.mPIN = params.mPIN;
  //updtae last login
  let update = {};
  update.lastLogin = new Date();
  return userDao.findOneAndUpdate(query, update).then(function (result) {
    if (result) {
      return result;
    } else {
      return false;
    }
  });
}

function update(query, update) {
  update.updated = new Date();
  let option = {};
  option.new = true;
  return userDao.findOneAndUpdate(query, update, option);
}

function getByKey(query) {
  return userDao.findOne(query);
}
function getUserByID(params) {
  let query = {};
  if (params) {
    query._id = apputils.objectIdConvert(params);
  }
  return userDao.findOneAndUpdate(query, { isRegister: 1 });
}

function editUser(params) {
 
  let query = {};
  let update = {};
  let option = {};
  option.new = true;
  if (params.customerId) {
    query._id = apputils.objectIdConvert(params.customerId);
  }
  if(params.addressType){
    query["address.addressType"] = parseInt(params.addressType);
  }
  if (params.name) {
    update.name = params.name;
  }
  if (params.email) {
    update.email = params.email;
  }
  if (params.mobileNo) {
    update.mobileNo = params.mobileNo;
  }
  if (params.UserType) {
    update.userType = params.UserType;
  }
  if (params.membershipId) {
    update.membershipId = params.membershipId;
  }
  if (params.status) {
    update.status = params.status;
  }
  if (params.allotedStocks) {
    update.allotedStocks = parseInt(params.allotedStocks);
  }
  
  if( params.addressType && params.addressLine1 && params.addressLine2 && params.city && params.state && params.country && params.zipCode){
    update.address  = {
      addressLine1: params.addressLine1,
      addressLine2: params.addressLine2,
      city: params.city,
      state: params.state,
      country: params.country,
      zipCode: params.zipCode,
      addressType : parseInt(params.addressType)
    };
  }
  console.log(query , update);
  // update.updated = new Date();
  return userDao.findOneAndUpdate(query, update, option).then((res) => {
    if (res) {
      return res;
    } else {
      return false;
    }
  });
}
function isEmailExist(params) {
  let query = {};
  if (params.userId) {
    query._id = { $ne: params.userId };
  }
  if (params.email) {
    query.email = params.email;

    return userDao.findOne(query).then(function (result) {
      if (result) {
        return true;
      } else {
        return false;
      }
    });
  } else {
    return _PromiseFunction;
  }
}

function isMobileNumberExists(params) {
  console.log(params, ":VVVCDFDf");
  let query = {};
  if (params.mobileNo) {
    query.mobileNo = params.mobileNo;
    query.userType = 2
  }
  if(params.UserType != 2){
    query.mobileNo = params.mobileNo;
    // or condition in user type
    query.userType = { $in: [1, 3 , 4 ,5 ]   }
  }
  return userDao.findOne(query).then(function (result) {
    console.log(result, ">>");
    if (result) {
      return true;
    } else {
      return false;
    }
  });
}
function isMembershipIdExists(params) {
  let query = {};
  if (params.membershipId) {
    query.membershipId = params.membershipId;
  }
  return userDao.findOne(query).then(function (result) {
    if (result) {
      console.log('hu', result)
      return result;
    } else {
      return false;
    }
  });
}
function isAccountNumberExists(params) {
  let query = {};
  if (params.accountNumber) {
    query.accountNumber = params.accountNumber;
  }
  return userDao.findOne(query).then(function (result) {
    if (result) {
      return result;
    } else {
      return false;
    }
  });
}
function isMobileNumberExist(params) {
  let query = {};
  if (params.mobileNo) {
    query.mobileNo = params.mobileNo;
  }
  let update = {};
  update.updateAt = new Date();
  return userDao.findOneAndUpdate(query, update).then(function (result) {
    if (result) {
      return result;
    } else {
      return false;
    }
  });
}
function emailCheck(params) {
  let query = {};
  if (params.userId) {
    query._id = { $ne: params.userId };
  } else {
    if (params.user.userType === 1) {
      if (params.user.userId) {
        query._id = { $ne: params.user.userId };
      }
    }
  }
  if (params.email) {
    query.email = params.email;

    return userDao.findOne(query).then(function (result) {
      if (result) {
        return true;
      } else {
        return false;
      }
    });
  } else {
    return _PromiseFunction;
  }
}

const _PromiseFunction = new Promise((resolve, reject) => {
  resolve(true);
});

function usersList(params) {
  let aggPipe = [];
  let query = {};

  if (params.status) {
    query.status = parseInt(params.status);
  }
  aggPipe.push({ $match: query });
  aggPipe.push({ $match: { isDelete: 0 } });

  aggPipe.push({
    $sort: {
      createdAt: -1,
    },
  });

  aggPipe.push({
    $project: {
      _id: 1,
      name: 1,
      mobileNo: 1,
      email: 1,
      membershipId: 1,
      userType: 1,
      status: 1,
      isDelete: 1,
      profileImage: 1,
      allotedStocks: 1,
      createdAt: 1,
      isRegister: 1,
      userType: 1,
      address : 1
    },
  });


  if(params.UserType){
  aggPipe.push({
    $match: {
      userType: parseInt(params.UserType),
    } 
  });
  }
  //check if string contains number
  if (params.search && params.search.match(/\d+/g)) {
    aggPipe.push({
      $match: {
        $or: [
          { mobileNo: { $regex: ".*" + params.search + ".*", $options: "i" } },
          {
            membershipId: {
              $regex: ".*" + params.search + ".*",
              $options: "i",
            },
          },
        ],
      },
    });
  }

  if (params.search && !params.search.match(/\d+/g)) {
    aggPipe.push({
      $match: {
        $or: [{ name: { $regex: ".*" + params.search + ".*", $options: "i" } }],
      },
    });
  }

  aggPipe.push({
    $addFields: {
      name: { $toUpper: "$name" },
    }
  })
  
  let sortType = -1;

  if (params.sortType == 1) {
    sortType = 1;
  } else {
    sortType = -1;
  }
  let sort = {};

  if (params.sortField == "name") {
    sort.name = sortType;
    aggPipe.push({ $sort: sort });
  }
  if (params.sortField == "createdAt") {
    sort.createdAt = sortType;
    aggPipe.push({ $sort: sort });
  }

  aggPipe.push({
    $addFields: {
      name: { $toUpper: "$name" },
    }
  })

  let pageNo, count;
  let nestedPipe = [];
  if (params.pageNo && params.count) {
    count = parseInt(params.count);
    pageNo = parseInt(params.pageNo);
    nestedPipe.push(
        {$skip: pageNo * count} 
      )
      nestedPipe.push(
         {$limit: count }
      )
  }


aggPipe.push({
  $facet :{
    totalCount :[
      {$count : "dataCount"}
    ],
    pipelineResults : nestedPipe
  }
})

aggPipe.push({
  $unwind: "$totalCount",
})


  return userDao.aggregate(aggPipe).then((res) => {
    console.log(res);
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
    query.userType = params.userType;
  }
  if (params.status) {
    query.status = params.status;
  }
  if (params.companyId) {
    query.companyId = params.companyId;
  }
  if (params.search) {
    query.name = { $regex: params.search, $options: "i" };
  }
  let sort = {};
  if (params.sortField && params.sortType && params.sortType !== "") {
    sort[params.sortField] = params.sortType;
  } else {
    sort["employeeId"] = 1;
  }
  let fields = {
    _id: 1,
    name: 1,
    profileImage: 1,
    email: 1,
    userType: 1,
    gender: 1,
    dob: 1,
    designation: 1,
    companyName: 1,
    employeeId: 1,
    workEmail: 1,
    phoneNo: 1,
    created: 1,
    status: 1,
  };
  if (params.pageNo) {
    let pageNo = parseInt(params.pageNo) - 1;
    let limit = parseInt(params.limit);
    return userModel
      .find(query, fields)
      .lean()
      .sort(sort)
      .skip(pageNo * limit)
      .limit(limit);
  } else {
    return userModel.find(query, fields).lean().sort(sort);
  }
}

function count(params) {
  let query = {};
  if (params.userType) {
    query.userType = params.userType;
  }
  if (params.status) {
    query.status = params.status;
  }
  if (params.companyId) {
    query.companyId = params.companyId;
  }
  if (params.search) {
    query["$or"] = [{ name: { $regex: params.search } }];
  }
  return userDao.count(query);
}

function editProfileImage(params) {
  let query = {};
  let update = {};
  let option = {};
  option.new = true;
  query._id = params.userId;
  update.profileImage = params.location;
  return userDao
    .findOneAndUpdate(query, update, option)
    .then(function (result) {
      if (result) {
        return result;
      } else {
        return false;
      }
    });
}

function softDeleteUser(params) {
  let query = {};
  let update = {};
  let option = {};
  option.new = true;
  query._id = params.customerId;
  update.isDelete = 1;
  return userDao
    .findOneAndUpdate(query, update, option)
    .then(function (result) {
      if (result) {
        return result;
      } else {
        return false;
      }
    });
}

function deleteBeneficiary(params) {
  //update beneficiary isDeleted to 1 in user collection
  let query = {};
  let update = {};
  let option = {};
  option.new = true;
  query._id = params.userId;
  update.$pull = {beneficiary : {_id : apputils.objectIdConvert(params.beneficiaryId) }};

  return userDao
    .findOneAndUpdate(query, update
      , option)
    .then(function (result) {
      console.log(result);
      if (result) {
        return result;
      } else {
        return false;
      }
    });
}
function deleteUser(params) {
  //permanent delete

  let query = {};
  query._id = params.customerId;
  return userDao.deleteOne(query).then(function (result) {
    if (result) {
      return result;
    } else {
      return false;
    }
  });
}

function updateDeviceInfo(params) {
  console.log(params, "VVVV");
  let query = {};
  if (params.email) {
    query.email = params.email;
  }
  if (params.userId) {
    query._id = params.userId;
  }
  let update = {};
  update.platform = params.platform;
  update.deviceToken = params.deviceToken;
  let option = {};
  option.new = true;
  console.log("update token ->", update);
  return userDao
    .findOneAndUpdate(query, update, option)
    .then(function (result) {
      console.log(result, "result");
      if (result) {
        return result;
      } else {
        return false;
      }
    });
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
  });
}

function resetPassword(params) {
  let query = {};
  let update = {};
  let option = {};
  option.new = true;
  query._id = params.userId;
  update.password = apputils.createHashSHA256(params.password);

  return userDao
    .findOneAndUpdate(query, update, option)
    .then(function (result) {
      console.log(result, "ggg");
      if (result) {
        return result;
      } else {
        return false;
      }
    });
}

function totalNoOfUsers(params) {
  return userDao.count({ isDelete: 0 }).then(function (result) {
    if (result) {
      return result;
    } else {
      return false;
    }
  });
}

function isRegistrationExists(params) {
  console.log(params, "vvvv");
  let query = {};
  // query.accountNumber = parseInt(params.accountNumber);
  query.membershipId = params.membershipId;
  query.mobileNo = params.mobileNo;
  query.isDelete = 0;
  query.status = 1;
  return userDao.findOne(query).then(function (result) {
    if (result) {
      // console.log(result ,"vvvv")
      return result;
    } else {
      return false;
    }
  });
}

function userDetails(params) {
  let query = {};
  if (params.customerId) {
    query._id = apputils.objectIdConvert(params.customerId);
  }
  return userDao.findOne(query).then(function (result) {
    if (result) {
      // console.log(result ,"vvvv")
      return result;
    } else {
      return false;
    }
  });
}

function getUserBeneficiary(params) {
  let aggPipe =[];
  aggPipe.push({$match:{_id:apputils.objectIdConvert(params.customerId) } });

  aggPipe.push({$unwind:"$beneficiary"});

  // aggPipe.push({$match:{
  //   "beneficiary.isDeleted" :0
  // }});
  aggPipe.push({
    $lookup: {
        from: "users",
        localField: "beneficiary.userId",
        foreignField: "_id",
        as: "userDetails"
    }
})

aggPipe.push({
    "$unwind": {
        path: "$userDetails",
        "preserveNullAndEmptyArrays": true
    }
})

aggPipe.push({
  $lookup: {
      from: "accounts",
      localField: "beneficiary.accountType",
      foreignField: "accountType",
      as: "accountDetails"
  }
})

aggPipe.push({
  "$unwind": {
      path: "$accountDetails",
      "preserveNullAndEmptyArrays": true
  }
})

aggPipe.push({
  $project :{
    beneficiaryName : "$userDetails.name",
    beneficiaryMobileNo : "$userDetails.mobileNo",
    beneficiaryProfileImage : "$userDetails.profileImage",
    beneficiaryAccountNumber : "$beneficiary.accountNumber",
    beneficiaryAccountType : "$accountDetails.accountType",
    beneficiaryUserId : "$beneficiary.userId",
    _id : 0,
    beneficiaryId : '$beneficiary._id'
  }
})
 
  return userDao.aggregate(aggPipe).then(function (result) {
    console.log(result ,"aggPipret")
    if (result) {
     
      return result;
    } else {
      return false;
    }
  })
}
function addBeneficiary(beneficiaryDetails, userId) {
  
  return userDao.findOneAndUpdate({ _id : userId,
    "beneficiary.accountNumber": {$ne : beneficiaryDetails[0].accountNumber} },{ $push: { beneficiary: beneficiaryDetails } }, {new : true})
  .then(function (result) {
    console.log(result, "benificiary added to user :-)");
    // if(result){
    //   return result;
    // }
    // else{
    //   return false;
    // }
  });



}

function totalNoOfActiveUsers(params){
    return userDao.count({ status: 1 , isDelete : 0 }).then(function (result) {
        if (result) {
          return result;
        } else {
          return false;
        }
      });
}

function totalNoOfInactiveUsers(params){
    return userDao.count({ status: 2 ,isDelete : 0 }).then(function (result) {
        if (result) {
          return result;
        } else {
          return false;
        }
      });
}

function updateDeviceToken(params) {
  console.log(params)
  let query = {};
  query._id = params.userId;

  var update = {};
  
  update.deviceToken = params.deviceToken
  let option = {};
  option.new = true;
  return userDao.findOneAndUpdate(query, update, option).then(function (result) {
    if (result) {
      return result;
    } else {
      return false;
    }
  });
 
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
  isEmailIdExist,
  createNewUser,
  updateDeviceInfo,
  resetPassword,
  totalNoOfUsers,
  isRegistrationExists,
  userDetails,
  addBeneficiary,
  totalNoOfActiveUsers,
  totalNoOfInactiveUsers,
  getUserBeneficiary,
  deleteBeneficiary,
  updateDeviceToken,
  getUserDeviceToken,
 
};

//========================== Export Module End ===============================
