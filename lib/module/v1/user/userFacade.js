"use strict";

//========================== Load Modules Start =======================

//========================== Load external modules ====================
// Load user service
var _ = require("lodash");
var Promise = require("bluebird");
var ip = require("ip");
var vCardsJS = require("vcards-js");
//========================== Load internal modules ====================

const usrService = require("./userService");
const userMapper = require("./userMapper");

const appUtils = require("../../../appUtils");
const redisSession = require("../../../redisClient/session");
const redisClient = require("../../../redisClient/init");
const customException = require("../../../customException");
const emailService = require("../../../service/sendgrid_email");
const nodemailer = require("../../../service/nodemailer_email");
const constant = require("../../../constant");
const config = require("../../../config");
const { param } = require("./userRoute");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);
var Promise = require("bluebird");
const { SharedCostPage } = require("twilio/lib/rest/api/v2010/account/availablePhoneNumber/sharedCost");

//========================== Load Modules End ==============================================

function register(params) {
  let self = this;
  return usrService
    .isRegistrationExists(params)
    .bind({})
    .then(function (isExist) {
      self.isExist = isExist;
      if (!isExist) {
        throw customException.registrationNotExists();
      }
      console.log(isExist, "XXXXXXXXXXXXXXXXxx");
      //remove gap from name
      let nameTest = params.name.replace(/\s+/g, "");
      let nameFromDb = isExist.name.replace(/\s+/g, "");
      //transform name to lower case
      let nameTestToLower = nameTest.toLowerCase();
      let nameFromDbToLower = nameFromDb.toLowerCase();
      console.log(nameTestToLower, "nameTestToLower", nameFromDbToLower);
      if (nameTestToLower != nameFromDbToLower) {
        throw customException.enteredNameNotExists();
      }
      return usrService.isAccountNumberExists(params, isExist);
    })
    .then((isExists) => {
      console.log(isExists, "isExists");
      if (!isExists) {
        throw customException.accountNumberNotExists();
      }
      console.log(
        self.isExist.isRegister,
        "this.isExist.isRegisterxxxxxxxxxxxxxx"
      );
      if (this.isExist.isRegister == 1) {
        throw customException.alreadyRegisteredUser();
      }
      let otp = appUtils.getRandomOtp();
      let payload = {
        email: self.isExist.email,
        subject: " Registration OTP mail from FEDORA ",
        template: "otpRegistration",
        otp,
        name: params.name,
      };
      self.payload = payload;
      let userObj = {
        customerId: isExists.customerId,
        mobileNo: params.mobileNo,
        params,
        otp,
      };

      return redisClient.setCommonOTPValue(otp, userObj);
    })
    .bind({})
    .then(function (data) {
      console.log(data, ">>>>>");
      if (data) {
        return appUtils
          .sendSmsToUser(params.mobileNo, `Dear ${params.name}, your verification OTP for registering on our app is: ${self.payload.otp}. This code will expire in 3 minutes. Thank you for choosing our service. -  FEDORA INDIA`)
          .then((data) => {
            if (data) {
              return userMapper.otpSentMapping();
            }
            return emailService.sendOtpMail(self.payload);
          })
          .then(function (data) {
            return userMapper.otpSentMapping();
          });
      }
    })
    .catch(function (err) {
      throw err;
    });
}

function updateDeviceToken(params) {
  return usrService.updateDeviceToken(params).then((result) => {
    return userMapper.deviceTokenUpdateMapper(result);
  });
}

async function validateOtp(params) {
  return await redisClient
    .OTPexists(params)
    .then((isExist) => {
      console.log(isExist, ">>><<<isExist");
      if (isExist) {
        return redisClient.getOtpValue(params);
      } else {
        throw customException.otpExpired();
      }
    })
    .then((userData) => {
      let finalUserData = JSON.parse(userData);
      console.log(finalUserData, "finalUserDatafinalUserDatafinalUserData");
      if (finalUserData.otp != params.otp) {
        throw customException.invalidOtp();
      }
      return usrService.getUserByID(finalUserData.customerId);
    })
    .then((user) => {
      console.log(user, "mm");
      let tokenObj = _buildUserTokenGenObj(user);
      let userObj = {
        userId: user._id.toString(),
        userObj: tokenObj,
        IP: ip.address(),
        expTime: 31622400,
      };
      return redisSession.create(userObj).then(function (redisSession) {
        return redisClient
          .setValue(tokenObj.mobileNo, redisSession)
          .then(() => {
            return userMapper.registerMapping({
              redisSession: redisSession.token,
              user: user,
            });
          });
      });
    });
}

function createMpin(params) {
  console.log(params, "MMMMMMMMMMMMMMMMMMMMM");
  params.mPin = appUtils.createHashSHA256(params.mPin);

  return usrService
    .createMpin(params)
    .then((data) => {
      return userMapper.mPinCreatedMapping(data);
    })
    .catch(function (err) {
      throw err;
    });
}

function userLogin(params) {
  return usrService
    .isUserIdExist(params)
    .bind({})
    .then(function (isExist) {
      console.log(isExist);
      this.isExist = isExist;
      if (isExist) {
        return usrService.login(params);
      } else {
        throw customException.userNotFound();
      }
    })
    .then(function (response) {
      if (response) {
        return userMapper.loginMapping(response);
      } else {
        throw customException.incorrectPass();
      }
    });
}

function validateMPin(params) {
  return usrService
    .isUserIdExist(params)
    .bind({})
    .then(function (isExist) {
      console.log(isExist);
      this.isExist = isExist;
      if (isExist) {
        return usrService.validateMPin(params);
      } else {
        throw customException.userNotFound();
      }
    })
    .then(function (response) {
      if (response) {
        return userMapper.loginMapping(response);
      } else {
        throw customException.incorrectPass();
      }
    });
}

function editUser(params) {
  params.userType = appUtils.isAdmin(params.userType);
  return usrService
    .isCustomerIdExist(params)
    .bind({})
    .then(async function (isExist) {
      console.log(isExist);
      this.isExist = isExist;
      if (isExist) {
        if (params.mobileNo) {
          let mobileNumberExist = await usrService.isMobileNumberExist(params);
          if (mobileNumberExist) {
            throw customException.alreadyRegisteredMobileNo();
          }
        }
        if (params.membershipId) {
          let memberShipIdExists = await usrService.isMembershipIdExists(
            params
          );
          if (memberShipIdExists) {
            throw customException.alreadyRegisteredMemberId();
          }
        }

        return usrService.editUser(params);
      } else {
        throw customException.userNotFound();
      }
    })
    .then(async function (response) {
      // return redisSession.expireByUserId(params.customerId)
      if (response.status == 2) {
        let userMobileNo = response.mobileNo;
        await redisClient.getValue(userMobileNo).then(async (data) => {
          console.log(data, "data");
          if (data) {
            let redisSession1 = JSON.parse(data);
            // console.log(redisSession,"redisSession")
            await redisSession.expire(redisSession1.token);
            await redisClient.deleteKey(userMobileNo);
          }
        });
      }
      if (response) {
        return userMapper.editUserMapping(response);
      } else {
        throw customException.addressTypeNotExists();
      }
    });
}

function editUserAddress(params) {
  params.userType = appUtils.isAdmin(params.userType);
  return usrService.editUserAddress(params).then(function (isExist) {
    if (!isExist) {
      throw customException.addressTypeNotExists();
    }
    return userMapper.editUserMapping(isExist);
  });
}
function userFirstLogin(params) {
  let self = this;
  return usrService
    .isMobileNumberExist(params)
    .bind({})
    .then(function (isExist) {
      console.log(isExist);
      self.isExist = isExist;
      if (isExist) {
        return usrService.login(params);
      } else {
        throw customException.notRegisteredMobileNo();
      }
    })
    .then(function (response) {
      if (response) {
        let tokenObj = _buildUserTokenGenObj(response);
        self.user = response;
        let userObj = {
          userId: response._id.toString(),
          userObj: tokenObj,
          IP: ip.address(),
          expTime: 31622400,
        };
        return redisClient.getValue(self.isExist.mobileNo).then((userToken) => {
          let prevTokenObj = JSON.parse(userToken);
          // console.log(prevTokenObj, "<<<<<<<<<<<<<<<<<<<previousToken ");
          if (prevTokenObj) {
            redisSession.expire(prevTokenObj.token);
          }
          return redisSession.create(userObj).then(function (redisSession) {
            return redisClient
              .setValue(tokenObj.mobileNo, redisSession)
              .then(() => {
                return userMapper.firstLoginMapping({
                  redisSession: redisSession.token,
                  user: self.user,
                });
              });
          });
        })
      } else {
        throw customException.incorrectPass();
      }
    });
}

function forgetPin(params) {
  let self = this;
  return usrService.isMobileNumberExist(params).then((isExist) => {
    if (isExist) {
      console.log(isExist);
      let otp = appUtils.getRandomOtp();
      let payload = {
        email: isExist.email,
        subject: " Forget Password OTP mail from FEDORA ",
        template: "otpRegistration",
        otp,
        name: isExist.name,
      };
      self.payload = payload;
      let userObj = {
        customerId: isExist._id,
        status: isExist.status,
        userType: isExist.userType,
        params,
        otp,
      };
      console.log(userObj, "userObj");
      return redisClient.setCommonOTPValue(otp, userObj).then(function (data) {
        if (data) {
          return appUtils
          .sendSmsToUser(params.mobileNo, `${self.payload.otp} is your secret One Time Password (OTP). Please do not share it
          with anyone , This OTP will expire in 3 minutes.  FEDORA IN, HO-DIT`)
            .then((data) => {
              console.log("twilio", data);
              if (data) {
                return userMapper.otpSentMapping();
              }
              return emailService
                .sendOtpMail(self.payload)
                .then(function (data) {
                  return userMapper.otpSentMapping();
                });
            });
        }
      });
    } else {
      throw customException.notRegisteredMobileNo();
    }
  });
}

async function commonValidateOtp(params) {
  let self = this;

  return await redisClient.getComOtpValue(params).then(async (userdata) => {
    if (!userdata) {
      throw customException.otpExpired();
    }
    let finalUserData = JSON.parse(userdata);
    self.finalUserData = finalUserData;
    console.log(finalUserData, "finalUserData");
    if (finalUserData.otp != params.otp) {
      throw customException.invalidOtp();
    }
    let userData = await usrService.getUserByID(finalUserData.customerId);
    let tokenObj = _buildUserTokenGenObj(userData);
    let userObj = {
      userId: userData._id.toString(),
      userObj: tokenObj,
      IP: ip.address(),
      expTime: 31622400,
    };
    console.log(userObj, "userObj");
    return redisSession.create(userObj).then(function (redisToken) {
      self.redisToken = redisToken;
      let mobileNo = userData.mobileNo;
      self.mobileNo = mobileNo;
      return redisClient.getValue(mobileNo).then((userToken) => {
        let prevTokenObj = JSON.parse(userToken);
        console.log(prevTokenObj, "<<<<<<<<<<<<<<<<<<<previousToken ");
        if (prevTokenObj) {
          redisSession.expire(prevTokenObj.token);
        }

        return redisClient
          .setValue(self.mobileNo, self.redisToken)
          .then((data) => {
            console.log(data, "MMMMMMMMMMMMAnewwwww");
            if (data) {
              return userMapper.otpMatchSuccessfullyMapping({
                redisSession: self.redisToken,
                user: userData,
              });
            }
          });
      });
    });
  });
}
async function validateForgetPinOtp(params) {
  let self = this;

  return await redisClient.ForgetOTPexists(params).then((isExist) => {
    console.log(isExist, ">>><<<isExist");
    if (isExist) {
      return redisClient.getForgetOtpValue(params).then((userdata) => {
        let finalUserData = JSON.parse(userdata);
        self.finalUserData = finalUserData;
        console.log(finalUserData, "finalUserData");
        if (finalUserData.otp != params.otp) {
          throw customException.invalidOtp();
        }
        let tokenObj = _buildUserTokenGenObj1(finalUserData);
        let userObj = {
          userId: finalUserData.userId,
          userObj: tokenObj,
          IP: ip.address(),
          expTime: 31622400,
        };
        return redisSession.create(userObj).then(function (redisToken) {
          self.redisToken = redisToken;
          let mobileNo = self.finalUserData.params.mobileNo;
          self.mobileNo = mobileNo;
          return redisClient.getValue(mobileNo).then((userToken) => {
            let prevTokenObj = JSON.parse(userToken);
            console.log(prevTokenObj, "<<<<<<<<<<<<<<<<<<<previousToken ");
            return redisSession.expire(prevTokenObj.token).then((result) => {
              if (result) {
                return redisClient
                  .setValue(self.mobileNo, self.redisToken)
                  .then((data) => {
                    console.log(data, "MMMMMMMMMMMMAnewwwww");
                    if (data) {
                      return userMapper.otpMatchSuccessfullyMapping(
                        self.finalUserData,
                        self.redisToken
                      );
                    }
                  });
              }
            });
          });
        });
      });
    } else {
      throw customException.otpExpired();
    }
  });
}

function _buildUserTokenGenObj(user) {
  var userObj = {};
  userObj.deviceToken = user.deviceToken ? user.deviceToken : null;
  userObj.deviceTypeID = user.deviceTypeID ? user.deviceTypeID : null;
  userObj.deviceID = user.deviceID ? user.deviceID : null;
  userObj.userId = user._id.toString();
  userObj.userType = user.userType;
  userObj.status = user.status;
  userObj.mobileNo = user.mobileNo ? user.mobileNo : null;
  return userObj;
}
function _buildUserTokenGenObj1(user) {
  // console.log(user,"userObj")
  var userObj = {};
  userObj.deviceToken = user.deviceToken ? user.deviceToken : null;
  userObj.deviceTypeID = user.deviceTypeID ? user.deviceTypeID : null;
  userObj.deviceID = user.deviceID ? user.deviceID : null;
  userObj.userId = user.userId.toString();
  userObj.userType = user.userType ? user.userType : null;
  userObj.status = user.status;
  return userObj;
}
function _buildUserTokenGenObj2(user) {
  let userObj = {};
  userObj.deviceToken = user.deviceToken ? user.deviceToken : null;
  userObj.deviceTypeID = user.deviceTypeID ? user.deviceTypeID : null;
  userObj.deviceID = user.deviceID ? user.deviceID : null;
  userObj.userId = user._id.toString();
  userObj.userType = user.userType ? user.userType : null;
  userObj.status = user.status;
  userObj.mobileNo = user.mobileNo;
  return userObj;
}

function editProfileImage(params) {
  return usrService
    .editProfileImage(params)
    .then((data) => {
      return userMapper.editProfileImageMapping(data);
    })
    .catch(function (err) {
      throw err;
    });
}

function addUser(params) {
  let self = this;
  params.userType = appUtils.isAdmin(params.userType);
  return usrService
    .isMobileNumberExists(params)
    .bind({})
    .then(async function (isNumberExist) {
      console.log(isNumberExist, "isNumberExist");
      if (isNumberExist) {
        throw customException.alreadyRegistered();
      }
      if (params.UserType == 2) {
        let sequenceKey = await  usrService.isSequenceExists();
        if(!sequenceKey){
          throw customException.sequenceKeyNotFound();
        }
  
        console.log(sequenceKey, "sequenceKeysequenceKey");
        let updatedSequenceKey = +sequenceKey?.sequenceKey + 1;
        return usrService.setSequenceKey("sequenceKey", updatedSequenceKey)
          .then((res) => {
            if(!res){
              throw customException.unableToUpdateSequence();
            }
            if (params.UserType == 2) {
              if (updatedSequenceKey < 10) {
                params.membershipId = `FED-000${updatedSequenceKey}`;
              } else if (updatedSequenceKey < 100) {
                params.membershipId = `FED-00${updatedSequenceKey}`;
              } else if (updatedSequenceKey < 1000) {
                params.membershipId = `FED-0${updatedSequenceKey}`;
              } else {
                params.membershipId = `FED-${updatedSequenceKey}`;
              }
            }
            if (res) {
              return usrService.addUser(params).then(function (result) {
                console.log(result);
                return userMapper.addUserMapping(result);
              });
            }
          });
      } else {
        const randomPassword = appUtils.generatePassword();
        self.randomPassword = randomPassword;
        params.password = randomPassword;
      }
      return usrService.addUser(params).then(function (result) {
        
        if (params.UserType == 2) {
          return userMapper.addUserMapping(result);
        } else {
          return appUtils
            .sendAutoGenPasswordSms(result.mobileNo, self.randomPassword)
            .then((data) => {
              console.log("twilio", data);
              if (data) {
                return userMapper.addUserMapping(result);
              }else{
                let payload = {
                  email: result.email,
                  subject: "WELCOME TO FEDORA FAMILY",
                  template: "welcomeMail",
                  name: result.name,
                  randomPassword: self.randomPassword,
                };
                return emailService.welcomeMail(payload).then((res) => {
                  if(!res){
                    throw customException.notAbleToSendMail()
                  }
                  return userMapper.addUserMapping(result);
                });
              }
            })
          }
      });
    });
}

function userList(params) {
  params.userType = appUtils.isSuperAdminAndAdminAndManagerAndViewer(
    params.userType
  );

  const userList = usrService.usersList(params);
  const totalUserCount = usrService.totalNoOfUsers(params);
  const totalActiveCount = usrService.totalNoOfActiveUsers(params);
  const totalInActiveCount = usrService.totalNoOfInactiveUsers(params);

  return Promise.all([
    userList,
    totalUserCount,
    totalActiveCount,
    totalInActiveCount,
  ]).then(function (result) {
    return userMapper.userListMapping(
      result[0],
      result[1],
      result[2],
      result[3],
      params
    );
  });
}

function deleteUser(params) {
  params.userType = appUtils.isAdmin(params.userType);
  return usrService.deleteUser(params).then(function (result) {
    if (result) {
      return userMapper.deleteUserMapping(result, params);
    }
  });
}
function deleteBeneficiary(params) {
  return usrService.deleteBeneficiary(params).then(function (result) {
    if (result) {
      return userMapper.deleteUserMapping(result, params);
    }
  });
}

function loginAsAdmin(loginInfo) {
  let self = this;
  return usrService
    .isEmailIdExist(loginInfo)
    .bind({})
    .then(function (user) {
      self.user = user;
      if (user) {
        if (user.userType == 2) {
          throw customException.userRegisteredAsUser();
        }
        return usrService.loginAsAdmin(user, loginInfo);
      } else {
        throw customException.notRegisteredEmail();
      }
    })
    .then(function (response) {
      console.log(self.user, "MM");

      if (response) {
        let tokenObj = _buildUserTokenGenObj(self.user);
        let userObj = {
          userId: self.user._id.toString(),
          userObj: tokenObj,
          IP: ip.address(),
          expTime: 31622400,
        };
        return redisSession.create(userObj).then(function (redisSession) {
          return userMapper.loginAsAdminMapping({
            redisSession: redisSession.token,
            user: self.user,
          });
        });
      } else {
        throw customException.incorrectPassword();
      }
    });
}

function logout(params) {
  console.log(params, "PPPPPPPPPPPPPPPPPPP");

  return redisSession
    .expire(params.acsToken)
    .then(function (result) {
      let update = {};
      update.userId = params.userId;
      update.deviceToken = "";
      update.platform = 3;
      usrService.updateDeviceInfo(update);
    })
    .then(function (result) {
      // remove key from redis
      if (result) {
        return redisClient.deleteValue(params.mobileNo);
      }
    })
    .then((result) => {
      return userMapper.logOutMapping(params);
    });
}

function forgotPassword(params) {
  console.log(params, "VVVCC");
  let self = this;
  return usrService.isEmailIdExist(params).then(function (isExist) {
    if (!isExist) {
      throw customException.emailNotExists();
    }
    console.log(isExist, "isExist");
    if (isExist.status == 2) {
      throw customException.inactiveUser();
    }

    let otp = appUtils.getRandomOtpSix();
 
    let userObj = {
      userId: isExist._id,
      status: isExist.status,
      userType: isExist.userType,
      params,
      otp,
    };
  
    return redisClient.setOTPValue1(otp, userObj).then(function (data) {
      if (data) {
          let message = `Hello ${isExist.name},  ${otp} is your secret One Time Password (OTP). Please do not share it
          with anyone , This OTP will expire in 3 minutes.  FEDORA IN, HO-DIT `
          return appUtils
              .sendSmsToUser(isExist.mobileNo, message).then(function (data) {
            if (data) {
              return userMapper.otpSentMapping();
            }
            throw customException.unableToSentOtp();
          });
      }
    });
  });
}

function validateForgetPassOtp(params) {
  let key = params.otp + params.email;
  return redisClient.getForgetPassOtpValue(params).then(function (data) {
    if (data) {
      let userObj = JSON.parse(data);
      console.log(userObj, "d");
      if (userObj.otp == params.otp) {
        return usrService
          .getUserByID(userObj.userId)
          .then(function (userDetails) {
            let tokenObj = _buildUserTokenGenObj2(userDetails);

            let userObj = {
              userId: tokenObj.userId.toString(),
              userObj: tokenObj,
              IP: ip.address(),
              expTime: 31622400,
            };

            return redisSession.create(userObj).then(function (redisToken) {
              console.log(redisToken, "userDetails");
              return userMapper.validateForgetPassOtpMapping(
                userObj,
                redisToken
              );
            });
          });
      } else {
        throw customException.invalidOtp();
      }
    } else {
      throw customException.otpExpired();
    }
  });
}

function resetPassword(params) {
  return usrService.resetPassword(params).then(function (data) {
    if (data) {
      return userMapper.resetPasswordMapping(data);
    }
  });
}

function getAdminDashBoard(params) {
  params.userType = appUtils.isSuperAdminAndAdminAndManagerAndViewer(
    params.userType
  );
  const totalNoOfUser = usrService.totalNoOfUsers(params);
  const totalNoOfAccount = usrService.totalNoOfAccounts(params);
  const totalNoOfAccountByType = usrService.totalNoOfAccountByType(params);
  const pendingOnlineServices = usrService.pendingOnlineServices(params);
  const pendingOnlineServicesByType =
    usrService.pendingOnlineServicesByType(params);
    const pendingGrievance = usrService.pendingGrievance(params);

  return Promise.all([
    totalNoOfUser,
    totalNoOfAccount,
    totalNoOfAccountByType,
    pendingOnlineServices,
    pendingOnlineServicesByType,
    pendingGrievance
  ]).then(function (result) {
    //     result = result.map((item) => {
    // // console.log(item._settledValueField)
    // console.log(item ,"MMMM")
    //     })
    // console.log(result[0]._settledValueField)
    return userMapper.getAdminDashBoardMapping(
      result[0],
      result[1],
      result[2],
      result[3],
      result[4],
      result[5]
    );
  });
}

function getUserDashBoard(params) {
  const totalDeposit = usrService.totalDeposit(params);
  const totalLoan = usrService.totalLoan(params);

  return Promise.all([totalDeposit, totalLoan]).then(function (result) {
    return userMapper.getUserDashBoardMapping(result[0], result[1], params);
  });
}

function totalNoOfUsers(params) {
  params.userType = appUtils.isAdmin(params.userType);
  return usrService.totalNoOfUsers(params).then(function (data) {
    if (data) {
      return userMapper.totalNoOfMapping(data, "users");
    } else {
      throw customException.noDataFound();
    }
  });
}

function totalNoOfAccount(params) {
  params.userType = appUtils.isAdmin(params.userType);
  return usrService.totalNoOfAccounts(params).then(function (data) {
    if (data) {
      return userMapper.totalNoOfMapping(data, "accounts");
    } else {
      throw customException.noDataFound();
    }
  });
}

function totalNoOfAccountByType(params) {
  params.userType = appUtils.isAdmin(params.userType);
  return usrService.totalNoOfAccountByType(params).then(function (data) {
    if (data) {
      return userMapper.totalNoOfMapping(data, "accounts  by Type ");
    } else {
      throw customException.noDataFound();
    }
  });
}

function pendingOnlineServices(params) {
  params.userType = appUtils.isAdmin(params.userType);
  return usrService.pendingOnlineServices(params).then(function (data) {
    if (data) {
      return userMapper.totalNoOfMapping(data, "pending Online services");
    } else {
      throw customException.noDataFound();
    }
  });
}
function addSharePrice(params) {
  params.userType = appUtils.isAdmin(params.userType);
  let isSharesExists = usrService.isSharesExists(params);
  if(!isSharesExists){
    throw customException.sharesExists();
  }
  return usrService.addSharePrice(params).then(function (data) {
    if (data) {
      return userMapper.sharePriceMapping(data);
    } else {
      throw customException.noDataFound();
    }
  });
}
function editSharePrice(params) {
  params.userType = appUtils.isAdmin(params.userType);
  return usrService.editSharePrice(params).then(function (data) {
    if (data) {
      return userMapper.editSharePriceMapping(data);
    } else {
      throw customException.noDataFound();
    }
  });
}
function getSharePrice(params) {
  // params.userType = appUtils.isSuperAdminAndAdminAndManagerAndViewer(params.userType);
  // params.userType = appUtils.isAdmin(params.userType);
  return usrService.getSharePrice(params).then(function (data) {
    if (data) {
      return userMapper.getSharePriceMapping(data);
    } else {
      throw customException.noDataFound();
    }
  });
}

function userDetails(params) {
  return usrService.userDetails(params).then(async function (data) {
    let accountDetails = await usrService.accountDetails(params);
    if (data) {
      return userMapper.getUserDetailsMapping(data, accountDetails);
    } else {
      throw customException.noDataFound();
    }
  });
}
function getUserBeneficiary(params) {
  return usrService.getUserBeneficiary(params).then(function (data) {
    if (data) {
      return userMapper.getUserBeneficiaryMapping(data);
    } else {
      throw customException.noDataFound();
    }
  });
}

async function addOtherBankDetails(params) {
  params.userType = appUtils.isAdmin(params.userType);
  let sameOtherBankAccount = await usrService.sameOtherBankAccount(params);
  if (!sameOtherBankAccount) {
    throw customException.sameOtherBankAccount();
  }
  return usrService.addOtherBankDetails(params).then(function (data) {
    if (data) {
      return userMapper.addOtherBankDetailsMapping(data);
    } else {
      throw customException.noDataFound();
    }
  });
}

async function deleteOtherBankDetails(params) {
  console.log(
    "🚀 ~ file: userFacade.js:948 ~ deleteOtherBankDetails ~ params",
    params
  );
  params.userType = appUtils.isAdmin(params.userType);

  return usrService.deleteOtherBankDetails(params).then(function (data) {
    if (data) {
      return userMapper.deleteOtherBankDetailsMapping(data);
    } else {
      throw customException.noDataFound();
    }
  });
}

function setTxnLimit(params) {
  return usrService.setTxnLimit(params).then((res) => {
    return userMapper.setTxnLimitMapping(res);
  });
}

 function editSequenceKeyInRedis(params){

  return redisClient
  .setSequenceNumber(params.redisKeyName, params.value).then(async(data)=>{
    console.log(data)
    if(data){
let updatedRedisKey = await redisClient.getSequenceNumber(params.redisKeyName)
      return userMapper.editSequenceKeyInRedisMapping(updatedRedisKey);
    }else{
      return data
    }
  })
}

function addSequence(params) {
  params.userType = appUtils.isAdmin(params.userType);

  let isSequenceExists = usrService.isSequenceExists(params);
  if(isSequenceExists){
    throw customException.sequenceExists();
  }
  return usrService.addSequence(params).then((res) => {
    return userMapper.addSequenceMapping(res);
  });
}

function editSequence(params) {
  if(    process.env.SECRET_CODE == params.secretCode){
    params.userType = appUtils.isAdmin(params.userType);
    return usrService.editSequence(params).then((res) => {
      if(!res){
        throw customException.unableToUpdateSequence();
      }
      return userMapper.editSequenceMapping(res);
    }
    );
  }else{
    throw customException.invalidSecretCode();
  }
  

}
//========================== Export Module Start ==============================

module.exports = {
  register,
  userLogin,
  validateOtp,
  createMpin,
  forgetPin,
  validateForgetPinOtp,
  editProfileImage,
  addUser,
  userFirstLogin,
  editUser,
  userList,
  deleteUser,
  loginAsAdmin,
  logout,
  forgotPassword,
  validateForgetPassOtp,
  resetPassword,
  totalNoOfUsers,
  totalNoOfAccount,
  totalNoOfAccountByType,
  pendingOnlineServices,
  addSharePrice,
  editSharePrice,
  getSharePrice,
  getAdminDashBoard,
  userDetails,
  getUserBeneficiary,
  deleteBeneficiary,
  updateDeviceToken,
  commonValidateOtp,
  editUserAddress,
  getUserDashBoard,
  addOtherBankDetails,
  deleteOtherBankDetails,
  validateMPin,
  setTxnLimit,
  editSequenceKeyInRedis,
  addSequence,
  editSequence
};

//========================== Export Module End ================================
