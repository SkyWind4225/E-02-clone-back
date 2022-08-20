const jwt = require("jsonwebtoken");
const { User } = require("../models");
require("dotenv").config();

module.exports = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const [tokenType, tokenValue] = authorization.split(" ");

    if (tokenType !== "Bearer") {
      res.status(401).json({
        ok: false,
        errorMessage: "토큰 타입이 맞지 않습니다.",
      });
      return;
    }
    try {
      const { privatekey } = jwt.verify(tokenValue, process.env.secret_key);
      console.log(privatekey);
      User.findByPk(privatekey).then((userkey, nickname) => {
        res.locals.user = { userkey, nickname };
        next();
      });
    } catch (err) {
      res.status(401).json({
        ok: false,
        errorMessage: "유효성 검사에 실패했습니다.",
      });
      return;
    }
  } catch (error) {
    res.status(401).json({
      ok: false,
      errorMessage: "로그인 후 사용 가능합니다.",
    });
    return;
  }
};
