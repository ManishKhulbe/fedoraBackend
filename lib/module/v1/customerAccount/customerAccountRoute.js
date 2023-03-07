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
    console.log(req.body ,"m");
    let {userId , userType} = req.user
    var { rdAmount ,customerId, accountId , balance ,accountCreated ,tenure , allotedAmount , accountInterestRate} = req.body;
   
    customerAccountFacade
      .create({
        rdAmount,
        customerId,
        accountId,
        balance,
        userId,
        userType,
        accountCreated,
        tenure,
        allotedAmount,
        accountInterestRate
      })
      .then(function (result) {
        resHndlr.sendSuccess(res, result, req);
      })
      .catch(function (err) {
        resHndlr.sendError(res, err, req);
      });
  });


  router
  .route("/editAccount")
  .put([middleware.authenticate.autntctTkn ,validators.validateEditAccount  ], function (req, res) {
 
    let {userId , userType} = req.user
    var { customerAccountId, accountInterestRate ,tenure , allotedAmount , rdAmount} = req.query;
   
    customerAccountFacade
      .editAccount({
        customerAccountId,
        userId,
        userType,
        tenure,
        allotedAmount,
        accountInterestRate,
        rdAmount
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
    // let shouldEncrypt = true;
    let {userId, userType} = req.user
    let { search, count,searchDay ,sortType, sortField, pageNo, AccountType,searchYear,searchMonth ,accountStatus} = req.query
    customerAccountFacade
      .getAllAccount({
        searchDay,userId ,userType ,search, count, sortType, sortField, pageNo, AccountType,searchYear,searchMonth,accountStatus
      })
      .then(function (result) {
        resHndlr.sendSuccess(res, result, req );
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
    let {customerAccountId , isDeleted , accountStatus}  = req.query;
    
    customerAccountFacade
      .deleteAccount({customerAccountId ,userType,userId , isDeleted , accountStatus })
      .then(function (result) {
        resHndlr.sendSuccess(res, result, req);
      })
      .catch(function (err) {
        resHndlr.sendError(res, err, req);
      });
  });
  
  router
.route("/initiateFundTransfer")
.post([middleware.authenticate.autntctTkn], function (req, res) {

  let {userId , userType} = req.user
  var { senderAccountNumber , receiverAccountNumber ,transactionAmount  ,remark } = req.body;

  customerAccountFacade
    .initiateFundTransfer({
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
.route("/validateFundTransferOtp")
.post([middleware.authenticate.autntctTkn], function (req, res) {

  let {userId , userType} = req.user
  var { otp } = req.body;

  customerAccountFacade
    .validateFundTransferOtp({
     otp,
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
.route("/fundTransfer")
.post([middleware.authenticate.autntctTkn], function (req, res) {

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
.route("/fundTransferToOtherBank")
.post([middleware.authenticate.autntctTkn], function (req, res) {

  let {userId , userType} = req.user
  var { senderAccountNumber , otherBankDetailsId ,transactionAmount  ,remark } = req.body;

  customerAccountFacade
    .fundTransferToOtherBank({
      senderAccountNumber,otherBankDetailsId,transactionAmount,
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
  let { beneficiaryAccountNumber , amount  , remark ,transactionType , date} = req.body;
 
  customerAccountFacade
    .addBalance({
      beneficiaryAccountNumber,
      userType,
      userId,
      amount,remark ,transactionType , date
    })
    .then(function (result) {
      resHndlr.sendSuccess(res, result, req);
    })
    .catch(function (err) {
      resHndlr.sendError(res, err, req);
    });
});


router
.route("/calculateInterest")
.post([middleware.authenticate.autntctTkn ], function (req, res) {

  let {userId , userType} = req.user
  let { accountType ,timePeriod ,timePeriodType } = req.body;
 
  customerAccountFacade
    .calculateInterest({
      accountType,
      userType,
      userId,timePeriod ,timePeriodType
     
    })
    .then(function (result) {
      resHndlr.sendSuccess(res, result, req);
    })
    .catch(function (err) {
      resHndlr.sendError(res, err, req);
    });
});




module.exports = router;
