const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth");
const User = require("../models/User");

const multer = require("multer");
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `files/admin-${file.fieldname}-${Date.now()}.${ext}`);
  },
});
const multerFilter = (req, file, cb) => {
  if (file.mimetype.split("/")[1] === "pdf") {
    cb(null, true);
  } else {
    cb(new Error("Not a PDF File!!"), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

router.get("/", auth, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ date: -1 });
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    POST api/posts
// @desc     Create a post
// @access   Private
router.post(
  "/update",
  auth,
  upload.single("myFile"),
  [
    check("github", "GitHub Username is required").notEmpty(),
    check("bio", "Bio is required").notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const {
        github,
        stackoverflow,
        bio,
        skills,
        linkedin,
        // spread the rest of the fields we don't need to check
        ...rest
      } = req.body;

      const profileFields = {
        skills: Array.isArray(skills)
          ? skills
          : skills.split(",").map((skill) => " " + skill.trim()),
        ...rest,
        github,
        stackoverflow,
        linkedin,
        bio,
        resume: req.file.filename,
      };
      console.log(req.user.id);
      let profile = await User.findOneAndUpdate(
        { _id: req.user.id },
        { $set: profileFields },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
      return res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route    GET api/posts
// @desc     Get all posts
// @access   Private

module.exports = router;
