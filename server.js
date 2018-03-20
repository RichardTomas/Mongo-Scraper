const express = require("express");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");

// Set port to 3000
const PORT = process.env.PORT || 3000;

// Initialize express
const app = express();

// Routes folder
const routes = require("./routes");

// Public folder
app.use(express.static("public"));

// Connect Handlebars to Express
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes 
app.use(routes);

// For Heroku deployment
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
  useMongoClient: true
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});