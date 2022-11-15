var express     = require('express');
var router      = express.Router();

const userRoute     = require('./user/userRoute');
const accountRoute  = require('./account/accountRoute');
const customerAccountRoute = require('./customerAccount/customerAccountRoute')
const transactionRoute  = require('./transaction/transactionRoute');
const onlineServiceRoute = require('./onlineServices/onlineServiceRoute');
const benificiaryRoute = require('./beneficiary/beneficiaryRoute');
//========================== Export Module Start ==========================

//API version 1
router.use('/user', userRoute);
router.use('/account', accountRoute);
router.use('/customerAccount', customerAccountRoute);
router.use('/transaction', transactionRoute);
router.use('/onlineServices', onlineServiceRoute);
router.use('/benificiary' , benificiaryRoute)


module.exports = router;
//========================== Export Module End ============================