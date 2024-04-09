const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(token, "I_am_just_mocking_around_relax", (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Token is not valid" });
    }
    req.user = decoded;
    next();
  });
};

module.exports = verifyToken;
