console.log("");
console.log(
  "//************************* MYVCARD-NODE App 1.0.0 **************************//"
);
console.log("Server Start Date : ", new Date());

//.env file read
require("dotenv").config({ debug: process.env.DEBUG });

const { default: mongoose } = require("mongoose");
//socket
//require('./lib/socketChat');

// Import Config
const config = require("./lib/config");
const https = require("https");
// Import mongodb cronjob
//require('./lib/mongodbJobScheduler');

//import cron scheduler
let crons = require("./lib/cronJobScheduler");
//set for 1 month
crons.deleteNotifications("0 0 1 */1 *");

// Import logger
var logger = require("./lib/logger").logger;

config.dbConfig(config.cfg, (error) => {
  if (error) {
    logger.error(error, "Exiting the app.");
    return;
  }

  // load external modules
  const express = require("express");
  var responseTime = require("response-time");

  // init express app
  const app = express();

  //Reduce size of response
  const compression = require("compression");
  const {encryptDecryptMiddleware} = require("./lib/middleware/encryptDecrypt");
  const cors = require("cors");
  app.use(
    compression({
      level: 6,
    })
  );
    app.use(cors());
  app.use(responseTime());
    app.use(express.json());
  // set the view engine to ejs
  app.set("views", __dirname + "/views");
  app.set("view engine", "ejs");
  // app.use(encryptDecryptMiddleware)
  // set server home directory
  app.locals.rootDir = __dirname;

  // config express
  config.expressConfig(app, config.cfg.environment);
  console.log("env : ", config.cfg.environment);

  // attach the routes to the app
  require("./lib/route")(app);

  
  // start server
  const server = app.listen(config.cfg.port, () => {
    logger.info(
      `Express server listening on ${config.cfg.ip}:${config.cfg.port}, in ${config.cfg.TAG} mode`
    );
  });

  process.on("SIGINT", () => {
    server.close(() => {
      console.log("🚀 ~ file: server.js:77 ~ server.close ~ close");
      mongoose.connection.close(false, () => {
        console.log("mongoose connection disconnected")
        process.exit(0);
      });
    });
  });
  process.on("SIGTERM", () => {
    server.close(() => {
      console.log("🚀 ~ file: server.js:83 ~ server.close ~ close");
      mongoose.connection.close(false, () => {
        console.log("mongoose connection disconnected")
        process.exit(0);
      });
    });
  });
});
