// Importing mongoose
var mongoose = require("mongoose");
var constants = require("../../../constant");

var Schema = mongoose.Schema;
var User;

var UserSchema = new Schema(
  {
    name: {
      type: String,
      default: "",
    },
    mobileNo: {
      type: String,
      index: true,
    },
    email: {
      type: String,
    },
    mPIN: {
      type: String,
      default: "",
    },
    membershipId: {
      type: String,
    },
    accountNumber: {
      type: String,
    },
    userType: {
      type: Number,
      default: 2, /// 1 -SuperAdmin ,2-normal User 3-Admin 4-Manager 5- viewer
    },
    deviceToken: {
      type: String,
      default: "",
    },
    deviceID: {
      type: String,
      default: "",
    },
    deviceTypeId: {
      type: Number,
      default: 1, //1 iOS , 2 android , 3 web
      min: 1,
      max: 3,
    },
    status: {
      type: Number, //active 1 , inactive 2
      default: 1,
    },
    isDelete: {
      type: Number, //1 soft 2 hard
      default: 0,
    },
    created: {
      type: Date,
      default: Date.now,
    },
    updated: {
      type: Date,
    },
    profileImage: {
      type: String,
      default: "",
    },
    accountId: {
      type: Schema.Types.ObjectId,
      ref: constants.DB_MODEL_REF.ACCOUNT,
      index: true,
    },
    isAdmin: {
      type: Number,
      default: 0,
    },
    password: {
      type: String,
      default: "",
    },
    platform: {
      type: Number, // ANDROID: 1,IOS: 2, WEB:3
      default: 3,
      min: 1,
      max: 3,
    },
    allotedStocks: {
      type: Number,
      default: 0,
    },
    isRegister: {
      type: Number, // 0 -redister not done , 1- register done
      default: 0,
    },
    beneficiary: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: constants.DB_MODEL_REF.USER,
          unique: true,
        },
        accountType: {
          type: Number,
          ref: constants.DB_MODEL_REF.ACCOUNT,
          unique: true,
        },
        accountNumber: { type: String, unique: true },
      },
    ],
    gender: {
      type: Number,
      default: 0, //0 Undefined, 1 Male, 2 Female, 3 Others
      min: 0,
      max: 3,
    },
    dob: {
      type: String,
      default: " ",
    },

    address : [
      {
        addressLine1: { type: String ,default: " "},
        addressLine2: { type: String , default: " "},
        city: { type: String , default: " "},
        state: { type: String , default: " " },
        country: { type: String, default: " " },
        zipCode: { type: String,default: " " },
        addressType: { type: Number, default: 0 }, // 0 - home, 1 - office , 2 - other
      }
    ]
  },
  { timestamps: true }
);

//Export user module
User = module.exports = mongoose.model(constants.DB_MODEL_REF.USER, UserSchema);
