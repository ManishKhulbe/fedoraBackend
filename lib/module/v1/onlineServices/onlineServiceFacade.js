"use strict";

//========================== Load Modules Start =======================

//========================== Load external modules ====================
// Load user service
var _ = require("lodash");
var Promise = require("bluebird");
var ip = require("ip");
var vCardsJS = require("vcards-js");
//========================== Load internal modules ====================

const onlineServiceService = require("./onlineServiceService");
const onlineServiceMapper = require("./onlineServiceMapper");

const appUtils = require("../../../appUtils");
const redisSession = require("../../../redisClient/session");
const redisClient = require("../../../redisClient/init");
const customException = require("../../../customException");
const emailService = require("../../../service/sendgrid_email");
const nodemailer = require("../../../service/nodemailer_email");
const constant = require("../../../constant");
const config = require("../../../config");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const serviceDao = require("../fedoraService/serviceDao");
const userDao = require("../user/userDao");
const accountDao = require("../account/accountDao");
//========================== Load Modules End ==============================================
                   
async function apply(params) {
  let self = this;
 console.log(params)
 if(params.accountId){
   let accountId = await accountDao.isAccountIdExists(params);
   console.log(accountId)
   params.accountType = accountId.accountType;
 }
if(params.addressId){
  let addressDetails = await userDao.getUserAddressDetails(params);

for(let i= 0 ; i < addressDetails.address.length ; i++){
  if(addressDetails.address[i]._id == params.addressId){
    console.log(addressDetails.address[i], `addressDetails.address[i]`)
    params.address = JSON.stringify(addressDetails.address[i]) ;
  }
}

}

const serviceDetails = await serviceDao.isServiceIdExists(params)
      return onlineServiceService.apply(params , serviceDetails)
    .then(function (account) {
       return onlineServiceMapper.applyMapping(account);
    })
    .catch(function (err) {
      throw err;
    });
}

function list(params) {
    let self = this;
    params.userType = appUtils.isSuperAdminAndAdminAndManagerAndViewer(params.userType);
    const onlineServiceListByFilter = onlineServiceService.list(params)
    const totalOnlineService = onlineServiceService.totalOnlineService(params)
    const pendingOnlineServices= onlineServiceService.pendingOnlineServices(params)
    const completedOnlineServices = onlineServiceService.completedOnlineServices(params)
    const rejectedOnlineServices = onlineServiceService.rejectedOnlineServices(params)
    return Promise.all([onlineServiceListByFilter , totalOnlineService , pendingOnlineServices , completedOnlineServices,rejectedOnlineServices ])
    .then(function (result) {
        return onlineServiceMapper.listMapping(result[0] , result[1] , result[2] , result[3] , result[4]);
    })
    .catch(function (err) {
        throw err;
    });
}

function edit(params){
console.log(params)
params.userType = appUtils.isAdmin(params.userType);
return onlineServiceService.edit(params)
.then(function (account) {
    return onlineServiceMapper.editMapping(account);
}
)
.catch(function (err) {
    throw err;
})

}

function deleteService(params){
  
    params.userType = appUtils.isAdmin(params.userType);
    return onlineServiceService.deleteService(params).then(function (result) {
      if (result) {
        return onlineServiceMapper.deleteOnlineServiceMapping(result, params);
      } else {
        throw exceptions.yearNotExist();
      }
    });

}

async function applyFedoraCash(params){
console.log(params)
const serviceDetails = await serviceDao.isServiceIdExists(params)
console.log(serviceDetails)
  return onlineServiceService.applyFedoraCash(params ,serviceDetails)
  .then(function (account) {
     return onlineServiceMapper.applyFedoraCashMapping(account);
  })
  .catch(function (err) {
    throw err;
  });
}


//========================== Export Module Start ==============================

module.exports = {
    apply,list,edit,deleteService,applyFedoraCash
};

//========================== Export Module End ================================
