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
  .post([middleware.authenticate.autntctTkn ,validators.validateCustomerAccCreate  ], function (req, res) {
    console.log(req.body);
    let {userId , userType} = req.user
    var { customerId, accountId , balance ,accountCreated , accountNumber} = req.body;
   
    customerAccountFacade
      .create({
        customerId,
        accountId,
        balance,
        userId,
        userType,
        accountCreated,
        accountNumber
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
  .route("/listByCustomer")
  .get([middleware.authenticate.autntctTkn], function (req, res) {
    console.log(req.query)
    let {userId, userType} = req.user
    // let { search, count,searchDay ,sortType, sortField, pageNo, startDate, endDate,AccountType,searchYear,searchMonth} = req.query
    customerAccountFacade
      .getUserAccount({
        userId ,userType 
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
  
  // nkcnOD37xmJ9DmxlPIcQ7exW8B2PLOu6Bk0O4YB64pArq0WCp6DmKpAZla9advmh
  // 636a22cf124a96297d2189a8
router
.route("/fundTransfer")
.post([middleware.authenticate.autntctTkn], function (req, res) {
  console.log(req.body);
  let {userId , userType} = req.user
  var { senderAccountNumber , receiverAccountNumber ,transactionAmount  ,remark } = req.body;
 
  customerAccountFacade
    .fundTransfer1({
      senderAccountNumber,receiverAccountNumber,transactionAmount,
      
      remark,
      userType,
      userId
    })
    .then(function (result) {
      resHndlr.sendSuccess(res, result, req);
    })
    .catch(function (err) {
      resHndlr.sendError(res, err, req);
    });
});


router
.route("/checkBalance")
.get([middleware.authenticate.autntctTkn], function (req, res) {
 
  let {userId , userType} = req.user
  let { customerAccountId } = req.query;
 
  customerAccountFacade
    .checkBalance({
      customerAccountId,
      userType,
      userId
    })
    .then(function (result) {
      resHndlr.sendSuccess(res, result, req);
    })
    .catch(function (err) {
      resHndlr.sendError(res, err, req);
    });
});


router
.route("/getReceiverDetails")
.get([middleware.authenticate.autntctTkn , validators.validateReceiverDetails], function (req, res) {

  let {userId , userType} = req.user
  let { receiverAccountNumber } = req.query;
 
  customerAccountFacade
    .getReceiverDetails({
      receiverAccountNumber,
      userType,
      userId
    })
    .then(function (result) {
      resHndlr.sendSuccess(res, result, req);
    })
    .catch(function (err) {
      resHndlr.sendError(res, err, req);
    });
});

router
.route("/addBalance")
.post([middleware.authenticate.autntctTkn , validators.validateBeneficiaryDetails], function (req, res) {

  let {userId , userType} = req.user
  let { beneficiaryAccountNumber , amount } = req.query;
 
  customerAccountFacade
    .addBalance({
      beneficiaryAccountNumber,
      userType,
      userId,
      amount
    })
    .then(function (result) {
      resHndlr.sendSuccess(res, result, req);
    })
    .catch(function (err) {
      resHndlr.sendError(res, err, req);
    });
});


module.exports = router;
