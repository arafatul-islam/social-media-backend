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
// follow A user
router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    const user = await User.findById(req.params.id);
    const currentUser = await User.findById(req.body.userId);

    if (!user.followers.includes(currentUser)) {
      await user.updateOne({ $push: { followers: req.body.userId } });
      await currentUser.updateOne({ $push: { followings: req.params.id } });
      res.status(200).json("user has been followed");
    } else {
      res.status(403).json("You already following the user!");
    }
  } else {
    res.status(403).json("you cannot follow yourself");
  }
});

// unfollow A user
router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    const user = await User.findById(req.params.id);
    const currentUser = await User.findById(req.body.userId);

    if (user.followers.includes(currentUser)) {
      await user.updateOne({ $pull: { followers: req.body.userId } });
      await currentUser.updateOne({ $pull: { followings: req.params.id } });
      res.status(200).json("user has been unfollowed");
    } else {
      res.status(403).json("You do not  follow the user!");
    }
  } else {
    res.status(403).json("you cannot unfollow yourself");
  }
});
module.exports = router;
