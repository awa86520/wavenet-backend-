const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const invoiceController = require('../controllers/invoiceController');

router.use(protect);

router.post('/', invoiceController.createInvoice);
router.get('/', invoiceController.listInvoices);
router.put('/:invoiceNumber', invoiceController.updateInvoice);
router.delete('/:invoiceNumber', invoiceController.deleteInvoice);

module.exports = router;

