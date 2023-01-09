const router = require("express").Router();
const requestIp = require("request-ip");

const resHndlr = require("../../../responseHandler");
const middleware = require("../../../middleware");
const constants = require("../../../constant");
const fedoraNotificationFacade = require("./fedoraNotificationFacade");
// const validators = require("./serviceValidators");

// const constant = require("../../../constant");
//==============================================================
// validators.validateTransaction

// router.route('/create')
//     .post([middleware.authenticate.autntctTkn ,middleware.multer.single('serviceLogo'), middleware.mediaUpload.uploadSingleMediaToS3('serviceLogo'),validators.validateCreateService ],
//     function (req, res) {
//         console.log(req.body ,"VVVVVVV")
//         let {userId, userType} = req.user
//         let {serviceName,location  ,description } = req.body

//         serviceFacade.create({serviceName,description ,location  ,userId, userType})
//             .then(function (result) {
//                 resHndlr.sendSuccess(res, result, req)
//             }).catch(function (err) {
//             resHndlr.sendError(res, err, req)
//         })
//     });

    router.route('/list')
    .get([middleware.authenticate.autntctTkn], function (req, res) {
        let {userId, userType} = req.user
        let {count , pageNo}= req.query
        fedoraNotificationFacade.list({userId, userType , count , pageNo})
            .then(function (result) {
                resHndlr.sendSuccess(res, result, req)
            }).catch(function (err) {
            resHndlr.sendError(res, err, req)
        })
    });

    router.route('/seenNotification')
    .post([middleware.authenticate.autntctTkn], function (req, res) {
        let {userId, userType} = req.user
       
        let {notificationIdArray}= req.body
     
        fedoraNotificationFacade.seenNotification({userId, userType ,notificationIdArray})
            .then(function (result) {
                resHndlr.sendSuccess(res, result, req)
            }).catch(function (err) {
            resHndlr.sendError(res, err, req)
        })
    });


    router.route('/notificationDetails')
    .get([middleware.authenticate.autntctTkn], function (req, res) {
        let {userId, userType} = req.user
        let {notificationId}= req.query
        fedoraNotificationFacade.notificationDetails({userId, userType , notificationId})
            .then(function (result) {
                resHndlr.sendSuccess(res, result, req)
            }).catch(function (err) {
            resHndlr.sendError(res, err, req)
        })
    });
    
  router
  .route("/deleteNotificationWithCron")
  .delete([middleware.authenticate.autntctTkn], function (req, res) {
    let { userType, userId } = req.user;
let {timePeriod , timePeriodType }= req.query
    fedoraNotificationFacade
      .deleteNotificationCron({  userType, userId ,timePeriod , timePeriodType })
      .then(function (result) {
      console.log(result ,"vvvv")
        resHndlr.sendSuccess(res, result, req);
      })
      .catch(function (err) {
        resHndlr.sendError(res, err, req);
      });
  });

module.exports = router;
