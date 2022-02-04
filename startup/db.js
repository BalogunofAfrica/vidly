const mongoose = require("mongoose");
const config = require("config");
const logger = require("./logger");

module.exports = function () {
  const db = config.get("db");
  mongoose
    .connect(db, {
      // @ts-ignore
      useMongoClient: true,
    })
    .then(() => logger.info(`Connected to ${db}...`));
};
