const db = require("../models");
const scrape = require("../scripts");

module.exports = {
  scrapeHeadlines: function(req, res) {
    // scrape website
    return scrape()
      .then(function(articles) {
        // then insert articles into the db
        return db.Headline.create(articles);
      })
      .then(function(dbHeadline) {
        if (dbHeadline.length === 0) {
          res.json({
            message: "No new articles found. Check back later!"
          });
        }
        else {
          // else send back how many new articles scraped
          res.json({
            message: "Added " + dbHeadline.length + " new articles!"
          });
        }
      })
      .catch(function(err) {
        // return message after scraping
        res.json({
          message: "Scrape complete!!"
        });
      });
  }
};
