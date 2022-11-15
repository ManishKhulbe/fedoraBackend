const router = require("express").Router();
const requestIp = require("request-ip");

const resHndlr = require("../../../responseHandler");
const middleware = require("../../../middleware");
const constants = require("../../../constant");
const benificiaryFacade = require("./beneficiaryFacade");
const validators = require("./beneficiaryValidators");

// const constant = require("../../../constant");
//==============================================================
// validators.validateTransaction

router.route('/list')
    .get([middleware.authenticate.autntctTkn], function (req, res) {
        let {userId, userType} = req.user
        let {senderUserID,receiverUserID,count,pageNo } = req.query
        benificiaryFacade.list({senderUserID,receiverUserID,count,pageNo ,userId, userType})
            .then(function (result) {
                resHndlr.sendSuccess(res, result, req)
            }).catch(function (err) {
            resHndlr.sendError(res, err, req)
        })
    });

module.exports = router;
