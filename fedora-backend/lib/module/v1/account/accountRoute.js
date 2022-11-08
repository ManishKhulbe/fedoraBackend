const router = require("express").Router();
const requestIp = require("request-ip");

const resHndlr = require("../../../responseHandler");
const middleware = require("../../../middleware");
const constants = require("../../../constant");
const accountFacade = require("./accountFacade");
const validators = require("./accountValidators");

const constant = require("../../../constant");
//==============================================================



router
  .route("/create")
  .post([middleware.authenticate.autntctTkn,validators.validateAccountDetails], function (req, res) {
    console.log(req.user);
    var { accountType, accountInterestRate, accountOverdraft} = req.body;
    let {userType , userId} = req.user;
    accountFacade
      .create({
        userType , userId,
        accountType,
        accountInterestRate,
        accountOverdraft,
        accountType
      })
      .then(function (result) {
        resHndlr.sendSuccess(res, result, req);
      })
      .catch(function (err) {
        resHndlr.sendError(res, err, req);
      });
  });


  router.route('/list')
  .get([middleware.authenticate.autntctTkn], function (req, res) {
    let {userType , userId} = req.user;
    let {accountType }=req.query;
 
    accountFacade
      .getAllAccounts({userType , userId , accountType})
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
    let {userType , userId} = req.user;
    let {
      accountId,
      accountType,
      accountOverdraft,
      accountInterestRate
    } = req.body;
   
    accountFacade
      .editAccount({
        accountId,
        accountType,
        accountOverdraft,
        accountInterestRate,
        userType,
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
  .route("/delete")
  .delete([middleware.authenticate.autntctTkn], function (req, res) {
    let {userType , userId} = req.user;
    let {accountId , isDeleted}  = req.query;
    
    accountFacade
      .deleteAccount({accountId,userType,userId , isDeleted})
      .then(function (result) {
        resHndlr.sendSuccess(res, result, req);
      })
      .catch(function (err) {
        resHndlr.sendError(res, err, req);
      });
  });

  
module.exports = router;
