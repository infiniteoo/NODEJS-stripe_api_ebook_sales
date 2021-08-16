const express = require("express");
const exphbs = require("express-handlebars");
const keys = require("./config/keys");
const stripe = require("stripe")(keys.stripeSecretKey);

// Create our express application
const app = express();

// handlebars middleware
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// express json middleware
app.use(express.json({ extended: false }));

const port = process.env.PORT || 5000;

// create index get route
app.get("/", (req, res) => {
  res.render("index");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
