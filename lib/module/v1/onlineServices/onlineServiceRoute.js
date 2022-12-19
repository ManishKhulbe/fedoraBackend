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
    [middleware.authenticate.autntctTkn ,validators.validateApplyService],
    function (req, res) {
      var { serviceId, remark ,orderDate,timeSlot,addressId,amount,accountId,duration ,optionActionType} = req.body;
      let { userType, userId } = req.user;
      onlineServiceFacade
        .apply({
          serviceId,
          userId,
          remark,
          userType,orderDate,timeSlot,addressId,amount,accountId,duration ,optionActionType
        })
        .then(function (result) {
          resHndlr.sendSuccess(res, result, req);
        })
        .catch(function (err) {
          resHndlr.sendError(res, err, req);
        });
    }
  );
  // NmoxDAKItELqt4b3qtGl5ArwmpegfvOlspsHqvyfSzcUr0iNeWxNwdiZlbq9brd4
  // 637dedd63e4b695087b82008

  router
  .route("/applyFedoraCash")
  .post(
    [middleware.authenticate.autntctTkn],
    function (req, res) {
      var { serviceId, remark ,amount , accountNumber} = req.body;
      let { userType, userId } = req.user;
      onlineServiceFacade
        .applyFedoraCash({
          serviceId,
          userId,
          remark,
          userType,amount,accountNumber
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
    let { serviceType ,status, search ,searchYear,searchMonth, searchDay,pageNo,count,sortType,sortField } = req.query;

    onlineServiceFacade
      .list({userType, userId,  serviceType ,status, search ,searchYear,searchMonth, searchDay,pageNo,count,sortType,sortField  })
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
    let { userType, userId } = req.user;
    let { serviceType ,status,pageNo,count,sortType,sortField ,optionActionType } = req.query;

    onlineServiceFacade
      .listByCustomer({userType, userId, serviceType ,status,pageNo,count,sortType,sortField ,optionActionType})
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
      serviceId,
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
        serviceId,
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
  // zp7tipfScpHKR856PHR0Gx8J785V5pwK3fTPlsICDbzeFzOhjeRuwwUZlbuatuu9
  // 639fe92b879395857b83b4fa
  router
  .route("/editByCustomer")
  .put([middleware.authenticate.autntctTkn ], function (req, res) {

    let { userType, userId } = req.user;
    let { 
        remark,
        status,
        onlineServiceId,
        orderDate,
        timeSlot
     } = req.body;

      onlineServiceFacade
      .editByCustomer({userType, userId ,
        remark,
        status,
        onlineServiceId,
        orderDate,
        timeSlot
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
   
    let { userType, userId } = req.user;
    let { onlineServicesId, isDeleted } = req.query;
    
    onlineServiceFacade
      .deleteService({ onlineServicesId, userType, userId, isDeleted })
      .then(function (result) {
        resHndlr.sendSuccess(res, result, req);
      })
      .catch(function (err) {
        resHndlr.sendError(res, err, req);
      });
  });

module.exports = router;
