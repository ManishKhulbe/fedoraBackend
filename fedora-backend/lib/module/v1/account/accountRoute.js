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
    console.log(req.body);
    var { accountType, accountInterestRate, accountOverdraft} = req.body;
    accountFacade
      .create({
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


  
module.exports = router;
