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
  .post([middleware.authenticate.autntctTkn], function (req, res) {
    console.log(req.body);
    let {userId , userType} = req.user
    var { customerId, accountId , balance ,accountCreated } = req.body;
   
    customerAccountFacade
      .create({
        customerId,
        accountId,
        balance,
        userId,
        userType,
        accountCreated
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
    let {userId, userType} = req.user
    let { search, count,searchDay ,sortType, sortField, pageNo, startDate, endDate,AccountType,searchYear,searchMonth} = req.query
    customerAccountFacade
      .getAllAccount({
        searchDay,userId ,userType ,search, count, sortType, sortField, pageNo, startDate, endDate,AccountType,searchYear,searchMonth
      })
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
    let {userType , userId} = req.user;
    let {customerAccountId , isDeleted}  = req.query;
    
    customerAccountFacade
      .deleteAccount({customerAccountId ,userType,userId , isDeleted})
      .then(function (result) {
        resHndlr.sendSuccess(res, result, req);
      })
      .catch(function (err) {
        resHndlr.sendError(res, err, req);
      });
  });
  
module.exports = router;
