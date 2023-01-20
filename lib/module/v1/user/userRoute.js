const router = require("express").Router();
const requestIp = require("request-ip");

const resHndlr = require("../../../responseHandler");
const middleware = require("../../../middleware");
const constants = require("../../../constant");
const userFacade = require("./userFacade");
const validators = require("./userValidators");

const constant = require("../../../constant");
//==============================================================

  router
  .route("/register")
  .post([validators.validateRegistration], function (req, res) {
    console.log(req.body);
    let {
      accountNumber,
      membershipId,
      name,
      email,
      mobileNo,
    } = req.body;

    userFacade
      .register({
        accountNumber,
        membershipId,
        name,
        mobileNo,
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
  .route('/updateDeviceToken')
  .put([middleware.authenticate.autntctTkn], function (req, res) {
      let {deviceToken} = req.body;
      let {userId, userType} = req.user;

userFacade.updateDeviceToken({userId, userType , deviceToken })
          .then(function (result) {
              resHndlr.sendSuccess(res, result, req)
          }).catch(function (err) {
          resHndlr.sendError(res, err, req)
      })
  });


  router
  .route("/validateOtp")
  .post([validators.validateOtp], function (req, res) {
    console.log(req.body);
    let {
      mobileNo,
     otp
    } = req.body;

    userFacade
      .validateOtp({
        otp,mobileNo
      })
      .then(function (result) {
        resHndlr.sendSuccess(res, result, req);
      })
      .catch(function (err) {
        resHndlr.sendError(res, err, req);
      });
  });
  
  // router
  // .route("/validateOtp1")
  // .post([validators.validateOtp], function (req, res) {
  //   console.log(req.body);
  //   let {
  //    otp
  //   } = req.body;

  //   userFacade
  //     .validateOtp1({
  //       otp
  //     })
  //     .then(function (result) {
  //       resHndlr.sendSuccess(res, result, req);
  //     })
  //     .catch(function (err) {
  //       resHndlr.sendError(res, err, req);
  //     });
  // });
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
        let {userId , mobileNo} = req.user;
    
        let clientIp = requestIp.getClientIp(req);
        userFacade.userLogin({ mPin, userId,clientIp ,mobileNo})
        .then(function (result) {
            resHndlr.sendSuccess(res, result,req);
        })
        .catch(function (err) {
            resHndlr.sendError(res, err,req);
        })
    });
    
    router.route("/validateMPin")
    .post([middleware.authenticate.autntctTkn, validators.validateMpin ], function (req, res) {
        console.log(req.body);
      let {mPin } = req.body;
        let {userId , mobileNo} = req.user;
    
        let clientIp = requestIp.getClientIp(req);
        userFacade.validateMPin({ mPin, userId,clientIp ,mobileNo})
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
      let {otp , mobileNo} = req.body;
      userFacade.validateForgetPinOtp({ otp , mobileNo })
      .then(function (result) {
          resHndlr.sendSuccess(res, result,req);
      })
      .catch(function (err) {
          resHndlr.sendError(res, err,req);
      })

    })
    router.route('/commonValidateOtp')
    .post([validators.validateForgetPinOtp], function (req, res) {
      let {otp , mobileNo} = req.body;
      userFacade.commonValidateOtp({ otp , mobileNo })
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

    // router.route('/login')
    // .post([validators.validateLogin], function (req, res) {
    //     let {email, password, platform, deviceToken, appType} = req.body;

    //     userFacade.login({email, password, platform, deviceToken, appType })
    //         .then(function (result) {
    //             resHndlr.sendSuccess(res, result, req)
    //         }).catch(function (err) {
    //         resHndlr.sendError(res, err, req)
    //     })
    // }); 

    router.route("/addUser")
    .post( [middleware.authenticate.autntctTkn , validators.validateAddUser],function (req, res) {
  
      let {userId,userType } = req.user;
        let {
            membershipId,
            name,
            email,
            password,
            mPIN,
            mobileNo,
            allotedStocks,
            addressLine1,
            addressLine2,
            city,
            zipCode,
            country,
            dob,
            gender,
            state,
            panCardNo
        } = req.body;
        let UserType = req.body.userType
        console.log(membershipId,
          name,
          email,
          password,
          mPIN,
          mobileNo,)
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
          allotedStocks,
          addressLine1,
          addressLine2,
          city,
          zipCode,
          country,
          dob,
          gender,
          state,
          panCardNo
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
            status,
            allotedStocks,
            DOB
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
          status,
          allotedStocks,
          DOB
        }).then(function (result) {
            resHndlr.sendSuccess(res, result, req);
        }).catch(function (err) {
            resHndlr.sendError(res, err, req);
        })
    })

    router.route("/editUserAddress")
    .put( [middleware.authenticate.autntctTkn],function (req, res) {

      let {userId,userType } = req.user;
        let {
          customerId,
          addressId,
            addressLine1,
            addressLine2 ,
            city,
            state,
            zipCode,
            country,
            addressType
        } = req.query;

        userFacade.editUserAddress({
          customerId,
          userType,
          addressId,
          addressLine1,
          addressLine2 ,
          city,
          state,
          zipCode,
          country,
          addressType
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
      sortField,
      UserType
    } = req.query;


    userFacade.userList({
      status,
      search,
      count,
      pageNo,
      sortType,
      sortField,userId,userType,UserType
    }).then(function (result) {
        resHndlr.sendSuccess(res, result, req);
    }).catch(function (err) {
        resHndlr.sendError(res, err, req);
    })
})



router.route("/userDetails")
.get( [middleware.authenticate.autntctTkn],function (req, res) {

  let {userId,userType } = req.user;
    let {
      customerId
    } = req.query;


    userFacade.userDetails({
      customerId
    }).then(function (result) {
        resHndlr.sendSuccess(res, result, req);
    }).catch(function (err) {
        resHndlr.sendError(res, err, req);
    })
})

router.route("/getUserBeneficiary")
.get( [middleware.authenticate.autntctTkn],function (req, res) {

  let {userId,userType } = req.user;
    let {
      customerId
    } = req.query;


    userFacade.getUserBeneficiary({
      customerId
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
  
  
  router
  .route("/deleteBeneficiary")
  .delete([middleware.authenticate.autntctTkn], function (req, res) {
    let { userType, userId } = req.user;
    let { beneficiaryId } = req.query;

    userFacade
      .deleteBeneficiary({ beneficiaryId, userType, userId })
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

  router.route('/logout')
  .delete([middleware.authenticate.autntctTkn1], function (req, res) {
      // console.log(req)
      let acsToken = req.get('accessToken');

      let {userId} = req.user;
      let {mobileNo} = req.user
      userFacade.logout({
          userId,acsToken,mobileNo
      }).then(function (result) {
          resHndlr.sendSuccess(res, result, req);
      }).catch(function (err) {
          resHndlr.sendError(res, err, req);
      });
  });


router.route("/forgotPassword")
    .put([validators.validateForgot], function (req, res) {
        
      let {email} = req.query
        let clientIp = requestIp.getClientIp(req);
        userFacade.forgotPassword({email,clientIp })
        .then(function (result) {
            resHndlr.sendSuccess(res, result,req);
        })
        .catch(function (err) {
            resHndlr.sendError(res, err,req);
        })
    });
    
    router.route("/validateForgetPassOtp")
    .post(function (req, res) {
        
      let {otp , email} = req.body
       
        userFacade.validateForgetPassOtp({otp , email})
        .then(function (result) {
            resHndlr.sendSuccess(res, result,req);
        })
        .catch(function (err) {
            resHndlr.sendError(res, err,req);
        })
    });

    router.route("/resetPassword")
    .put([middleware.authenticate.autntctTkn] ,function (req, res) {
        
      let {password} = req.body
       let {userId , userType } = req.user
        userFacade.resetPassword({password ,userId , userType})
        .then(function (result) {
            resHndlr.sendSuccess(res, result,req );
        })
        .catch(function (err) {
            resHndlr.sendError(res, err,req);
        })
    });

    // qAdSrhdKFzDmNWPSPfgAaRdm4VLoPYVjQESzvOfALBhyG4ecs2Cz8NBZlcen639p
    router.route("/getAdminDashBoard")
    .get( [middleware.authenticate.autntctTkn],function (req, res) {
    
      let {userId,userType } = req.user;
    
        userFacade.getAdminDashBoard({
         userId,userType
        }).then(function (result) {
            resHndlr.sendSuccess(res, result, req);
        }).catch(function (err) {
            resHndlr.sendError(res, err, req);
        })
    })
    router.route("/getUserDashBoard")
    .get( [middleware.authenticate.autntctTkn],function (req, res) {
    
      let {userId,userType } = req.user;
    
        userFacade.getUserDashBoard({
         userId,userType
        }).then(function (result) {
            resHndlr.sendSuccess(res, result, req);
        }).catch(function (err) {
            resHndlr.sendError(res, err, req);
        })
    })
    router.route("/totalNoOfUser")
    .get( [middleware.authenticate.autntctTkn],function (req, res) {
    
      let {userId,userType } = req.user;
    
        userFacade.totalNoOfUsers({
         userId,userType
        }).then(function (result) {
            resHndlr.sendSuccess(res, result, req);
        }).catch(function (err) {
            resHndlr.sendError(res, err, req);
        })
    })

    router.route("/totalNoOfAccount")
    .get( [middleware.authenticate.autntctTkn],function (req, res) {
    
      let {userId,userType } = req.user;
    
        userFacade.totalNoOfAccount({
         userId,userType
        }).then(function (result) {
            resHndlr.sendSuccess(res, result, req);
        }).catch(function (err) {
            resHndlr.sendError(res, err, req);
        })
    })

    
    router.route("/totalNoOfAccountByType")
    .get( [middleware.authenticate.autntctTkn],function (req, res) {
    
      let {userId,userType } = req.user;
    
        userFacade.totalNoOfAccountByType({
         userId,userType
        }).then(function (result) {
            resHndlr.sendSuccess(res, result, req);
        }).catch(function (err) {
            resHndlr.sendError(res, err, req);
        })
    })

    
    router.route("/pendingOnlineServices")
    .get( [middleware.authenticate.autntctTkn],function (req, res) {
    
      let {userId,userType } = req.user;
    
        userFacade.pendingOnlineServices({
         userId,userType
        }).then(function (result) {
            resHndlr.sendSuccess(res, result, req);
        }).catch(function (err) {
            resHndlr.sendError(res, err, req);
        })
    })

    router.route("/addSharePrice")
    .post( [middleware.authenticate.autntctTkn],function (req, res) {
    
      let {userId,userType } = req.user;
    let {currentValue}= req.body
        userFacade.addSharePrice({
         userId,userType,currentValue
        }).then(function (result) {
            resHndlr.sendSuccess(res, result, req);
        }).catch(function (err) {
            resHndlr.sendError(res, err, req);
        })
    })

    
    router.route("/editSharePrice")
    .put( [middleware.authenticate.autntctTkn],function (req, res) {
    
      let {userId,userType } = req.user;
    let {currentValue ,shareId}= req.body
        userFacade.editSharePrice({
         userId,userType,currentValue,shareId
        }).then(function (result) {
            resHndlr.sendSuccess(res, result, req);
        }).catch(function (err) {
            resHndlr.sendError(res, err, req);
        })
    })
    
    router.route("/getSharePrice")
    .get( [middleware.authenticate.autntctTkn],function (req, res) {
    
      let {userId,userType } = req.user;
 
        userFacade.getSharePrice({
         userId,userType
        }).then(function (result) {
            resHndlr.sendSuccess(res, result, req);
        }).catch(function (err) {
            resHndlr.sendError(res, err, req);
        })
    })
    

    router.route("/addOtherBankDetails")
    .post( [middleware.authenticate.autntctTkn , validators.validateAddOtherBankDetails],function (req, res) {
    
      let {userId,userType } = req.user;
    let {bankName ,accountNumber ,IFSCcode ,customerId }= req.body
        userFacade.addOtherBankDetails({
         userId,userType,bankName ,accountNumber ,IFSCcode ,customerId
        }).then(function (result) {
            resHndlr.sendSuccess(res, result, req);
        }).catch(function (err) {
            resHndlr.sendError(res, err, req);
        })
    })
    

    router.route("/deleteOtherBankDetails")
    .delete( [middleware.authenticate.autntctTkn ],function (req, res) {
    
      let {userId,userType } = req.user;
    let {customerId ,otherBankDetailsId  }= req.query
        userFacade.deleteOtherBankDetails({
         userId,userType,otherBankDetailsId,customerId
        }).then(function (result) {
            resHndlr.sendSuccess(res, result, req);
        }).catch(function (err) {
            resHndlr.sendError(res, err, req);
        })
    })

    router.route("/setTxnLimit")
    .put( [middleware.authenticate.autntctTkn ],function (req, res) {
    
      let {userId,userType } = req.user;
    let {odaLimit ,  laaLimit }= req.query
        userFacade.setTxnLimit({
         userId,userType,odaLimit, laaLimit
        }).then(function (result) {
            resHndlr.sendSuccess(res, result, req);
        }).catch(function (err) {
            resHndlr.sendError(res, err, req);
        })
    })
    router.route("/editSequenceKeyInRedis")
    .post( [middleware.authenticate.autntctTkn ],function (req, res) {
    
      let {userId,userType } = req.user;
    let {redisKeyName ,  value }= req.body
        userFacade.editSequenceKeyInRedis({
         userId,userType,redisKeyName,value
        }).then(function (result) {
            resHndlr.sendSuccess(res, result, req);
        }).catch(function (err) {
            resHndlr.sendError(res, err, req);
        })
    })
    
module.exports = router;
