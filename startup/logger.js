require("express-async-errors");
const winston = require("winston");
// require("winston-mongodb");

// process.on("uncaughtException", (ex) => {
//   winston.error(ex.message, ex);
//   process.exit(1);
// });

const logger = winston.createLogger({
  transports: [
    new winston.transports.File({
      filename: "logfile.log",
    }),
    // new winston.transports.MongoDB({
    //   db: "mongodb://localhost/vidly",
    //   level: "error",
    // }),
  ],
  exceptionHandlers: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: "uncaughtException.log",
    }),
  ],
});

process.on("unhandledRejection", (ex) => {
  throw ex;
  // winston.error(/**@type {Error} */ (ex).message, ex);
  // process.exit(1);
});

module.exports = logger;
