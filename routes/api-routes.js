const request = require("request");
const cheerio = require("cheerio");

module.exports = (app, mongoose, db) => {

    // Delete a comment given the article id and comment id.
    app.delete("/api/comment/:id/:commentid", (req, res) => {

        var commentId = req.params.commentid;

        db.Article.findOneAndUpdate({ _id: req.params.id }, { $pull: { comments: commentId } }, { new: true })
            .then(function(article) {
                res.json(article);
            })
            .catch(function(err) {
                res.json(err);
            });
    });

    // Post a new comment given the article id.
    app.post("/api/comment/:id", (req, res) => {

        db.Comment.create({
                body: req.body.comment
            })
            .then(function(newComment) {
                return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { comments: newComment._id } }, { new: true });
            })
            .then(function(article) {
                res.json(article);
            })
            .catch(function(err) {
                res.json(err);
            });
    });

    // Save an article by updating the saved field to true.
    app.put("/api/save/article/:id", (req, res) => {

        db.Article.update({ _id: req.params.id }, { "saved": true })
            .then(function(article) {
                res.json(article);
            });
    });

    // Remove an article from Saved by updating the saved field to false.
    app.put("/api/remove/article/:id", (req, res) => {

        db.Article.update({ _id: req.params.id }, { "saved": false })
            .then(function(article) {
                res.json(article);
            });
    });

    // Find all articles.
    app.get("/api/articles", (req, res) => {

        db.Article.find({})
            .then(function(data) {
                res.json(data);
            })
            .catch(function(err) {
                res.json(err);
            });
    });

    // Find all saved or unsaved articles using the true/false saved field.
    app.get("/api/articles/:saved", (req, res) => {

        var saved = (req.params.saved === "true") ? true : false;
        db.Article.find({ "saved": saved })
            .then(function(data) {
                res.json(data);
            })
            .catch(function(err) {
                res.json(err);
            });
    });

    // Find a specific article by id.
    app.get("/api/article/:id", (req, res) => {

        db.Article.findOne({ _id: req.params.id })
            .populate("comments")
            .then(function(data) {

                res.json(data);
            })
            .catch(function(err) {
                res.json(err);
            });
    });

    // Scrape articles
    app.get("/api/scrape", (req, res) => {

        db.Article.find({}, (err, data) => {

            request("https://www.caranddriver.com/", (error, response, html) => {

                var $ = cheerio.load(html);
                var results = [];

                $("h2").each(function(i, element) {

                    let heading = $(element)
                        .children("h2")
                        .text();
                    let link = $(element)
                        .children("a")
                    let linkText = link
                        .text()
                        .trim();
                    let linkHref = link
                        .attr("href");
                    let summary = $(element)
                        .children("p")
                        .text()
                        .trim();

                    if (linkText !== "" && summary !== "" && linkHref !== "") {
                        let article = {
                            timesId: id,
                            heading: linkText,
                            link: linkHref,
                            summary: summary,
                            saved: false
                        };
                        results.push(article);
                    }



                }); // end each
                // Create the articles in MongoDB 
                db.Article.create(results)
                    .then((newArticles) => {
                        res.json(newArticles);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }); // end request
        }); // end find
    });
}
