const express = require("express");
const keys = require("./config/keys");
const stripe = require("stripe")(keys.stripeSecretKey);

// Create our express application
const app = express();

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

