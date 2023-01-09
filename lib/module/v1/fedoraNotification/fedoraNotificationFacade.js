"use strict";

//========================== Load Modules Start =======================

//========================== Load external modules ====================
// Load user service
var _ = require("lodash");
var Promise = require("bluebird");
var ip = require("ip");
var vCardsJS = require("vcards-js");
//========================== Load internal modules ====================

const fedoraNotificationService = require("./fedoraNotificationService");
const fedoraNotificationMapper = require("./fedoraNotificationMapper");

const appUtils = require("../../../appUtils");
const redisSession = require("../../../redisClient/session");
const redisClient = require("../../../redisClient/init");
const customException = require("../../../customException");
const emailService = require("../../../service/sendgrid_email");
const nodemailer = require("../../../service/nodemailer_email");
const constant = require("../../../constant");
const config = require("../../../config");
const cron = require("node-cron");
var CronJob = require("cron").CronJob;
let crons = require("../../../cronJobScheduler");
const schedule = require("node-schedule");
// crons.deleteNotification()
//========================== Load Modules End ==============================================

function list(params) {
  // console.log(params)
  // params.userType = appUtils.isAdmin(params.userType);
  const getNotification = fedoraNotificationService.getNotification(params);

  return Promise.all([getNotification]).then(function (result) {
    return fedoraNotificationMapper.getNotificationMapper(result[0], params);
  });
}

function notificationDetails(params) {
  // console.log(params)
  // params.userType = appUtils.isAdmin(params.userType);
  const getNotification =
    fedoraNotificationService.getNotificationDetails(params);

  return Promise.all([getNotification]).then(function (result) {
    return fedoraNotificationMapper.getNotificationDetailsMapper(
      result[0],
      params
    );
  });
}

function deleteNotificationCron(params) {
  params.isAdmin = appUtils.isAdmin(params.userType);
  let cronString = `*/${parseInt(params.timePeriod)} * * * * *`;
  console.log(cronString, "cronStringcronString");
  if (params.timePeriodType == 1) {
    cronString = ` 0 0 */${params.timePeriod} * *`;
  } else if (params.timePeriodType == 2) {
    cronString = `0 0 1 */${params.timePeriod} *`;
  } else if (params.timePeriodType == 3) {
    cronString = `0 0 1 */${params.timePeriod * 12} *`;
  }

  let deleteCronSuccess = schedule.cancelJob("deleteNotificationCron");
  // return fedoraNotificationMapper.deleteNotificationsMapper(
  //   params
  // ).then((res)=>{
  //   console.log(res,"bbb")
  if (deleteCronSuccess) {
    crons.deleteNotifications(cronString);
  }
  // })
}

async function getNotificationDeleteByMonth(params) {
  const getNotification =
    await fedoraNotificationService.getNotificationDeleteByMonth(params);
}

function seenNotification(params) {
  return fedoraNotificationService.seenNotification(params).then((res) => {
    return fedoraNotificationMapper.seenNotificationMapper(res);
  });
}

//========================== Export Module Start ==============================

module.exports = {
  list,
  notificationDetails,
  deleteNotificationCron,
  getNotificationDeleteByMonth,
  seenNotification,
};

//========================== Export Module End ================================
