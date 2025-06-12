const Invoice = require('../models/invoiceMode');
const { getFinancialYear } = require('../utils/financialYearUtil');

// Create Invoice
exports.createInvoice = async (req, res) => {
  try {
    const { invoiceNumber, invoiceDate, invoiceAmount } = req.body;

    const financialYear = getFinancialYear(invoiceDate);

    // Validate unique invoice number in FY
    const exists = await Invoice.findOne({ financialYear, invoiceNumber });
    if (exists) {
      return res.status(400).json({ msg: 'Invoice number already exists in this financial year' });
    }

    const invoice = await Invoice.create({
      invoiceNumber,
      invoiceDate,
      invoiceAmount,
      financialYear,
      createdBy: req.user._id
    });

    res.status(201).json(invoice);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// List Invoices with filtering
exports.listInvoices = async (req, res) => {
  try {
    const { fy, invoiceNumber, fromDate, toDate } = req.query;
    let query = {};

    if (fy) query.financialYear = fy;
    if (invoiceNumber) query.invoiceNumber = invoiceNumber;
    if (fromDate && toDate) {
      query.invoiceDate = { $gte: new Date(fromDate), $lte: new Date(toDate) };
    }

    const invoices = await Invoice.find(query).sort({ invoiceNumber: 1 });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Update Invoice
exports.updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOneAndUpdate(
      { invoiceNumber: req.params.invoiceNumber },
      req.body,
      { new: true }
    );
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Delete Invoice
exports.deleteInvoice = async (req, res) => {
  try {
    await Invoice.findOneAndDelete({ invoiceNumber: req.params.invoiceNumber });
    res.json({ msg: 'Invoice deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
