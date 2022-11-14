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
const client = require('twilio')(accountSid, authToken);

//========================== Load Modules End ==============================================
                   
// function register(params) {
//   let self = this;
//   return usrService
//     .isMobileNumberExists(params)
//     .bind({})
//     .then(function (isExist) {
//       this.isExist = isExist;
//       if (isExist) {
//         throw customException.alreadyRegistered();
//       }
//       console.log(params);
//       let otp = appUtils.getRandomOtp();
//       let payload = {
//         email: params.email,
//         subject: " Registration OTP mail from FEDORA ",
//         template: "otpRegistration",
//         otp,
//         name: params.name,
//       };
//       self.payload = payload;
//       let userObj = {
//         params,
//         otp,
//       };
//       return redisClient.setOTPValue(otp, userObj);
//     })
//     .bind({})
//     .then(function (data) {
//       console.log(data, ">>>>>");
//       if (data) {
//         return appUtils.sendBySms(params.mobileNo ,self.payload.otp)
//         .then((data)=>{
//           if(data){
//             return userMapper.otpSentMapping();
//           }
//           return emailService.sendOtpMail(self.payload);
//         }).then(function (data) {
//           return userMapper.otpSentMapping();
//         })
//       }
//     })
//     .catch(function (err) {
//       throw err;
//     });
// }


function register(params) {
  let self = this;
  return usrService
    .isMobileNumberExists(params)
    .bind({})
    .then(function (isExist) {
      this.isExist = isExist;
      if (!isExist) {
        throw customException.mobileNumberNotExists();
      }
      console.log(isExist)
      return usrService.isMembershipIdExists(params)
    })
    .then((isExists)=>{
        if(!isExists){
          throw customException.membershipIdNumberNotExists();
        }
        return usrService.isAccountNumberExists(params)

      })
      .then((isExists)=>{
        if(!isExists){
          throw customException.accountNumberNotExists();
        }
        // console.log(isExists ,"isExists");
        let otp = appUtils.getRandomOtp();
        let payload = {
          email: params.email,
          subject: " Registration OTP mail from FEDORA ",
          template: "otpRegistration",
          otp,
          name: params.name,
        };
        self.payload = payload;
        let userObj = {
          customerId : isExists.customerId
        };
        return redisClient.setOTPValue(otp, userObj);
      })
    .bind({})
    .then(function (data) {
      console.log(data, ">>>>>");
      if (data) {
        return appUtils.sendBySms(params.mobileNo ,self.payload.otp)
        .then((data)=>{
          if(data){
            return userMapper.otpSentMapping();
          }
          return emailService.sendOtpMail(self.payload);
        }).then(function (data) {
          return userMapper.otpSentMapping();
        })
      }
    })
    .catch(function (err) {
      throw err;
    });
}


async function validateOtp(params) {
  return await redisClient
    .exists(params.otp)
    .then((isExist) => {
      console.log(isExist, ">>><<<isExist");
      if (isExist) {
        return redisClient.getValue(params.otp);
      } else {
        throw customException.otpExpired();
      }
    })
    .then((userData) => {
      let finalUserData = JSON.parse(userData);
      console.log(finalUserData ,"finalUserDatafinalUserDatafinalUserData")
      return usrService.getUserByID(finalUserData.customerId);
    })
    .then((user) => {
      console.log(user, "mm");
      let tokenObj = _buildUserTokenGenObj(user);
      let userObj = {
        userId: user._id.toString(),
        userObj: tokenObj,
        IP: ip.address(),
        expTime: 15552000,
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


// async function validateOtp1(params) {
//   return await redisClient
//     .exists(params.otp)
//     .then((isExist) => {
//       console.log(isExist, ">>><<<isExist");
//       if (isExist) {
//         return redisClient.getValue(params.otp);
//       } else {
//         throw customException.otpExpired();
//       }
//     })
//     .then((userData) => {
//       let finalUserData = JSON.parse(userData);
//       return usrService.register(finalUserData.params);
//     })
//     .then((user) => {
//       console.log(user, "mm");
//       let tokenObj = _buildUserTokenGenObj(user);
//       let userObj = {
//         userId: user._id.toString(),
//         userObj: tokenObj,
//         IP: ip.address(),
//         expTime: 15552000,
//       };
//       return redisSession.create(userObj).then(function (redisSession) {
//         return redisClient
//           .setValue(tokenObj.mobileNo, redisSession)
//           .then(() => {
//             return userMapper.registerMapping({
//               redisSession: redisSession.token,
//               user: user,
//             });
//           });
//       });
//     });
// }

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


function editUser(params){
  params.userType = appUtils.isAdmin(params.userType);
  return usrService
  .isCustomerIdExist(params)
  .bind({})
  .then(function (isExist) {
    console.log(isExist);
    this.isExist = isExist;
    if (isExist) {
      return usrService.editUser(params);
    } else {
      throw customException.userNotFound();
    }
  })
  .then(function (response) {
    if (response) {
      return userMapper.editUserMapping(response);
    } else {
      throw customException.incorrectPass();
    }
  });
}


function userFirstLogin(params){
  return usrService
  .isMobileNumberExist(params)
  .bind({})
  .then(function (isExist) {
    console.log(isExist);
    this.isExist = isExist;
    if (isExist) {
      return usrService.login(params);
    } else {
      throw customException.notRegisteredMobileNo();
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


function forgetPin(params) {
  let self = this;
  return usrService.isMobileNumberExist(params).then((isExist) => {
    if (isExist) {
      console.log(isExist);
      let otp = appUtils.getRandomOtpSix();
      let payload = {
        email: isExist.email,
        subject: " Forget Password OTP mail from FEDORA ",
        template: "otpRegistration",
        otp,
        name: isExist.name,
      };
      self.payload = payload;
      let userObj = {
        userId: isExist._id,
        status: isExist.status,
        userType: isExist.userType,
        params,
        otp,
      };
      return redisClient.setValue(otp, userObj).then(function (data) {
        if (data) {
          return appUtils.sendBySms(params.mobileNo ,self.payload.otp)
        .then((data)=>{
          console.log('twilio' , data)
          if(data){
            return userMapper.otpSentMapping();
          }
          return emailService.sendOtpMail(self.payload).then(function (data) {
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

async function validateForgetPinOtp(params) {
  let self = this;
  return await redisClient.exists(params.otp).then((isExist) => {
    console.log(isExist, ">>><<<isExist");
    if (isExist) {
      return redisClient.getValue(params.otp).then((userdata) => {
        let finalUserData = JSON.parse(userdata);
        self.finalUserData = finalUserData;
        console.log(finalUserData, "finalUserData");
        let tokenObj = _buildUserTokenGenObj1(finalUserData);
        let userObj = {
          userId: finalUserData.userId,
          userObj: tokenObj,
          IP: ip.address(),
          expTime: 2592000,
        };
        return redisSession.create(userObj).then(function (redisToken) {
          self.redisToken = redisToken;
          let mobileNo = self.finalUserData.params.mobileNo;
          self.mobileNo = mobileNo;
          return redisClient.getValue(mobileNo).then((userToken) => {
            let prevTokenObj = JSON.parse(userToken);
            console.log(prevTokenObj ,"<<<<<<<<<<<<<<<<<<<previousToken ");
            return redisSession.expire(prevTokenObj.token).then((result) => {
              if (result) {
                return redisClient
                  .setValue(self.mobileNo, self.redisToken)
                  .then((data) => {
                    console.log(data, "MMMMMMMMMMMMAnewwwww");
                    if(data){
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
  userObj.mobileNo = user.mobileNo;
  return userObj;
}
function _buildUserTokenGenObj1(user) {
  var userObj = {};
  userObj.deviceToken = user.deviceToken ? user.deviceToken : null;
  userObj.deviceTypeID = user.deviceTypeID ? user.deviceTypeID : null;
  userObj.deviceID = user.deviceID ? user.deviceID : null;
  userObj.userId = user.userId;
  userObj.userType = user.userType ? user.userType : null;
  userObj.status = user.status;
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

function  addUser(params){

  let self = this;
  params.userType = appUtils.isAdmin(params.userType);
  return usrService.isMobileNumberExists(params)
      .bind({})
      .then(function (isNumberExist) {
        if (isNumberExist) {
          throw customException.alreadyRegistered();
        }
        return usrService.isMembershipIdExists(params).then((isExists)=>{
          if(isExists){
            throw customException.alreadyRegistered();
          }
          return usrService.addUser(params) .then(function (result) {
            return userMapper.addUserMapping(result);
        })
        })
       
      })  
}


function userList(params){
  params.userType = appUtils.isAdmin(params.userType);

    const userList = usrService.usersList(params);
    
    return Promise.all([userList])
        .then(function (result) {
            return userMapper.userListMapping(result[0], params)
        })
}


function deleteUser(params){
  params.userType = appUtils.isAdmin(params.userType);
  return usrService.deleteUser(params).then(function (result) {
    if (result) {
      return userMapper.deleteUserMapping(result, params);
    } 
  });

}

function loginAsAdmin(loginInfo){

let self = this;
  return usrService.isEmailIdExist(loginInfo)
      .bind({})
      .then(function (user) {
        self.user = user
          if (user) {
              return usrService.loginAsAdmin(user, loginInfo);
          } else {
              throw customException.invalidEmail();
          }
      })
      .then(function (response) {
        console.log(self.user,"MM")
        
          if (response) {
              let tokenObj = _buildUserTokenGenObj(self.user)
              let userObj = {
                  userId: self.user._id.toString(),
                  userObj: tokenObj,
                  IP: ip.address()
              }
              return redisSession.create(userObj)
                  .then(function (redisSession) {
                      return userMapper.loginAsAdminMapping({
                          redisSession: redisSession.token,
                          user: self.user
                      });
                  })
          } else {
              throw customException.incorrectPassword();
          }
      })

}

// function create(params) {
//   return usrService
//     .isEmailExist(params)
//     .then(function (result) {
//       if (result) {
//         throw customException.alreadyRegistered();
//       }
//       return usrService.createUser(params);
//     })
//     .bind({})
//     .then(function (user) {
//       return userMapper.createMapping({ user: user });
//     })
//     .catch(function (err) {
//       throw err;
//     });
// }

// function edit(params) {
//   return usrService
//     .isEmailExist(params)
//     .then(function (result) {
//       if (result) {
//         throw customException.alreadyRegistered();
//       }
//       return usrService.updateUser(params);
//     })
//     .bind({})
//     .then(function (user) {
//       return userMapper.editMapping({ user: user });
//     })
//     .catch(function (err) {
//       throw err;
//     });
// }

// function profileEdit(params) {
//   return usrService
//     .emailCheck(params)
//     .then(function (result) {
//       if (result) {
//         throw customException.alreadyRegistered();
//       }
//       return usrService.updateUser(params);
//     })
//     .bind({})
//     .then(function (user) {
//       return userMapper.editMapping({ user: user });
//     })
//     .catch(function (err) {
//       throw err;
//     });
// }

// function details(params) {
//   return usrService
//     .getByKey({ _id: params.userId })
//     .bind({})
//     .then(function (user) {
//       if (user) {
//         return userMapper.detailsMapping({ user: user });
//       } else {
//         throw customException.getCustomErrorException("Invalid user");
//       }
//     })
//     .catch(function (err) {
//       throw err;
//     });
// }

// function userInfo(params) {
//   return usrService
//     .getByKey({ employeeId: params.employeeId.toUpperCase() })
//     .bind({})
//     .then(function (profileInfo) {
//       if (!profileInfo) {
//         throw customException.getCustomErrorException("Invalid user");
//       }

//       this.profileInfo = profileInfo;
//       //create a new vCard
//       const vCard = vCardsJS();

//       //set properties
//       vCard.firstName = profileInfo.name;
//       vCard.organization = profileInfo.companyName;
//       vCard.photo.attachFromUrl(profileInfo.profileImage, "JPEG");
//       vCard.workPhone = profileInfo.phoneNo;
//       vCard.title = profileInfo.designation;
//       vCard.url = profileInfo.website;
//       vCard.email = profileInfo.email;
//       vCard.workEmail = profileInfo.email;
//       vCard.socialUrls["facebook"] = "http://fb.me/" + profileInfo.facebook;
//       vCard.socialUrls["linkedIn"] = profileInfo.linkedIn;
//       vCard.socialUrls["twitter"] =
//         "https://twitter.com/" + profileInfo.twitter;
//       vCard.socialUrls["instagram"] =
//         "https://www.instagram.com/" + profileInfo.instagram;
//       vCard.note = "Mobcoder Contacts";

//       //get as formatted string
//       console.log(vCard.getFormattedString());
//       //save to file
//       setTimeout(function () {
//         return vCard.saveToFile(
//           "./download/" + profileInfo.employeeId + ".vcf"
//         );
//       }, 3000);
//     })
//     .then(function (result) {
//       console.log("result", result);
//       this.profileInfo.contactFile =
//         config.cfg.homePath +
//         "/download/" +
//         this.profileInfo.employeeId +
//         ".vcf";
//       return userMapper.detailsMapping({ user: this.profileInfo });
//     })
//     .catch(function (err) {
//       throw err;
//     });
// }

// function forgetPassword(params) {
//   return usrService
//     .getByKey({ email: params.email })
//     .bind({})
//     .then(function (result) {
//       this.user = result;
//       if (!result) {
//         throw customException.userNotFound();
//       }
//       let tokenObj = _buildUserTokenGenObj(result);
//       let userObj = {
//         userId: result._id.toString(),
//         userObj: tokenObj,
//         ip: params.clientIp ? params.clientIp : ip.address(),
//       };
//       return redisSession.create(userObj);
//     })
//     .then(function (response) {
//       let payload = {
//         email: params.email,
//         template: "forgot.ejs",
//         subject: constant.EMAIL.SUBJECT.FORGOT_PWD_EMAIL,
//         name: this.user.name,
//         link: config.cfg.webBasePath + "/auth/reset/" + response.token,
//       };
//       return emailService.sendEmail(payload);
//     })
//     .then(function (params) {
//       return userMapper.forgetMapper(params);
//     })
//     .catch(function (err) {
//       throw err;
//     });
// }

// function resetPassword(params) {
//   return usrService
//     .update(
//       { _id: params.user.userId },
//       { password: appUtils.createHashSHA256(params.password) }
//     )
//     .then(function (result) {
//       redisSession.expireByUserId(params.user.userId);
//       return userMapper.resetMapper(params);
//     })
//     .catch(function (err) {
//       throw err;
//     });
// }

// function contactFile(params) {
//   return usrService
//     .getByKey({ employeeId: params.employeeId.toUpperCase() })
//     .bind({})
//     .then(function (profileInfo) {
//       if (!profileInfo) {
//         throw customException.getCustomErrorException("Invalid user");
//       }

//       this.profileInfo = profileInfo;
//       //create a new vCard
//       const vCard = vCardsJS();

//       //set properties
//       vCard.firstName = profileInfo.name;
//       vCard.organization = profileInfo.companyName;
//       vCard.photo.attachFromUrl(profileInfo.profileImage, "JPEG");
//       vCard.workPhone = profileInfo.phoneNo;
//       vCard.title = profileInfo.designation;
//       vCard.url = profileInfo.website;
//       vCard.email = profileInfo.email;
//       vCard.workEmail = profileInfo.email;
//       vCard.socialUrls["facebook"] = "http://fb.me/" + profileInfo.facebook;
//       vCard.socialUrls["linkedIn"] = profileInfo.linkedIn;
//       vCard.socialUrls["twitter"] =
//         "https://twitter.com/" + profileInfo.twitter;
//       vCard.socialUrls["instagram"] =
//         "https://www.instagram.com/" + profileInfo.instagram;
//       vCard.note = "Mobcoder Contacts";

//       //get as formatted string
//       console.log(vCard.getFormattedString());
//       //save to file
//       setTimeout(function () {
//         return vCard.saveToFile(
//           "./download/" + profileInfo.employeeId + ".vcf"
//         );
//       }, 3000);
//     })
//     .then(function (result) {
//       console.log("result", result);
//       let filePath =
//         config.cfg.homePath +
//         "/download/" +
//         this.profileInfo.employeeId +
//         ".vcf";
//       return userMapper.contactFileMapper({
//         user: this.profileInfo,
//         filePath: filePath,
//       });
//     })
//     .catch(function (err) {
//       throw err;
//     });
// }

// function changePassword(params) {
//   return usrService
//     .getByKey({
//       _id: params.user.userId,
//       password: appUtils.createHashSHA256(params.oldPassword),
//     })
//     .then(function (result) {
//       if (!result) {
//         throw customException.getCustomErrorException(
//           constant.MESSAGES.OLD_PASSWORD_MISMATCH
//         );
//       }
//       return usrService.update(
//         { _id: params.user.userId },
//         { password: appUtils.createHashSHA256(params.password) }
//       );
//     })
//     .then(function (result) {
//       return userMapper.changePasswordMapper(result);
//     })
//     .catch(function (err) {
//       throw err;
//     });
// }

// function userList(params) {
//   return Promise.join(usrService.userList(params), usrService.count(params))
//     .then(function (userRes) {
//       return userMapper.userListMapper({
//         result: userRes[0],
//         totalCount: userRes[1],
//       });
//     })
//     .catch(function (err) {
//       throw err;
//     });
// }

// function statusChange(params) {
//   return usrService
//     .update({ _id: params.userId }, { status: params.status })
//     .then(function (result) {
//       return userMapper.statusChangeMapper(result);
//     })
//     .catch(function (err) {
//       throw err;
//     });
// }

// create,
//   edit,
//   details,
//   forgetPassword,
//   resetPassword,
//   userInfo,
//   contactFile,
//   changePassword,
//   profileEdit,
//   userList,
//   statusChange,
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
  loginAsAdmin
};

//========================== Export Module End ================================
