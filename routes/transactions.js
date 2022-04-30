const express = require("express");
const router = express.Router();
const Transaction = require("../models/transaction");
const User = require("../models/user");

router.get("/", async (req, res) => {
  const transactions = await Transaction.find({});

  res.render("transactions/index", { transactions });
});

router.get("/newexpense", (req, res) => {
  res.render("transactions/newexpense");
});

router.get("/newincome", (req, res) => {
  res.render("transactions/newincome");
});

router.post("/", async (req, res) => {
  const transaction = new Transaction(req.body.transaction);
  const today = new Date();
  const dd = today.getDate();
  const mm = today.getMonth() + 1;
  const yyyy = today.getFullYear();
  const datefinal = `${dd}/${mm}/${yyyy}`;
  transaction.date = datefinal;

  await transaction.save();
  req.flash("success", "Successfully made a new transaction");

  res.redirect(`transactions/${transaction._id}`);
});

router.get("/:id", async (req, res) => {
  const transaction = await Transaction.findById(req.params.id);
  res.render("transactions/show", { transaction });
});

router.get("/:id/edit", async (req, res) => {
  const transaction = await Transaction.findById(req.params.id);
  res.render("transactions/edit", { transaction });
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;

  const transaction = await Transaction.findByIdAndUpdate(id, {
    ...req.body.transaction,
  });
  res.redirect(`transactions/${transaction.id}`);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await Transaction.findByIdAndDelete(id);
  res.redirect("/transactions");
});

module.exports = router;
