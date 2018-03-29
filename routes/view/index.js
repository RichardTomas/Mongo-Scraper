const router = require("express").Router();

// Render homepage
router.get("/", function(req, res) {
  res.render("home");
});

// Render saved.hbs
router.get("/saved", function(req, res) {
  res.render("saved");
});

module.exports = router;