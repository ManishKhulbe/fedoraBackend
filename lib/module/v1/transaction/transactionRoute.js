const router = require("express").Router();
const requestIp = require("request-ip");

const resHndlr = require("../../../responseHandler");
const middleware = require("../../../middleware");
const constants = require("../../../constant");
const transactionFacade = require("./transactionFacade");
const validators = require("./transactionValidators");

// const constant = require("../../../constant");
//==============================================================
// validators.validateTransaction
router.route('/listByUser')
    .get([middleware.authenticate.autntctTkn], function (req, res) {
        let {userId, userType} = req.user
        let {accountNumber,count,pageNo } = req.query
        transactionFacade.getTransactions({userId, userType, accountNumber ,pageNo ,count})
            .then(function (result) {
                resHndlr.sendSuccess(res, result, req)
            }).catch(function (err) {
            resHndlr.sendError(res, err, req)
        })
    });

    router.route('/listByAdmin')
    .get([middleware.authenticate.autntctTkn], function (req, res) {
        let {userId, userType} = req.user
        console.log(req.query ,"vvv")
        let {search,status,searchDate,searchYear,searchMonth,searchDay,sortType,sortField,count,pageNo } = req.query
        transactionFacade.listByAdmin({userId,status ,userType, search,searchDate,searchYear,searchMonth,searchDay,sortType,sortField ,pageNo ,count})
            .then(function (result) {
                resHndlr.sendSuccess(res, result, req)
            }).catch(function (err) {
            resHndlr.sendError(res, err, req)
        })
    });

module.exports = router;
