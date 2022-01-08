function log(req, res, next) {
  console.log("Logging Middleware...");
  next();
}

function auth(req, res, next) {
  console.log("Authenticating Middleware...");
  next();
}

module.exports = {
  auth,
  log,
};
