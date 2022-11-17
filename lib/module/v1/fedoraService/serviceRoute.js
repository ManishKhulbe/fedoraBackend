const router = require("express").Router();
const requestIp = require("request-ip");

const resHndlr = require("../../../responseHandler");
const middleware = require("../../../middleware");
const constants = require("../../../constant");
const serviceFacade = require("./serviceFacade");
const validators = require("./serviceValidators");

// const constant = require("../../../constant");
//==============================================================
// validators.validateTransaction

router.route('/create')
    .post([middleware.authenticate.autntctTkn ,middleware.multer.single('serviceLogo'), middleware.mediaUpload.uploadSingleMediaToS3('serviceLogo'),validators.validateCreateService ],
    function (req, res) {
        console.log(req.body)
        let {userId, userType} = req.user
        let {serviceName,location  ,description } = req.body
     
        serviceFacade.create({serviceName,description ,location  ,userId, userType})
            .then(function (result) {
                resHndlr.sendSuccess(res, result, req)
            }).catch(function (err) {
            resHndlr.sendError(res, err, req)
        })
    });

    router.route('/list')
    .get([middleware.authenticate.autntctTkn], function (req, res) {
        let {userId, userType} = req.user
        let {serviceType,count,pageNo ,status} = req.query
        serviceFacade.list({userId, userType, serviceType ,pageNo ,count ,status})
            .then(function (result) {
                resHndlr.sendSuccess(res, result, req)
            }).catch(function (err) {
            resHndlr.sendError(res, err, req)
        })
    });

    router
  .route("/edit")
  .put([middleware.authenticate.autntctTkn,validators.validateEditService ,middleware.multer.single('serviceLogo'), middleware.mediaUpload.uploadSingleMediaToS3('serviceLogo') ], function (req, res) {

    let { userType, userId } = req.user;
    let { 
        serviceType,
        discription,
        location,
        serviceId,
        status
     } = req.body;

     serviceFacade
      .edit({userType, userId ,
        serviceType,
        discription,
        serviceId,
        location,
        status
      })
      .then(function (result) {
        resHndlr.sendSuccess(res, result, req);
      })
      .catch(function (err) {
        resHndlr.sendError(res, err, req);
      });
  });

  router
  .route("/deleteService")
  .delete([middleware.authenticate.autntctTkn], function (req, res) {
    let { userType, userId } = req.user;
    let { serviceId, isDeleted } = req.query;

    serviceFacade
      .deleteService({ serviceId, userType, userId, isDeleted })
      .then(function (result) {
        resHndlr.sendSuccess(res, result, req);
      })
      .catch(function (err) {
        resHndlr.sendError(res, err, req);
      });
  });

module.exports = router;
