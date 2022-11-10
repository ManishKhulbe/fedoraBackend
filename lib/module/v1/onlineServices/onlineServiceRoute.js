const router = require("express").Router();
const requestIp = require("request-ip");

const resHndlr = require("../../../responseHandler");
const middleware = require("../../../middleware");
const constants = require("../../../constant");
const onlineServiceFacade = require("./onlineServiceFacade");
const validators = require("./onlineServiceValidators");

const constant = require("../../../constant");
//==============================================================
// , validators.validateDetails
router
  .route("/apply")
  .post(
    [middleware.authenticate.autntctTkn],
    function (req, res) {
      var { serviceApplyFor, remark ,accountType} = req.body;
      let { userType, userId } = req.user;
      onlineServiceFacade
        .apply({
            serviceApplyFor,
          userId,
          remark,
          userType,accountType
        })
        .then(function (result) {
          resHndlr.sendSuccess(res, result, req);
        })
        .catch(function (err) {
          resHndlr.sendError(res, err, req);
        });
    }
  );

router
  .route("/list")
  .get([middleware.authenticate.autntctTkn], function (req, res) {
    let { userType, userId } = req.user;
    let { serviceApplyFor ,status, search ,searchYear,searchMonth, searchDay,pageNo,count,sortType,sortField } = req.query;

    onlineServiceFacade
      .list({userType, userId,  serviceApplyFor ,status, search ,searchYear,searchMonth, searchDay,pageNo,count,sortType,sortField  })
      .then(function (result) {
        resHndlr.sendSuccess(res, result, req);
      })
      .catch(function (err) {
        resHndlr.sendError(res, err, req);
      });
  });

router
  .route("/edit")
  .put([middleware.authenticate.autntctTkn , validators.validateEditDetails], function (req, res) {

    let { userType, userId } = req.user;
    let { 
        serviceApplyFor,
        remark,
        status,
        reply,
        customerId,
        accountId,
        fulfilDate,
        onlineServiceId
     } = req.body;

      onlineServiceFacade
      .edit({userType, userId ,
        serviceApplyFor,
        remark,
        status,
        reply,
        userType,
        userId,
        customerId,
        accountId,
        fulfilDate,
        reply,onlineServiceId
      })
      .then(function (result) {
        resHndlr.sendSuccess(res, result, req);
      })
      .catch(function (err) {
        resHndlr.sendError(res, err, req);
      });
  });

// router
//   .route("/delete")
//   .delete([middleware.authenticate.autntctTkn], function (req, res) {
//     let { userType, userId } = req.user;
//     let { accountId, isDeleted } = req.query;

//     accountFacade
//       .deleteAccount({ accountId, userType, userId, isDeleted })
//       .then(function (result) {
//         resHndlr.sendSuccess(res, result, req);
//       })
//       .catch(function (err) {
//         resHndlr.sendError(res, err, req);
//       });
//   });

module.exports = router;
