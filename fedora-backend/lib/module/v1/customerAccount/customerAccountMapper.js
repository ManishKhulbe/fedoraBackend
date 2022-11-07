/**
 * This file will have request and response object mappings.
 */
var _ = require("lodash");
const contstants = require("../../../constant");
const config = require("../../../config");

function createMapping(params) {
  var respObj = {
    message: "Created Successfully",
    UserDetails: {
      params,
      //   accountId : params._id ,
      //    accountType: params.accountType,
      //    accountInterestRate: params.accountInterestRate,
      //    accountOverdraft: params.accountOverdraft,
      //    accountLastAccessTime: params.accountLastAccessTime,
    },
  };
  return respObj;
}

function accountListMapping(result0, result1, params) {
  console.log(params);
  return {AccountDetails : result0, TotalAccount : result1};
}

module.exports = {
  createMapping,
  accountListMapping,
};
