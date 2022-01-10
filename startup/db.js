const mongoose = require("mongoose");
const logger = require("./logger");

module.exports = function () {
  mongoose
    .connect("mongodb://localhost/vidly", {
      // @ts-ignore
      useMongoClient: true,
    })
    .then(() => logger.info("Connected to mongodb..."));
};
