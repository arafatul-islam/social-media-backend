const router = require("express").Router();
const User = require("../models/UserModel.js");
const bcrypt = require("bcrypt");

// update User
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (error) {
        return res.status(500).json(error);
      }
    }

    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("account successfully updated!");
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json("you can only update your own account!");
  }
});
// delete user
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    res.status(200).json("account deleted successfully!");
  } catch (error) {
    return res.status(500).json("error");
  }
});
// get a user
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, updatedAt, createdAt, ...others } = user._doc;
    res.status(200).json(others);
  } catch (error) {
    return res.status(500).json("error");
  }
});
// follow user

module.exports = router;
