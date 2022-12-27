const router = require("express").Router();
const requestIp = require("request-ip");

const resHndlr = require("../../../responseHandler");
const middleware = require("../../../middleware");
const constants = require("../../../constant");
const grievanceFacade = require("./grievanceFacade");
const validators = require("./grievanceValidator");

// const constant = require("../../../constant");
//==============================================================
// validators.validateTransaction

router
  .route("/create")
  .post([middleware.authenticate.autntctTkn], function (req, res) {
    console.log(req.user, "VVVVVVV");
    let { userId, userType, mobileNo } = req.user;
    let { description } = req.body;

    grievanceFacade
      .create({ description, userId, userType, mobileNo })
      .then(function (result) {
        resHndlr.sendSuccess(res, result, req);
      })
      .catch(function (err) {
        resHndlr.sendError(res, err, req);
      });
  });

router
  .route("/list")
  .get([middleware.authenticate.autntctTkn], function (req, res) {
    let { userId, userType } = req.user;
    let { search, status, count, pageNo, date } = req.query;
    grievanceFacade
      .list({ search, status, count, pageNo, userId, userType, date })
      .then(function (result) {
        resHndlr.sendSuccess(res, result, req);
      })
      .catch(function (err) {
        resHndlr.sendError(res, err, req);
      });
  });

router
  .route("/edit")
  .put([middleware.authenticate.autntctTkn], function (req, res) {
    let { userType, userId } = req.user;
    let { grievanceId, status } = req.body;

    grievanceFacade
      .edit({ userType, userId, grievanceId, status })
      .then(function (result) {
        resHndlr.sendSuccess(res, result, req);
      })
      .catch(function (err) {
        resHndlr.sendError(res, err, req);
      });
  });

  router
  .route("/delete")
  .delete([middleware.authenticate.autntctTkn], function (req, res) {
    let { userType, userId } = req.user;
    let { grievanceId, isDeleted } = req.query;

    grievanceFacade
      .deleteGrievance({ grievanceId, userType, userId, isDeleted })
      .then(function (result) {
        resHndlr.sendSuccess(res, result, req);
      })
      .catch(function (err) {
        resHndlr.sendError(res, err, req);
      });
  });

module.exports = router;
