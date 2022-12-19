"use strict";
//========================== Load Modules Start =======================

//========================== Load internal modules ====================
var mongoose = require("mongoose");
var promise = require("bluebird");

var _ = require("lodash");
//========================== Load internal modules ====================
const onlineServiceModel = require("./onlineServiceModel");

var apputils = require("../../../appUtils");
// init user dao
let BaseDao = require("../../../dao/baseDao");
const onlineServiceDao = new BaseDao(onlineServiceModel);

//========================== Load Modules End ==============================================

function apply(params, serviceDetails) {
  console.log(params, "MMM", serviceDetails);
  let service = {};
  if (params.remark) {
    service.remark = params.remark;
  }
  if (params.orderDate) {
    service.orderDate = params.orderDate;
  }
  if (params.timeSlot) {
    service.timeSlot = params.timeSlot;
  }
  if (params.address) {
    service.address = params.address;
  }
  if (params.amount) {
    service.amount = parseInt(params.amount);
  }
  if (params.accountType) {
    service.accountType = parseInt(params.accountType);
  }
  if (params.duration) {
    service.duration = parseInt(params.duration);
  }
  if (serviceDetails) {
    service.serviceName = serviceDetails.serviceName;
    service.serviceType = serviceDetails.serviceType;
  }
  if(params.optionActionType){
    service.optionActionType = params.optionActionType;
  }
  service.customerId = params.userId;
  let newService = new onlineServiceModel(service);

  return onlineServiceDao.save(newService).then((result) => {
    return result;
  });
}

async function list(params) {
  console.log(params, "MMM");
  let aggPipe = [];
  let query = {};

  if (params.status) {
    query.status = parseInt(params.status);
  }
  if (params.serviceType) {
    query.serviceType = parseInt(params.serviceType);
  }

  aggPipe.push({
    $match: query,
  });

  aggPipe.push({
    $sort: {
      createdAt: -1,
    },
  });
  aggPipe.push({
    $lookup: {
      from: "users",
      localField: "customerId",
      foreignField: "_id",
      as: "customerDetails",
    },
  });

  aggPipe.push({
    $unwind: {
      path: "$customerDetails",
      preserveNullAndEmptyArrays: true,
    },
  });
  aggPipe.push({
    $lookup: {
      from: "accounts",
      localField: "accountType",
      foreignField: "accountType",
      as: "accountDetails",
    },
  });
  aggPipe.push({
    $unwind: {
      path: "$accountDetails",
      preserveNullAndEmptyArrays: true,
    },
  });

  aggPipe.push({
    $project: {
      accountType: 1,
      serviceName: 1,
      serviceType: 1,
      accountNumber: 1,
      amount: 1,
      orderDate: 1,
      timeSlot: 1,
      address: 1,
      customerId: 1,
      isDeleted: 1,
      remark: 1,
      status: 1,
      reply: 1,
      createdAt: 1,
      customerMobileNo: "$customerDetails.mobileNo",
      customerName: "$customerDetails.name",
      year: { $year: "$createdAt" },
      month: { $month: "$createdAt" },
      day: { $dayOfMonth: "$createdAt" },
    },
  });

  if (params.search) {
    aggPipe.push({
      $match: {
        customerName: {
          $regex: ".*" + params.search + ".*",
          $options: "i",
        },
      },
    });
  }

  if (params.searchYear) {
    aggPipe.push({
      $match: {
        year: parseInt(params.searchYear),
      },
    });
  }
  if (params.searchMonth) {
    aggPipe.push({
      $match: {
        month: parseInt(params.searchMonth),
      },
    });
  }
  if (params.searchDay) {
    aggPipe.push({
      $match: {
        day: parseInt(params.searchDay),
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

  if (params.sortField === "createdAt") {
    sort = {
      createdAt: sortType,
    };
  }

  if (params.sortField != undefined) {
    aggPipe.push({
      $sort: sort,
    });
  }

  // let count, pageNo;
  // if (params.count && params.pageNo) {
  //     count = parseInt(params.count)
  //     pageNo = parseInt(params.pageNo)

  //     aggPipe.push({
  //         $skip: pageNo * count
  //     });
  //     aggPipe.push({
  //         $limit: count
  //     })
  // }

  let pageNo, count;
  let nestedPipe = [];
  if (params.pageNo && params.count) {
    count = parseInt(params.count);
    pageNo = parseInt(params.pageNo);
    nestedPipe.push({ $skip: pageNo * count });
    nestedPipe.push({ $limit: count });
  }

  aggPipe.push({
    $facet: {
      totalCount: [{ $count: "dataCount" }],
      pipelineResults: nestedPipe,
    },
  });

  aggPipe.push({
    $unwind: "$totalCount",
  });
  return await onlineServiceDao.aggregate(aggPipe).then((res) => {
    console.log(res, "BBBB");
    return res;
  });
}

function edit(params) {
  console.log(params, "MMM");
  let update = {};
  let query = {};
  query._id = apputils.objectIdConvert(params.onlineServiceId);
  if (params.status) {
    update.status = parseInt(params.status);
  }
  if (params.reply) {
    update.reply = params.reply;
  }
  if (params.serviceId) {
    update.serviceId = params.serviceId;
  }
  if (params.remark) {
    update.remark = params.remark;
  }

  if (params.accountId) {
    update.accountId = apputils.objectIdConvert(params.accountId);
  }
  if (params.customerId) {
    update.customerId = apputils.objectIdConvert(params.customerId);
  }
  if (params.fulfilDate) {
    update.fulfilDate = params.fulfilDate;
  }

  let options = {};
  options.new = true;

  return onlineServiceDao
    .findOneAndUpdate(query, { $set: update }, options)
    .then(function (result) {
      console.log(result, ".123.");
      if (result) {
        return result;
      } else {
        return false;
      }
    });
}
function softDeleteOnlineService(params) {
  console.log(params);
  let update = {};
  let query = {};
  query._id = apputils.objectIdConvert(params.onlineServicesId);
  if (params.isDeleted) {
    update["isDeleted"] = parseInt(params.isDeleted);
  }

  let options = {};
  options.new = true;

  return onlineServiceDao
    .findOneAndUpdate(query, { $set: update }, options)
    .then(function (result) {
      if (result) {
        return result;
      } else {
        return false;
      }
    });
}

function deleteOnlineService(params) {
  console.log(params, "..");
  let query = {};
  query._id = apputils.objectIdConvert(params.onlineServicesId);
  return onlineServiceDao.remove(query).then(function (result) {
    console.log(result, ".s.");
    if (result) {
      return result;
    } else {
      return false;
    }
  });
}

function pendingOnlineServices(params) {
  let query = {};
  query.status = 0;
  query.isDeleted = 0;

  return onlineServiceDao.count(query).then((res) => {
    return res;
  });
}

function completedOnlineServices(params) {
  let query = {};
  query.status = 1;
  query.isDeleted = 0;

  return onlineServiceDao.count(query).then((res) => {
    return res;
  });
}

function rejectedOnlineServices(params) {
  let query = {};
  query.status = 2;
  query.isDeleted = 0;

  return onlineServiceDao.count(query).then((res) => {
    return res;
  });
}

function totalOnlineService(params) {
  let query = {};
  query.isDeleted = 0;

  return onlineServiceDao.count(query).then((res) => {
    return res;
  });
}

function pendingOnlineServicesByType(params) {
  // console.log(params ,"MM")
  let aggPipe = [];

  aggPipe.push({
    $match: {
      status: 0,
    },
  });

  aggPipe.push({
    $lookup: {
      from: "services",
      localField: "serviceId",
      foreignField: "_id",
      as: "accountDetails",
    },
  });
  aggPipe.push({
    $unwind: {
      path: "$accountDetails",
      preserveNullAndEmptyArrays: true,
    },
  });

  aggPipe.push({
    $group: {
      _id: "$accountDetails.serviceName",
      count: { $sum: 1 },
    },
  });

  return onlineServiceDao.aggregate(aggPipe).then((res) => {
    // console.log(res ,"BBBB")
    if (res.length != 0) {
      return res;
    } else {
      return false;
    }
  });
}

function applyFedoraCash(params, serviceDetails) {
  // console.log(params , serviceDetails ,"..")
  let query = {};
  query.amount = params.amount;
  query.accountNumber = params.accountNumber;
  query.serviceType = parseInt(serviceDetails.serviceType);
  query.serviceName = serviceDetails.serviceName;

  query.customerId = apputils.objectIdConvert(params.userId);
  query.remark = params.remark;
  // console.log(query ,"..")
  let newService = new onlineServiceModel(query);
  // console.log(newService ,"..")
  return onlineServiceDao.save(query).then((res) => {
    // console.log(res ,"..")
    if (res) {
      return res;
    } else {
      return false;
    }
  });
}
//========================== Export Module Start ==============================

module.exports = {
  apply,
  list,
  edit,
  deleteOnlineService,
  softDeleteOnlineService,
  pendingOnlineServices,
  pendingOnlineServicesByType,
  totalOnlineService,
  rejectedOnlineServices,
  completedOnlineServices,
  applyFedoraCash,
};

//========================== Export Module End ===============================
