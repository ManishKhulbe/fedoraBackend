"use strict";

//========================== Load Modules Start ===========================

//========================== Load External Module =========================

var sha256 = require('sha256');
var bcrypt = require('bcrypt');
var randomstring = require("randomstring");
const mongoose = require("mongoose");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const exceptions = require("./customException");
const constants = require('./constant');
//========================== Load Modules End =============================

//========================== Export Module Start ===========================


/**
 * return user home
 * @returns {*}
 */
function getUserHome() {
    return process.env.HOME || process.env.HOMEPATH;
}

function getNodeEnv() {
    return process.env.NODE_ENV;
}

/**
 * returns if email is valid or not
 * @returns {boolean}
 */
function isValidEmail(email) {
    var pattern = /(?=^.{1,40}$)^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z_][-a-z_]*(\.[-a-z_]+)*\.(com|edu|gov|info|net|org|in|[a-z][a-z]))?$/ ;
    return new RegExp(pattern).test(email);
}



/**
 * returns if zipCode is valid or not (for US only)
 * @returns {boolean}
 */
function isValidZipCode(zipcode) {
    var pattern = /^\d{5}(-\d{4})?$/;
    return new RegExp(pattern).test(zipcode);
}
/**
 * returns if zipCode is valid or not (for US only)
 * @returns {boolean}
 */
function createHashSHA256(pass) {
    return sha256(pass)
}

function objectIdConvert(pass) {
    return mongoose.Types.ObjectId(pass)
}
/**
 * returns random number for password
 * @returns {string}
 */
var getRandomPassword = function () {
    return getSHA256(Math.floor((Math.random() * 1000000000000) + 1));
};

let  generatePassword =() =>{
    const passwordLength = 8;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
    for (let i = 0, n = charset.length; i < passwordLength; ++i) {
      password += charset.charAt(Math.floor(Math.random() * n));
    }
    return password;
  }
  

var getSHA256 = function (val) {
    return sha256(val + "password");
};

var encryptHashPassword = function (password, salt) {
    return bcrypt.hashSync(password, salt);
}


var generateSaltAndHashForPassword = function (password) {
    var encryptPassword = {salt: "", hash: ""};
    encryptPassword['salt'] = bcrypt.genSaltSync(10);
    encryptPassword['hash'] = bcrypt.hashSync(password, encryptPassword['salt']);
    return encryptPassword;
}


/**
 *
 * @param string
 * @returns {boolean}
 */
var stringToBoolean = function (string) {
    switch (string.toLowerCase().trim()) {
        case "true":
        case "yes":
        case "1":
            return true;
        case "false":
        case "no":
        case "0":
        case null:
            return false;
        default:
            return Boolean(string);
    }
}


/**
 *
 * @returns {string}
 * get random 6 digit number
 * FIX ME: remove hard codeing
 * @private
 */
function getRandomOtp(){
    //Generate Random Number
    return randomstring.generate({
        charset: 'numeric',
        length : 4
    });
}

function getRandomOtpSix(){
    //Generate Random Number
    return randomstring.generate({
        charset: 'numeric',
        length : 4
    });
}

function isValidPhone(phone , verifyCountryCode ){
    var reExp = verifyCountryCode ? /^\+\d{6,16}$/ : /^\d{6,16}$/;
    return reExp.test(phone)
}

async function  sendBySms(phone, otp) {
    console.log(phone, otp)
    return await client.messages.create({
        to: `+91${phone}`,
        from: process.env.TWILIO_TWILIO_NUMBER,
        body: `Your  OTP is ${otp} , OTP is valid for only 3 min`,
    }).then((data)=>{
        return true
    })
    .catch((err)=>{
        console.log(err)
    })
}

async function  sendSmsToUser(phone, message) {
   
    return await client.messages.create({
        to: `+91${phone}`,
        from: process.env.TWILIO_TWILIO_NUMBER,
        body: message,
    }).then((data)=>{
        return true
    })
    .catch((err)=>{
        console.log(err)
    })
}

async function  sendAutoGenPasswordSms(phone, randomPassword) {
    console.log(phone, randomPassword)
    return await client.messages.create({
        to: `+91${phone}`,
        from: process.env.TWILIO_TWILIO_NUMBER,
        body: `Welcome to Fedora family , Your auto generated password is ${randomPassword} , you can change it after login.`,
    }).then((data)=>{
        return true
    })
    .catch((err)=>{
        console.log(err)
    })
}

function isAdmin(params){
console.log(params,">>>>>>>>userType")
    if(params == 1 )
    {
        return params;
    }
    else{
        throw exceptions.unauthorizedAccess(constants.MESSAGES.UNAUTHORIZED_ACCESS);
    }
}

function isSuperAdminAndAdminAndManager(params){
    console.log(params,">>>>>>>>userType")
        if(params == 1 || params == 3 || params == 4)
        {
            return params;
        }
        else{
            throw exceptions.unauthorizedAccess(constants.MESSAGES.UNAUTHORIZED_ACCESS);
        }
    }


function isSuperAdminAndAdmin(params){
    console.log(params,">>>>>>>>userType")
        if(params == 1 || params == 3)
        {
            return params;
        }
        else{
            throw exceptions.unauthorizedAccess(constants.MESSAGES.UNAUTHORIZED_ACCESS);
        }
    }

function isSuperAdminAndAdminAndManagerAndViewer(params){
    if(params == 1 || params == 3 || params == 5 || params == 4)
    {
        return params;
    }
    else{
        throw exceptions.unauthorizedAccess(constants.MESSAGES.UNAUTHORIZED_ACCESS);
    }
}
    
//check a string not contains integer
function isString(str) {
    return !/[0-9]/.test(str);
}

function isNumber(str) {
    return /[0-9]/.test(str);
}

//========================== Export Module Start ===========================

module.exports = {
    getUserHome, 
    getNodeEnv,
    isValidEmail,
    isValidZipCode,
    createHashSHA256,
    getRandomPassword,
    encryptHashPassword,
    generateSaltAndHashForPassword,
    stringToBoolean,
    getRandomOtp,
    isValidPhone,
    getRandomOtpSix,
    sendBySms,
    objectIdConvert,
    isAdmin,
    isString,
    isNumber,
    isSuperAdminAndAdminAndManager,
    isSuperAdminAndAdmin,
    isSuperAdminAndAdminAndManagerAndViewer,
    generatePassword,
    sendAutoGenPasswordSms,
    sendSmsToUser
};

//========================== Export Module End===========================
