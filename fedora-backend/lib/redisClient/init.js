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
    return client.setAsync(key, val , 'EX' , 1*60 ).then(function (response) {
        if (response) {
            // logger.info({'value': response}, '_redisSetValue');
            return response;
        }
    }).catch(function (error) {
        return error;
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
exports.getValue = function (key) {
    return client.getAsync(key).then(function (response) {
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
