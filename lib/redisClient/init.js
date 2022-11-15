const Promise = require('bluebird'),
        redis = require('redis');

Promise.promisifyAll(redis.RedisClient.prototype),
        Promise.promisifyAll(redis.Multi.prototype);

var client;
_ = require('lodash'),
        config = require('../config'),
        logger = require('../logger/index');

var init = function () {
    client = redis.createClient(config.cfg.redis.port, config.cfg.redis.server);
    return client.onAsync('error').then(function (error) {
        logger.info({error: error});
    });
}

exports.setValue = function (key, value) {
    let val = JSON.stringify(value)

    //set value withou expiry
    // setAsync(key, val , 'EX' , 3*60*60 ) <----- for expiry
    return client.setAsync(key, val ).then(function (response) {
        if (response) {
            // logger.info({'value': response}, '_redisSetValue');
            return true;
        }
    }).catch(function (error) {
        return false;
    });

}

exports.setOTPValue1 = function (key, value) {
    let val = JSON.stringify(value)
    //set value withou expiry
    let keys=  'FPASS' + value.params.email
    // setAsync(key, val , 'EX' , 3*60*60 ) <----- for expiry
    return client.setAsync(keys, val,'EX' , 3*60*60  ).then(function (response) {
        if (response) {
            // logger.info({'value': response}, '_redisSetValue');
            return true;
        }
    }).catch(function (error) {
        return false;
    });

}


exports.setOTPValue = function (key, value) {
   
    let val = JSON.stringify(value)
    //set value withou expiry
    let keys = 'OTP' + value.mobileNo
    // setAsync(key, val , 'EX' , 3*60*60 ) <----- for expiry
    return client.setAsync(keys, val,'EX' , 3*60*60  ).then(function (response) {
        if (response) {
            // logger.info({'value': response}, '_redisSetValue');
            return true;
        }
    }).catch(function (error) {
        return false;
    });

}

exports.setForgetOTPValue = function (key, value) {
    let val = JSON.stringify(value)
    //set value withou expiry
    let keys = 'FOTP' + value.params.mobileNo
    // setAsync(key, val , 'EX' , 3*60*60 ) <----- for expiry
    return client.setAsync(keys, val,'EX' , 3*60*60  ).then(function (response) {
        if (response) {
            // logger.info({'value': response}, '_redisSetValue');
            return true;
        }
    }).catch(function (error) {
        return false;
    });

}

exports.IsExists = async function (key) {
    try {
        let res = client.exists(key)
        return res
    } catch (error) {
        return error
    }
}

//check if key exists
exports.exists = function (key) {
 
    return client.existsAsync(key).then(function (response) {
        if (response) {
            return response;
        }
    }).catch(function (error) {
        return error;
    });
}
exports.OTPexists = function (key) {
 
    let keys = 'OTP'+ key.mobileNo
    return client.existsAsync(keys).then(function (response) {
        if (response) {
            return response;
        }
    }).catch(function (error) {
        return error;
    });
}
exports.ForgetOTPexists = function (key) {
 console.log(key ,"b")
    let keys = 'FOTP'+ key.mobileNo
    return client.existsAsync(keys).then(function (response) {
        if (response) {
           
            return response;
        }
    }).catch(function (error) {
        return error;
    });
}

exports.getValue = function (key) {
   
    return client.getAsync(key).then(function (response) {
        return response;
    }).catch(function (error) {
        return error;
    });
}
exports.getForgetPassOtpValue = function (key) {
   console.log(key)
   let keys=  'FPASS' + key.email
    return client.getAsync(keys).then(function (response) {
        return response;
    }).catch(function (error) {
        return error;
    });
}

exports.getOtpValue = function (key) {
    let keys = 'OTP'+ key.mobileNo
    return client.getAsync(keys).then(function (response) {
        return response;
    }).catch(function (error) {
        return error;
    });
}
exports.getForgetOtpValue = function (key) {
    let keys = 'FOTP'+ key.mobileNo
    return client.getAsync(keys).then(function (response) {
        return response;
    }).catch(function (error) {
        return error;
    });
}

exports.expire = function (key, expiryTime) {
    return client.expireAsync(key, expiryTime).then(function (response) {
        return response;
        logger.info({expire: response}, '_expireToken');
    }).catch(function (error) {
        logger.error({'error': error}, '_expireToken');
    });
}

exports.deleteValue = function (key) {
   
    return client.delAsync(key).then(function (response) {

        return response;
    }).catch(function (error) {
        throw error;
    });
}

init();
