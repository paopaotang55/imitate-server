const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const secret = require("../config/secret");

module.exports = {
  tokenVerify: token => {
    try {
      jwt.verify(token, secret.secret);
      return true;
    } catch (err) {
      return false;
    }
  },
  tokenSign: user => {
    try {
      return jwt.sign(user, secret.secret);
    } catch (err) {
      return err;
    }
  },
  cryptoPassword: password => {
    let hash = crypto
      .createHmac("sha256", secret.secret)
      .update(password)
      .digest("hex");
    return hash;
  }
};
