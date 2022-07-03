const router = require("express").Router();
const User = require("../../models/User");
// documentation: https://express-validator.github.io/docs/
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// @route   Post /api/register/
// @desc    user registration
// @access   public
router.post(
  "/",
  check("firstName", "first name is required").isLength({ min: 1 }),
  check("lastName", "last name is required").isLength({ min: 1 }),
  check("email", "Please include a valid email").isEmail(),
  check(
    "password",
    "Your password must be at least 6 characters long"
  ).isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // validation by mongoose:
    // const validation = user.validateSync();
    // console.log(validation.errors.email.properties.message);

    try {
      const { firstName, lastName, email, password } = req.body;
      const result = await User.findOne({ email });
      if (result) {
        return res.status(403).send({
          errors: [{ msg: "Email is already used for another account" }],
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });
      const savedUser = await user.save();

      const payload = { userId: savedUser._id };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: 15 * 60,
      });
      res.status(201).send({ token });
    } catch (error) {
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
