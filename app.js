const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const Transaction = require("./models/transaction");
const ejsMate = require("ejs-mate");
const transactions = require("./routes/transactions");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const userRoutes = require("./routes/users");
let sum = 0;

mongoose.connect("mongodb://localhost:27017/hack-svit", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
const sessionConfig = {
  secret: "secret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expire: Date.now() + 1000 * 60 * 60 * 24 * 30,
    maxAge: 1000 * 60 * 60 * 24 * 30,
  },
};

app.use(express.static(__dirname + "/public"));
app.use(session(sessionConfig));
app.use(flash());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser);
passport.deserializeUser(User.deserializeUser);

app.use("/", userRoutes);

app.use("/transactions", transactions);

app.get("/", async (req, res) => {
  const transactions = await Transaction.find({});
  sum = 0;
  for (let transaction of transactions) {
    sum += transaction.amount;
  }

  /*for(let i=0;i<transactions.length;i++){
    sum+= transactions[i].amount;
  }*/
  res.render("home", { transactions, sum });
});

app.get("/splitmoney", (req, res) => {
  res.render("splitmoney");
});

app.get("/giveborrow", (req, res) => {
  res.render("giveborrow");
});

app.get("/aboutus", (req, res) => {
  res.render("aboutus");
});

app.get("/analysis1", (req, res) => {
  res.render("analysis1");
});

app.listen(3000, () => {
  console.log("Serving on port 3000");
});
