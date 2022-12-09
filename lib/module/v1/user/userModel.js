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
      type: Number,
    },
    userType: {
      type: Number,
      default: 2, /// 1 -SuperAdmin ,2-normal User 3-Admin 4-Manager 5- viewer
    },
    deviceToken: {
      type: String,
      default :""
    },
    deviceID: {
      type: String,
      default :""
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
          index: true,
          unique: true,
        },
        accountType: {
          type: Number,
          ref: constants.DB_MODEL_REF.ACCOUNT,
          index: true,
          unique: true,
        },
        accountNumber: { type: String ,  unique: true,},
        // isDeleted :{
        //  type : Number,
        //  default : 0  //0 - not deleted , 1 - deleted
        // }
      },
    ], // for benificiary details
    // gender: {
    //     type: Number,
    //     default: 0, //0 Undefined, 1 Male, 2 Female, 3 Others
    //     min :0,
    //     max:3
    // },
    // dob: {
    //     type: String,
    // },
    // designation: {
    //     type: String,
    // },
    // companyName: {
    //     type: String,
    // },
    // employeeId: {
    //     type: String,
    // },
    // aboutUs: {
    //     type: String,
    // },
    // profileImage: {
    //     type: String,
    // },
    // profileImageData:{},
    // workEmail: {
    //     type: String,
    // },
    // phoneNo: {
    //     type: String,
    // },
    // whatsApp: {
    //     type: String,
    // },
    // skype:{
    //     type: String,
    // },
    // website: {
    //     type: String,
    // },
    // instagram: {
    //     type: String,
    // },
    // facebook: {
    //     type: String,
    // },
    // linkedin: {
    //     type: String,
    // },
    // twitter: {
    //     type: String,
    // },
    // googleMap:{
    //     type: String,
    // },
    // hangouts:{
    //     type: String,
    // },
    // youtube:{
    //     type: String,
    // },
    // snapchat:{
    //     type: String,
    // },
    // tiktok:{
    //     type: String,
    // },
    // pinterest:{
    //     type: String,
    // },
    // github:{
    //     type: String,
    // },
    // npm:{
    //     type: String,
    // },
    // stackoverflow:{
    // type: String,
    // },
  },
  { timestamps: true }
);

//Export user module
User = module.exports = mongoose.model(constants.DB_MODEL_REF.USER, UserSchema);
