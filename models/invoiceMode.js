const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: Number,
  invoiceDate: Date,
  invoiceAmount: Number,
  financialYear: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);
