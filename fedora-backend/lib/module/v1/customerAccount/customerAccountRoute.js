const router = require("express").Router();
const requestIp = require("request-ip");

const resHndlr = require("../../../responseHandler");
const middleware = require("../../../middleware");
const constants = require("../../../constant");
const customerAccountFacade = require("./customerAccountFacade");
const validators = require("./customerAccountValidator");

const constant = require("../../../constant");
//==============================================================



router
  .route("/create")
  .post( function (req, res) {
    console.log(req.body);
    var { userId, accountId } = req.body;
    customerAccountFacade
      .create({
        accountId,
        userId,
      })
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
    console.log(req.query)
    let {userId, status} = req.user
    let {search, count, sortType, sortField, pageNo, startDate, endDate,AccountType,searchYear,searchMonth} = req.query
    customerAccountFacade
      .getAllAccount({
        search, count, sortType, sortField, pageNo, startDate, endDate,AccountType,searchYear,searchMonth
      })
      .then(function (result) {
        resHndlr.sendSuccess(res, result, req);
      })
      .catch(function (err) {
        resHndlr.sendError(res, err, req);
      });
  });

  
  
module.exports = router;
