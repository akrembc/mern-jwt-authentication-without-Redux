const jwt = require("jsonwebtoken");

// verify if a client is authorized to access requested route
// if so, we inject request object with the user ID
const auth = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).send(err.message);
      req.user = user;
      next();
    });
  } catch (error) {
    res.send("error in auth middleware");
  }
};

module.exports = auth;
