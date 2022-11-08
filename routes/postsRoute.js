const router = require("express").Router();
const Post = require("../models/PostModel.js");

// create post
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (error) {
    res.status(404).json("cannot make a post ");
  }
});
// update post
// delete post
// like post
// get a post
// get timeline posts

module.exports = router;
