const Joi = require("joi");
// @ts-ignore
Joi.objectId = require("joi-objectid")(Joi);
const startupDebugger = require("debug")("app:startup");
const dbDebugger = require("debug")("app:db");
const config = require("config");
const morgan = require("morgan");
const helmet = require("helmet");
const express = require("express");
const middleware = require("./middleware");
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const home = require("./routes/home");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const users = require("./routes/users");
const auth = require("./routes/auth");

const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost/vidly")
  .then(() => console.log("Connected to mongodb..."))
  .catch((error) => console.error(error));

const app = express();

app.set("view engine", "pug");
app.set("views", "./views"); // default path
app.use(express.json());
// For the parsing our body, and accepting key value pairs
app.use(express.urlencoded({ extended: true }));
// For serving static files
app.use(express.static("public"));
app.use(helmet());
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/", home);

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined");
  process.exit(1);
}

// Configurations
// console.log("Application Name: " + config.get("name"));
// console.log("Mail Server: " + config.get("mail.host"));
// console.log("Mail Password: " + config.get("mail.password"));

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  startupDebugger("Morgan enabled...");
}

dbDebugger("Connected to the database...");

app.use(middleware.log);
app.use(middleware.auth);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
