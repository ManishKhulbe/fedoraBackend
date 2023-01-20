"use strict";


const schedule = require('node-schedule')
const fedoraNotificationDao = require('./module/v1/fedoraNotification/fedoraNotificationDao')

module.exports.deleteNotifications = (cronString)=>{
  schedule.scheduleJob('deleteNotificationCron',cronString ,()=>{
     fedoraNotificationDao.getNotificationDeleteByMonth()
  })
} 









// 9AL7Cj88kei4o4VY3ggX0D5tTt4gFT8057I0LkSiaJIARH9kcDWISlTZlbbwhd6d





//========================================================================================


// const cron = require("cron");
// var CronJob = require("cron").CronJob;

// const fedoraNotificationFacade = require("./module/v1/fedoraNotification/fedoraNotificationFacade");
// const getNotificationDeleteByMonth = require('./module/v1/fedoraNotification/fedoraNotificationDao')
// const constants = require("./constant");

// const deleteNotification = (params) => {
 
//stop all previous cron jobs
// console.log("cron running" , job.running)
// if(cron.running){
//   console.log("cron running")
//   cron.stop();
// }

//   var job = new CronJob(
//     params,
//     function () {
//       // console.log("deleteNotification");
//       // return
//       getNotificationDeleteByMonth.getNotificationDeleteByMonth()
//           .then(function (result) {
//               console.log("you will see this message after every one month ",result )
//           })
//     },
//     null,
//     true,
//     "Asia/Kolkata"
//   );
//   // job.stop();
//   console.log(job.running, "job is running");

//   job.start();
// };


// module.exports = {
//   deleteNotification,
// };


//===============================================================================