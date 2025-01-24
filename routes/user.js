const router = require("express").Router();
require("dotenv").config();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./userAuth");

//sign up
router.post("/sign-up", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    //check username length is > 3
    if (username.length < 4) {
      return res
        .status(400)
        .json({ message: "Username length should be greater than 3" });
    }

    //check username already exist ?
    const existingUsername = await User.findOne({ username: username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    //check username already exist ?
    const existingEmail = await User.findOne({ email: email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    //check password's length
    if (password.length <= 5) {
      if (existingEmail) {
        return res
          .status(400)
          .json({ message: "Password length should be greater than 5" });
      }
    }

    const hashPass = await bcrypt.hash(password, 10);

    const newUser = new User({
      username: username,
      email: email,
      password: hashPass,
    });

    await newUser.save();
    return res.status(200).json({ message: "SignUp successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

//sign in
router.post("/sign-in", async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    await bcrypt.compare(password, existingUser.password, (err, data) => {
      if (data) {
        const authClaims = [
          { name: existingUser.username },
        ];
        const token = jwt.sign({ authClaims }, `${process.env.JWTKEY}`, {
          expiresIn: "30d",
        });
        return res
          .status(200)
          .json({ id: existingUser.id, token: token });
      } else {
        return res.status(400).json({ message: "Invalid credentials" });
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

