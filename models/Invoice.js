const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: Number,
  invoiceDate: Date,
  invoiceAmount: Number,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  financialYear: String,
});

module.exports = mongoose.model('Invoice', invoiceSchema);