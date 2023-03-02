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
        PhoneNumber: phone,
        
    };
    sns.publish(params, function (err, data) {
        if(data){
            return true;
        }
        if (err) {
            console.error("Error sending SMS: " + err.stack);
            return;
        }
        console.log("SMS sent! Message ID: " + data.MessageId);
    });
}

// ========================== Export Module Start ==========================
module.exports = {
    sendSms
}
// ========================== Export Module End ============================