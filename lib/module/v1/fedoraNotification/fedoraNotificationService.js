"use strict";

//========================== Load Modules Start =======================
const appUtils = require("../../../appUtils");
//========================== Load internal modules ====================
const fedoraNotificationDao = require("./fedoraNotificationDao");
//========================== Load Modules End ==============================================

function getNotification(params) {
  return fedoraNotificationDao.getNotification(params);
}
function getNotificationDetails(params) {
  return fedoraNotificationDao.getNotificationDetails(params);
}
function getNotificationDeleteByMonth() {
  return fedoraNotificationDao.getNotificationDeleteByMonth();
}
function seenNotification(params) {
  return fedoraNotificationDao.seenNotification(params);
}
//========================== Export Module Start ==============================

module.exports = {
  getNotification,
  getNotificationDetails,
  getNotificationDeleteByMonth,
  seenNotification,
};

//========================== Export Module End ===============================
