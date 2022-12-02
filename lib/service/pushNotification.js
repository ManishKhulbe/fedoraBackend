var FCM = require("fcm-node");
var Promise = require("bluebird");
var config = require("../config");

var fcmServerKey = config.cfg.fcmServerKey; //put your server key here
var fcm = new FCM(fcmServerKey);

function pushNotification(deviceIds, data , title) {
    // console.log(deviceIds, data , title)
  data.timestamp = Date.now();

  let message = {
    to: deviceIds,
    notification: {
      title:title ,
      body: data,
    },
    data: { text: data },
  };
  return new Promise(function (resolve, reject) {
    fcm.send(message, function (error, response) {
      console.log(error);
      if (error) {
        reject(error);
      } else {
        console.log(response);
        resolve(response);
      }
    });
  });
}

// ========================== Export Module Start ==========================
module.exports = {
  pushNotification,
};
// ========================== Export Module End ============================
