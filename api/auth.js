const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const auth = require("../middleware/auth");
require("dotenv").config();
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
router.post(
  "/register",
  check("name", "Name is required").notEmpty(),
  check("email", "Please include a valid email").isEmail(),
  check(
    "password",
    "Please enter a password with 6 or more characters"
  ).isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, number } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "retro",
      });
      user = new User({
        name,
        email,
        avatar,
        password,
        number,
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        process.env.jwtSecret,
        { expiresIn: "5 days" },
        (err, token) => {
          if (err) throw err;
          res.json({ user, token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

router.get("/login", auth, async (req, res) => {
  try {
    let user = await User.findById(req.user.id).select("-password");
    if (user) {
      console.log(user);
      res.json(user);
    } else {
      res.json({ msg: "invalid" });
    }
  } catch (err) {
    console.error(err);
    console.error("gg");
    res.status(500).send("Server Error");
  }
});

router.post(
  "/login",
  [
    check("email", "Enter valid email").isEmail(),
    check("password", "is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        res.status(400).json({ errors: [{ msg: "invalid credentials" }] });
      }

      if (user) {
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          res.status(400).json({ errors: [{ msg: "invalid credentials" }] });
        }
        const payload = {
          user: {
            id: user.id,
          },
        };
        jwt.sign(
          payload,
          process.env.jwtSecret,
          { expiresIn: 360000 },
          (err, token) => {
            if (err) {
              throw err;
            }
            res.json({ token, msg: "login" });
          }
        );
      }
    } catch (err) {
      console.error(err);
      res.status(500).message("error");
    }
  }
);

module.exports = router;
