console.log("");
console.log("//************************* MYVCARD-NODE App 1.0.0 **************************//");
console.log("Server Start Date : ",new Date());

//.env file read
require('dotenv').config({ debug: process.env.DEBUG });

//socket
//require('./lib/socketChat');

// Import Config
const config = require('./lib/config');

// Import mongodb cronjob
//require('./lib/mongodbJobScheduler');


//import cron scheduler
let crons = require('./lib/cronJobScheduler')
//set for 1 month
crons.deleteNotifications('0 0 1 */1 *')



// Import logger
var logger = require('./lib/logger').logger;

config.dbConfig(config.cfg, (error) => {
    if (error) {
        logger.error(error, 'Exiting the app.');
        return;
    }

    // load external modules
    const express = require('express');
    var responseTime = require('response-time');

    
    // init express app
    const app = express();
    
    //Reduse size of response
    const compression = require('compression')
    app.use(compression ())
    
    app.use(responseTime());
    
    // set the view engine to ejs
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');

    // set server home directory
    app.locals.rootDir = __dirname;

    // config express
    config.expressConfig(app, config.cfg.environment);
    console.log('env : ',config.cfg.environment);

    // attach the routes to the app
    require('./lib/route')(app);

    // start server
    app.listen(config.cfg.port, () => {
        logger.info(`Express server listening on ${config.cfg.ip}:${config.cfg.port}, in ${config.cfg.TAG} mode`);
    });
});