const axios = require("axios");
const cheerio = require("cheerio");

// Functions to scrape website
const scrape = function() {
  return axios.get("https://www.caranddriver.com").then(function(res) {
    const $ = cheerio.load(res.data);
    // Array to save our info
    const articles = [];

    $("h2").each(function(i, element) {
   
      // Grab headline
      const head = $(this)
        .children("a")
        .text()
        .trim();

      // Grab the URL 
      const url = $(this)
        .children("a")
        .attr("href");

      // Grab summary
      const sum = $(this)
        .text()
        .trim();

      // Validation to make sure we have data
      if (head && sum && url) {
        
        const result = {
          headline: head,
          summary: sum,
          url: "https://www.caranddriver.com" + url
        };

        articles.push(result);
      }
    });
    return articles;
  });
};

// Export the function
module.exports = scrape;