const router = require("express").Router();
const requestIp = require("request-ip");

const resHndlr = require("../../../responseHandler");
const middleware = require("../../../middleware");
const constants = require("../../../constant");
const userFacade = require("./userFacade");
const validators = require("./userValidators");

const constant = require("../../../constant");
//==============================================================

// middleware.multer.single('profileImage')
// ,middleware.mediaUpload.uploadSingleMediaToS3('profile')

router
  .route("/register")
  .post([validators.validateRegistration], function (req, res) {
    console.log(req.body);
    let {
      accountNumber,
      membershipId,
      name,
      mobileNo,
      acceptedTermsAndCondition,
      email
    } = req.body;

    userFacade
      .register({
        accountNumber,
        membershipId,
        name,
        mobileNo,
        acceptedTermsAndCondition,
        email
      })
      .then(function (result) {
        resHndlr.sendSuccess(res, result, req);
      })
      .catch(function (err) {
        resHndlr.sendError(res, err, req);
      });
  });


  router
  .route("/register1")
  .post([validators.validateRegistration], function (req, res) {
    console.log(req.body);
    let {
      accountNumber,
      membershipId,
      name,
      mobileNo,
      acceptedTermsAndCondition,
      email
    } = req.body;

    userFacade
      .register1({
        accountNumber,
        membershipId,
        name,
        mobileNo,
        acceptedTermsAndCondition,
        email
      })
      .then(function (result) {
        resHndlr.sendSuccess(res, result, req);
      })
      .catch(function (err) {
        resHndlr.sendError(res, err, req);
      });
  });
  router
  .route("/validateOtp")
  .post([validators.validateOtp], function (req, res) {
    console.log(req.body);
    let {
     otp
    } = req.body;

    userFacade
      .validateOtp({
        otp
      })
      .then(function (result) {
        resHndlr.sendSuccess(res, result, req);
      })
      .catch(function (err) {
        resHndlr.sendError(res, err, req);
      });
  });
  

  router
  .route("/createMpin")
  .post([middleware.authenticate.autntctTkn, validators.validateMpin], function (req, res) {
    console.log(req.body);
    let {
        mPin
    } = req.body;
    let {userId,userType}= req.user

    userFacade
      .createMpin({
        mPin,userId,userType
      })
      .then(function (result) {
        resHndlr.sendSuccess(res, result, req);
      })
      .catch(function (err) {
        resHndlr.sendError(res, err, req);
      });
  });


router.route("/login")
    .post([middleware.authenticate.autntctTkn, validators.validateMpin ], function (req, res) {
        console.log(req.body);
      let {mPin } = req.body;
        let {userId } = req.user;
        let clientIp = requestIp.getClientIp(req);
        userFacade.userLogin({ mPin, userId,clientIp })
        .then(function (result) {
            resHndlr.sendSuccess(res, result,req);
        })
        .catch(function (err) {
            resHndlr.sendError(res, err,req);
        })
    });
    

    router.route("/firstLogin")
    .post([validators.validateMpin ], function (req, res) {
        console.log(req.body);
      let {mPin , mobileNo} = req.body;
        let clientIp = requestIp.getClientIp(req);
        userFacade.userFirstLogin({ mPin, mobileNo ,clientIp })
        .then(function (result) {
            resHndlr.sendSuccess(res, result,req);
        })
        .catch(function (err) {
            resHndlr.sendError(res, err,req);
        })
    });


    router.route('/forgetPin')
    .post([validators.validateForgetPin], function (req, res) {
      let {mobileNo} = req.body;
      userFacade.forgetPin({ mobileNo })
      .then(function (result) {
          resHndlr.sendSuccess(res, result,req);
      })
      .catch(function (err) {
          resHndlr.sendError(res, err,req);
      })

    })

    router.route('/validateForgetPinOtp')
    .post([validators.validateForgetPinOtp], function (req, res) {
      let {otp} = req.body;
      userFacade.validateForgetPinOtp({ otp })
      .then(function (result) {
          resHndlr.sendSuccess(res, result,req);
      })
      .catch(function (err) {
          resHndlr.sendError(res, err,req);
      })

    })

    router.
    route('/editProfileImage')
    .post([middleware.authenticate.autntctTkn, middleware.multer.single('profileImage'), middleware.mediaUpload.uploadSingleMediaToS3('profileImage')], function (req, res) {
   
      let {userId} = req.user;  
      let {location} = req.body;
      console.log(location,"MMMMMMMMMMM")
      userFacade.editProfileImage({ userId,location })
      .then(function (result) {
        resHndlr.sendSuccess(res, result,req);
      })
      .catch(function (err) {
        resHndlr.sendError(res, err,req);
      })
    })

    router.route('/login')
    .post([validators.validateLogin], function (req, res) {
        let {email, password, platform, deviceToken, appType} = req.body;

        userFacade.login({email, password, platform, deviceToken, appType })
            .then(function (result) {
                resHndlr.sendSuccess(res, result, req)
            }).catch(function (err) {
            resHndlr.sendError(res, err, req)
        })
    }); 

    router.route("/addUser")
    .post( [middleware.authenticate.autntctTkn],function (req, res) {
  
      let {userId,userType } = req.user;
        let {
            membershipId,
            name,
            email,
            password,
            mPIN,
            mobileNo,
            acceptedTermsAndCondition,
        } = req.body;
        let UserType = req.body.userType

        userFacade.addUser({
          userId,
          membershipId,
          name,
          email,
          password,
          mPIN,
          mobileNo,
          userType,
          UserType,
          acceptedTermsAndCondition,
        }).then(function (result) {
            resHndlr.sendSuccess(res, result, req);
        }).catch(function (err) {
            resHndlr.sendError(res, err, req);
        })
    })

router.route("/editUser")
    .put( [middleware.authenticate.autntctTkn],function (req, res) {
  
      let {userId,userType } = req.user;
        let {
          customerId,
            membershipId,
            name,
            email,
            mobileNo,
            status
        } = req.query;

        let UserType = req.query.userType

        userFacade.editUser({
          userId,
          membershipId,
          name,
          email,
          customerId,
          mobileNo,
          userType,
          UserType,
          status
        }).then(function (result) {
            resHndlr.sendSuccess(res, result, req);
        }).catch(function (err) {
            resHndlr.sendError(res, err, req);
        })
    })



router.route("/userList")
.get( [middleware.authenticate.autntctTkn],function (req, res) {

  let {userId,userType } = req.user;
    let {
      status,
      search,
      count,
      pageNo,
      sortType,
      sortField
    } = req.query;


    userFacade.userList({
      status,
      search,
      count,
      pageNo,
      sortType,
      sortField,userId,userType
    }).then(function (result) {
        resHndlr.sendSuccess(res, result, req);
    }).catch(function (err) {
        resHndlr.sendError(res, err, req);
    })
})


router
  .route("/deleteUser")
  .delete([middleware.authenticate.autntctTkn], function (req, res) {
    let { userType, userId } = req.user;
    let { customerId, isDeleted } = req.query;

    userFacade
      .deleteUser({ customerId, userType, userId, isDeleted })
      .then(function (result) {
        resHndlr.sendSuccess(res, result, req);
      })
      .catch(function (err) {
        resHndlr.sendError(res, err, req);
      });
  });
  


  router.route('/loginAsAdmin')
  .post([validators.validateLoginAsAdmin], function (req, res) {
      let {email, password} = req.body;

      userFacade.loginAsAdmin({email, password })
          .then(function (result) {
              resHndlr.sendSuccess(res, result, req)
          }).catch(function (err) {
          resHndlr.sendError(res, err, req)
      })
  }); 
// router.route("/edit")
//     .post([middleware.authenticate.autntctTkn,middleware.authenticateRole.userRole(constant.ACCOUNT_ROLE.ADMIN),middleware.multer.single('profileImage'),middleware.mediaUpload.uploadSingleMediaToS3('profile')], function (req, res) {
//         let profileImage;
//         let profileImageData;
//         let {name,
//             email,
//             password,
//             employeeId,
//             //userType,
//             gender,
//             dob,
//             designation,
//             companyName,
//             aboutUs,
//             workEmail,
//             phoneNo,
//             whatsApp,
//             skype,
//             website,
//             instagram,
//             facebook,
//             linkedin,
//             twitter,
//             googleMap,
//             hangouts,
//             youtube,
//             snapchat,
//             tiktok,
//             pinterest,
//             userId,
//             github,
//             npm,
//             stackoverflow,
//             s3ImageData
//         } = req.body;
//         let {user} = req;
//         if (s3ImageData) {
//             profileImageData = s3ImageData;
//             profileImage = s3ImageData.key;
//         }
//         let clientIp = requestIp.getClientIp(req);
// //            console.log("params",req.body);
//         userFacade.edit({
//             user,
//             name,
//             email,
//             password,
//             employeeId,
//             //userType,
//             gender,
//             dob,
//             designation,
//             companyName,
//             aboutUs,
//             profileImage,
//             workEmail,
//             phoneNo,
//             whatsApp,
//             skype,
//             website,
//             instagram,
//             facebook,
//             linkedin,
//             twitter,
//             googleMap,
//             hangouts,
//             youtube,
//             snapchat,
//             tiktok,
//             pinterest,
//             userId,
//             github,
//             npm,
//             stackoverflow,
//             s3ImageData
//         })
//         .then(function (result) {
//             resHndlr.sendSuccess(res, result,req);
//         })
//         .catch(function (err) {
//             resHndlr.sendError(res, err,req);
//         })
//     });

// router.route("/details")
//     .post([middleware.authenticate.autntctTkn], function (req, res) {
//         let {userId} = req.body;
//         let {user} = req;
//         let clientIp = requestIp.getClientIp(req);
//         if(!userId){
//             userId=user.userId;
//         }
//         userFacade.details({ userId,clientIp })
//         .then(function (result) {
//             resHndlr.sendSuccess(res, result,req);
//         })
//         .catch(function (err) {
//             resHndlr.sendError(res, err,req);
//         })
//     });

// router.route("/forgot")
//     .post([validators.validateForgot], function (req, res) {
//         let {email} = req.body;
//         let clientIp = requestIp.getClientIp(req);
//         userFacade.forgetPassword({ email,clientIp })
//         .then(function (result) {
//             resHndlr.sendSuccess(res, result,req);
//         })
//         .catch(function (err) {
//             resHndlr.sendError(res, err,req);
//         })
//     });

// router.route("/reset")
//     .post([validators.validateReset,middleware.authenticate.autntctTkn], function (req, res) {
//         let {password} = req.body;
//         let {user} = req;
//         let clientIp = requestIp.getClientIp(req);
//         userFacade.resetPassword({ user,password,clientIp })
//         .then(function (result) {
//             resHndlr.sendSuccess(res, result,req);
//         })
//         .catch(function (err) {
//             resHndlr.sendError(res, err,req);
//         })
//     });

// router.route("/checkForgotToken")
//     .post([middleware.authenticate.autntctTkn], function (req, res) {
//         let {userId} = req.body;
//         let clientIp = requestIp.getClientIp(req);
//         userFacade.details({ userId,clientIp })
//         .then(function (result) {
//             resHndlr.sendSuccess(res, result,req);
//         })
//         .catch(function (err) {
//             resHndlr.sendError(res, err,req);
//         })
//     });

// router.route("/info")
//     .post([validators.validateUserInfo], function (req, res) {
//         let {employeeId} = req.body;
//         let clientIp = requestIp.getClientIp(req);
//         userFacade.userInfo({ employeeId,clientIp })
//         .then(function (result) {
//             resHndlr.sendSuccess(res, result,req);
//         })
//         .catch(function (err) {
//             resHndlr.sendError(res, err,req);
//         })
//     });

// router.route("/contactFile")
//     .post([validators.validateUserInfo], function (req, res) {
//         let {employeeId} = req.body;
//         let clientIp = requestIp.getClientIp(req);
//         userFacade.contactFile({ employeeId,clientIp })
//         .then(function (result) {
//             resHndlr.sendSuccess(res, result,req);
//         })
//         .catch(function (err) {
//             resHndlr.sendError(res, err,req);
//         })
//     });

// router.route("/changePassword")
//     .post([validators.validateChangePassword,middleware.authenticate.autntctTkn], function (req, res) {
//         let {oldPassword,password} = req.body;
//         let {user} = req;
//         let clientIp = requestIp.getClientIp(req);
//         userFacade.changePassword({ user,oldPassword,password,clientIp })
//         .then(function (result) {
//             resHndlr.sendSuccess(res, result,req);
//         })
//         .catch(function (err) {
//             resHndlr.sendError(res, err,req);
//         })
//     });

// router.route("/profile/edit")
//     .post([middleware.authenticate.autntctTkn,middleware.multer.single('profileImage'),middleware.mediaUpload.uploadSingleMediaToS3('profile')], function (req, res) {
//         let profileImage;
//         let profileImageData;
//         let {name,
//             email,
//             //password,
//             //employeeId,
//             //userType,
//             gender,
//             dob,
//             //designation,
//             //companyName,
//             aboutUs,
//             //workEmail,
//             phoneNo,
//             whatsApp,
//             //skype,
//             //website,
//             instagram,
//             facebook,
//             linkedin,
//             twitter,
//             googleMap,
//             hangouts,
//             youtube,
//             snapchat,
//             tiktok,
//             pinterest,
//             github,
//             npm,
//             stackoverflow,
//             s3ImageData
//             //userId
//         } = req.body;
//         let {user} = req;
//         if (s3ImageData) {
//             profileImageData = s3ImageData;
//             profileImage = s3ImageData.key;
//         }
//         let clientIp = requestIp.getClientIp(req);
//             console.log("params",req.body);
//         userFacade.profileEdit({
//             user,
//             name,
//             email,
//             //password,
//             //employeeId,
//             //userType,
//             gender,
//             dob,
//             //designation,
//             //companyName,
//             aboutUs,
//             profileImage,
//             profileImageData,
//             //workEmail,
//             phoneNo,
//             whatsApp,
//             //skype,
//             //website,
//             instagram,
//             facebook,
//             linkedin,
//             twitter,
//             googleMap,
//             hangouts,
//             youtube,
//             snapchat,
//             tiktok,
//             github,
//             npm,
//             stackoverflow,
//             pinterest,
//             //userId
//         })
//         .then(function (result) {
//             resHndlr.sendSuccess(res, result,req);
//         })
//         .catch(function (err) {
//             resHndlr.sendError(res, err,req);
//         })
//     });

// router.route("/list")
//     .post([middleware.authenticate.autntctTkn,middleware.authenticateRole.userRole(constant.ACCOUNT_ROLE.ADMIN), validators.validateUserList], function (req, res) {
//         let {search, pageNo, limit, sortField, sortType, status,userType} = req.body;
//         let {user} = req;
//         userFacade.userList({user, search, pageNo, limit, sortField, sortType,status,userType})
//         .then(function (result) {
//             resHndlr.sendSuccess(res, result, req);
//         })
//         .catch(function (err) {
//             resHndlr.sendError(res, err, req);
//         })
//     })

// router.route("/statusChange")
//     .post([middleware.authenticate.autntctTkn,middleware.authenticateRole.userRole(constant.ACCOUNT_ROLE.ADMIN), validators.validateStatusChange], function (req, res) {
//         let {status,userId} = req.body;
//         let {user} = req;
//         userFacade.statusChange({user, userId,status})
//         .then(function (result) {
//             resHndlr.sendSuccess(res, result, req);
//         })
//         .catch(function (err) {
//             resHndlr.sendError(res, err, req);
//         })
//     })

module.exports = router;
