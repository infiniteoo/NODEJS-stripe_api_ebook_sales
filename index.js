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

// set static folder
app.use(express.static(__dirname + "/public"));

const port = process.env.PORT || 5000;

// create index get route
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/success", async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

  const customer = await stripe.customers.retrieve(session.customer);
  console.log(customer);

  let dollars = session.amount_total / 100;
  dollars = dollars.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  res.render("success", {
    customer: customer,
    session: session,
    dollars: dollars,
  });
});

app.post("/charge", async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "ebook",
          },
          unit_amount: 2500,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url:
      "http://localhost:5000/success?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: "http://localhost/success",
  });

  res.redirect(303, session.url);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
