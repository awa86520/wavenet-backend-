const express = require('express');
const router = express.Router();
const {
  createInvoice,
  updateInvoice,
  deleteInvoice,
  listInvoices
} = require('../controllers/invoiceController');

const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

// @route   POST /api/invoices/
// @desc    Create a new invoice
// @access  Private (Admin and Unit Managers only)
router.post('/', protect, allowRoles('ADMIN', 'UNIT_MANAGER'), createInvoice);

// @route   PUT /api/invoices/:number
// @desc    Update invoice by invoiceNumber
// @access  Private
router.put('/:number', protect, allowRoles('ADMIN', 'UNIT_MANAGER'), updateInvoice);

// @route   DELETE /api/invoices/
// @desc    Bulk delete invoices by numbers
// @access  Private
router.delete('/', protect, allowRoles('ADMIN', 'UNIT_MANAGER'), deleteInvoice);

// @route   GET /api/invoices/
// @desc    List invoices (filters: year, date range, search)
// @access  Private
router.get('/', protect, listInvoices);

module.exports = router;
