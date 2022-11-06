const router = require("express").Router();
const User = require("../models/UserModel.js");
const bcrypt = require("bcrypt");

// register
router.post("/register", async (req, res) => {
  try {
    // generate hashed password with salting
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    // create new user
    const user = await new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    // store new user into db and return respose
    const newUser = await user.save();
    res.status(200).json(newUser);
  } catch (error) {
    console.log(error);
  }
});

// login
router.post("/login", async (req, res) => {
  try {
    const user =
      (await User.findOne({
        email: req.body.email,
      })) || (await User.findOne({ username: req.body.username }));

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    !validPassword && res.status(404).send("wrong password");
    validPassword && res.status(200).send("correct password");
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
