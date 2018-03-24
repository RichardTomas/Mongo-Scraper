const express    = require("express");
const bodyParser = require("body-parser");
const exphbs     = require("express-handlebars");
const mongoose   = require("mongoose");
const port       = process.env.PORT || 3000 ;
//const morgan     = require("morgan");
const app = express();
// Enable logging.
//app.use(morgan('combined'));
// Require all models
const db = require("./models");
// Database configuration
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// Public directory.
app.use(express.static(__dirname + '/public'));

// Set up Body Parser.
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

// Set up Handlebars.
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Create routes.
require("./routes/html-routes.js")(app, db);
require("./routes/api-routes.js")(app, mongoose, db);

// Start the server
app.listen(port, function(){
    console.log("App running on port " + port);
});