const { verifyAccessToken } = require("../utils/JWTUtils");

const authMiddleware = async (req, res, next) => {
  const accessToken = req.headers.authorization?.split(" ")[1];
  // console.log(accessToken);

  if (!accessToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { isValid, payload } = await verifyAccessToken(accessToken);
  // console.log(payload, isValid);
  if (!isValid) {
    return res.status(401).json({ message: "Forbidden, invalid access token" });
  }
  // try {
  //   await refereshAccessToken(req, res);
  // } catch (error) {
  //   return res
  //     .status(403)
  //     .json({ message: "Failed to refresh access token" });
  // }
  req.user = payload;
  next();
};

module.exports = authMiddleware;
