const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchUser");

const JWT_SECRET = "MainChutiyaHoon";

// Route 1 : Create a user using : POST "./api/auth". No login required
router.post(
  "/createuser",
  [
    body("name", "Enter a valid Name").isLength({ min: 3 }),
    body("email", "Enter a valid Email").isEmail(),
    body("password", "Enter a valid Password").isLength({ min: 5 })
  ],
  async (req, res) => {
    let success = false;
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    // Check whether the user with the same email exits already
    try {
      let user = await User.findOne({ email: req.body.email });
      // console.log(user);
      if (user) {
        return res
          .status(400)
          .json({ success, error: "Sorry a user with this email already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      let hashedPassword = await bcrypt.hash(req.body.password, salt);
      // Create a new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      });
      const data = {
        user: {
          id: user.id,
        },
      };

      // .then(user => res.json(user))
      // .catch(err => {console.log(err)
      // res.json({error : "Please enter a unique value for email"})});
      // res.send(req.body);
      const authToken = jwt.sign(data, JWT_SECRET);
      // console.log(jwtData)
      // res.json(user);
      success = true;
      res.json({ success, authToken });
    } catch (error) {
      // Catch errors
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Route 2 : Authenticate a user using : POST "/api/auth/login". No login required
router.post(
  "/login",
  [
    body("email", "Enter a valid Email").isEmail(),
    body("password", "Password cannot be empty").exists(),
  ],
  async (req, res) => {
    let success = false;
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          success,
          error: "Sorry, please try to login with correct credentials",
        });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(400).json({
          success,
          error: "Sorry, please try to login with correct credentials",
        });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authToken });
    } catch (error) {
      // Catch errors
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Route 3 : Get logged in user details using: "/api/auth/getuser". Login required

router.post("/getuser", fetchuser ,async (req, res) => {
  try {
    const userID = req.user.id;
    const user = await User.findById(userID).select("-password");
    res.send(user);
  } catch (error) {
    // Catch errors
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
