//implement mongodb transaction
const mongoose = require("mongoose");
const appUtils = require("../../../appUtils");
const customException = require("../../../customException");
const customerAccountModel = require("./customerAccountModel");
let BaseDao = require("../../../dao/baseDao");
const { options } = require("./customerAccountRoute");
const customerAccountDao = new BaseDao(customerAccountModel);
const transactionModel = require("../transaction/transactionModel");
const transactionDao = require("../transaction/transactionDao");
const { parentPort, workerData } = require("worker_threads");
const worker = require("worker_threads");
const index = require("../../../config/index");
const userDao = require("../user/userDao");

let session;

async function fundTransfer(params) {
  session = await mongoose.connection.startSession();

  let self = this;
  console.log("gga", params);
  // while (true) {

  try {
    session.startTransaction();
    console.log(params, "m");

    const senderAccount = await customerAccountDao.findOne(
      { accountNumber: params.senderAccountNumber },
      {},
      { session }
    );

    const receiverAccount = await customerAccountDao.findOne(
      { accountNumber: params.receiverAccountNumber },
      {},
      { session }
    );

    console.log(receiverAccount, "mmmm");
    if (!senderAccount || senderAccount == null) {
      throw customException.senderAccountNumberNotExists();
    }
    if (!receiverAccount || receiverAccount == null) {
      throw customException.receiverAccountNumberNotExists();
    }
    if (senderAccount.balance < params.transactionAmount) {
      throw customException.notSufficientBalance();
    }

    const insetTransaction = await transactionDao.createInitialTransaction(
      params
    );

    if (!insetTransaction || insetTransaction == null) {
      throw customException.notInitiated();
    }
    self.transactionId = insetTransaction._id;

    let query1 = {};
    query1.accountNumber = params.senderAccountNumber;
    query1.customerId = params.userId;

    const senderAccountUpdate = await customerAccountDao
      .findOneAndUpdate(
        query1,
        { $inc: { balance: -parseFloat(params.transactionAmount) } },
        { new: true, session: session }
      )
      .then(function (result) {
        console.log(result, "..");
        if (result) {
          return result;
        } else {
          return false;
        }
      });

    if (!senderAccountUpdate) {
      throw customException.failedToDebit(params);
    }

    let query2 = {};
    query2.accountNumber =params.receiverAccountNumber;
    query2.customerId = receiverAccount.customerId;
    let receiverAccountUpdate;
    if(receiverAccount.accountType == 4||receiverAccount.accountType == 5 ){
       receiverAccountUpdate = await customerAccountDao
      .findOneAndUpdate(
        query2,
        { $inc: { balance: -parseFloat(params.transactionAmount) } },
        { new: true, session: session }
      )
      .then(function (result) {
        console.log(result, "..");
        if (result) {
          return result;
        } else {
          return false;
        }
      });
    }else{
      receiverAccountUpdate = await customerAccountDao
      .findOneAndUpdate(
        query2,
        { $inc: { balance: parseFloat(params.transactionAmount) } },
        { new: true, session: session }
      )
      .then(function (result) {
        console.log(result, "..");
        if (result) {
          return result;
        } else {
          return false;
        }
      });
    }
    

    if (!receiverAccountUpdate) {
      throw customException.failedToCredit(params);
    }

    let finalTransaction = await transactionDao.createTransaction(
      senderAccountUpdate,
      receiverAccountUpdate,
      params,
      1,
      self.transactionId
    );

    //successfullyAdd beneficiary


    // console.log( senderAccount.customerId ,"senderAccount" , receiverAccount.customerId ,"receiverAccount",
    // senderAccount.customerId ==receiverAccount.customerId )
  console.log(receiverAccountUpdate ,"receiverAccountUpdate")
    if(!receiverAccount.customerId.equals(senderAccount.customerId)){
    let beneficiaryDetails = [];
    beneficiaryDetails.push({
      userId: receiverAccountUpdate.customerId,
      accountNumber: receiverAccountUpdate.accountNumber,
      accountType: receiverAccountUpdate.accountType,
    });
    console.log(beneficiaryDetails,"beneficiaryDetails")
    let addBeneficiary = await userDao.addBeneficiary(
      beneficiaryDetails,
      senderAccount.customerId
    );
    }
    if (!finalTransaction || finalTransaction == null) {
      throw customException.failedToMoveTransaction(params);
    }

    // Commit the transaction
    await session.commitTransaction();
    // End the session
    session.endSession();
    
    return {
      senderAccountUpdate,
      receiverAccountUpdate,
      finalTransaction,
    };
  } catch (error) {
    // Abort the transaction

    console.log(error, ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    await transactionDao.cancelTransaction(self.transactionId, session);
    await session.abortTransaction();
    // End the session
    session.endSession();

    throw error;
  } finally {
    // End the session
    session.endSession();
  }
}

module.exports = {
  fundTransfer,
};
// console.log(`Thread id: ${worker.threadId}`);
// if(workerData){

//   // const promise = new Promise((resolve, reject) => {
//   //     let connectDb = async ()=>{

//   //       let dbName = index.cfg.mongo.dbName;
//   //       let dbUrl = index.cfg.mongo.dbUrl;
//   //       let dbOptions = index.cfg.mongo.options;
//   //            mongoose.connect(dbUrl, dbOptions);
//   //           mongoose.connection.on('connected', async function () {
//   //             console.log('Connected to DB from workerThread', dbName, 'at', dbUrl);
//   //             temp = 1
//   //

//   //         });
//   //         }
//   //        connectDb()
//   //       })

// // console.log(promise,">>>>>>>>>>",temp)
// // if(temp == 1){
// //   console.log('hiii')

// // }
// let params = workerData.params
// fundTransfer(params).then(async (result) => {
//   // process.exit(0);
// console.log(result ,"finalRESULTBABY");
// })
// .catch((err)=>{

// })

// }

//for local ec2 db
// DB_NAME=fedora-dev
// DB_URL=mongodb://localhost:27017/
// DB_USER=fedora
// DB_PASS=fedora@123
