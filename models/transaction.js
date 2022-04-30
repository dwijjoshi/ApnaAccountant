const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
  amount: Number,
  category: String,
  mode: String,
  date: String,
  type: String,
});

module.exports = mongoose.model("Transaction", TransactionSchema);
