const jwt = require("jsonwebtoken");

function verifyAdmin(req, res, next) {

  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {

    const decoded = jwt.verify(token, "secretkey");

    if (decoded.role !== "admin") {
      return res.status(403).json({ error: "Admin access only" });
    }

    req.user = decoded;

    next();

  } catch (err) {

    return res.status(401).json({ error: "Invalid token" });

  }

}

module.exports = verifyAdmin;