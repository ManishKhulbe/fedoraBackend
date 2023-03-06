'use strict';
//========================== Load External modules ====================
var AWS = require('aws-sdk');

//========================== Load internal modules ====================
const config = require('../config');

AWS.config = {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: 'ap-south-1',
};

var sns = new AWS.SNS();

//========================== Load Modules End ==============================================

function sendSms(phone ,message ) {
    
    var params = {
        Message:message,
        PhoneNumber: `+91${phone}`,
        
    };
  
    sns.publish(params, function (err, data) {
        if (err) {
            console.log(err, err.stack);
            return err;
        }
        else {
            console.log(data);
            return data;
        }
    });
}

// ========================== Export Module Start ==========================
module.exports = {
    sendSms
}
// ========================== Export Module End ============================