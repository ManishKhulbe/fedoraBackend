var CryptoJS = require("crypto-js");

//make a encryptDecryptMiddleware function
const encryptDecryptMiddleware = (req, res, next) => {
console.log("🚀 ~ file: encryptDecrypt.js:5 ~ encryptDecryptMiddleware ~ req:", req.body)

  let arr = Object.keys(req.body)
  if(arr.length > 0){
    var bytes = CryptoJS.AES.decrypt(req.body?.data, process.env.SECRET_ENCRYPT_KEY);
    if (bytes) {
      req.body = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    }
  }
  next();
};


decryptRequest = (req, res, next) => {

    let arr = Object.keys(req.body)
    if(arr.length > 0){
        var bytes = CryptoJS.AES.decrypt(req.body?.data, process.env.SECRET_ENCRYPT_KEY);
        req.body = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    }
  next();
};

encryptResponse = (data) => {
  var ciphertext = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    process.env.SECRET_ENCRYPT_KEY
  ).toString();

  return { encryptedData: ciphertext , encrypted: true };
};

module.exports = {
  encryptDecryptMiddleware,
  encryptResponse,
  decryptRequest
};
