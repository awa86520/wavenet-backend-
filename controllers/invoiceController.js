const Invoice = require('../models/Invoice');

exports.createInvoice = async (req, res) => {
  try {
    const { invoiceNumber, invoiceDate, invoiceAmount, financialYear } = req.body;
    const invoice = new Invoice({
      invoiceNumber,
      invoiceDate,
      invoiceAmount,
      financialYear,
      createdBy: req.user._id,
    });
    await invoice.save();
    res.status(201).json(invoice);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOneAndUpdate(
      { invoiceNumber: req.params.number },
      req.body,
      { new: true }
    );
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteInvoice = async (req, res) => {
  try {
    await Invoice.deleteMany({ invoiceNumber: { $in: req.body.numbers } });
    res.json({ message: 'Invoices deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.listInvoices = async (req, res) => {
  try {
    const { page = 1, limit = 10, financialYear, search, fromDate, toDate } = req.query;
    const query = {};
    if (financialYear) query.financialYear = financialYear;
    if (search) query.invoiceNumber = parseInt(search);
    if (fromDate && toDate) {
      query.invoiceDate = {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      };
    }

    const invoices = await Invoice.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
