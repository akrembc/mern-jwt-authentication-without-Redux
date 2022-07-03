const { check } = require("express-validator");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../../models/User");
const auth = require("../../middlewares/auth");

// @route   GET /api/auth
// @desc    get user data
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId.toString()).select("-password");

    res.status(200).json(user);
  } catch (error) {
    res.status(500).send("server error");
  }
});

// @route   POST /api/auth/
// @desc    user login
// @access   Public
router.post(
  "/",
  check("email", "Please include a valid email").isEmail(),
  check("password", "password is required").exists(),
  async (req, res) => {
    try {
      const { email, password } = req.body;

      const result = await User.findOne({ email: email.toLowerCase() });

      if (!result)
        return res
          .status(400)
          .send({ errors: [{ msg: "Incorrect email or password!" }] });

      const hashedPassword = result.password;

      const isMatch = await bcrypt.compare(password, hashedPassword);

      if (!isMatch)
        return res
          .status(400)
          .send({ errors: [{ msg: "Incorrect email or password!" }] });

      const payload = { userId: result._id };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: 15 * 60,
      });

      res.status(201).json({ token });
    } catch (error) {
      res.status(500).send("server error");
    }
  }
);

// @route   DELETE /api/auth/
// @desc    user logout
// @access   Public
// app.delete("/", (req, res) => {
//   const refreshToken = req.body.token;
//   refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
//   res.sendStatus(204);
// });

module.exports = router;
