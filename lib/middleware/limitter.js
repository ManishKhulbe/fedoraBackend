const rateLimit = require("express-rate-limit");
const customException = require("../customException");

const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: customException.tooManyRequest(),
});


module.exports = apiLimiter;
