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
        console.log(req.body ,"VVVVVVV")
        let {userId, userType} = req.user
        let {serviceName,location  ,description ,serviceType   } = req.body

        serviceFacade.create({serviceName,description ,location  ,userId, userType ,serviceType })
            .then(function (result) {
                resHndlr.sendSuccess(res, result, req)
            }).catch(function (err) {
            resHndlr.sendError(res, err, req)
        })
    });


    router.route('/createOptions')
    .post([middleware.authenticate.autntctTkn ,middleware.multer.single('optionLogo'), middleware.mediaUpload.uploadSingleMediaToS3('serviceLogo') ],
    function (req, res) {
        console.log(req.body ,"VVVVVVV")
        let {userId, userType} = req.user
        let {optionName,location   ,serviceId  , optionAction ,optionType} = req.body

        serviceFacade.createOptions({optionName  ,location  ,userId, userType ,serviceId  , optionAction ,optionType})
            .then(function (result) {
                resHndlr.sendSuccess(res, result, req)
            }).catch(function (err) {
            resHndlr.sendError(res, err, req)
        })
    });   

    

    router.route('/editOptionAction')
    .put([middleware.authenticate.autntctTkn ],
    function (req, res) {
        console.log(req.body ,"VVVVVVV")
        let {userId, userType} = req.user
        let {serviceId,optionId   ,optionName  , optionAction ,optionType} = req.query

        serviceFacade.editOptionAction({serviceId,optionId   ,optionName ,optionType , optionAction ,userId, userType})
            .then(function (result) {
                resHndlr.sendSuccess(res, result, req)
            }).catch(function (err) {
            resHndlr.sendError(res, err, req)
        })
    }); 

    router.route('/deleteOptionAction')
    .delete([middleware.authenticate.autntctTkn ],
    function (req, res) {
     
        let {userId, userType} = req.user
        let {serviceId,optionId } = req.query

        serviceFacade.deleteOptionAction({serviceId,optionId  ,userId, userType})
            .then(function (result) {
                resHndlr.sendSuccess(res, result, req)
            }).catch(function (err) {
            resHndlr.sendError(res, err, req)
        })
    }); 
    // txlenPLYqVQb1QTPsakO0VvqEXW35QqUvgEAzShBObhVg1oDsV8duGzZlbx6xo95
    // initiate new cash withdrawal request
    router.route('/list')
    .get([middleware.authenticate.autntctTkn], function (req, res) {
        let {userId, userType} = req.user
        let {serviceName,count,pageNo ,status ,serviceType} = req.query
        serviceFacade.list({userId, userType, serviceName ,pageNo ,count ,status ,serviceType})
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
      serviceName,
      description,
        location,
        serviceId,
        status,
        serviceType
     } = req.body;

     serviceFacade
      .edit({userType, userId ,
        serviceName,
        description,
        serviceId,
        location,
        status,
        serviceType
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
