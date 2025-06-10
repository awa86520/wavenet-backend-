const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { allowRoles, validateRoleCreation } = require('../middleware/roleMiddleware');
const {
  createUser,
  updateUserRole,
  deleteUser,
  listUsers,
} = require('../controllers/userController');

router.post('/', protect, validateRoleCreation, createUser);
router.put('/:id', protect, allowRoles('SUPER_ADMIN', 'ADMIN'), updateUserRole);
router.delete('/:id', protect, allowRoles('SUPER_ADMIN', 'ADMIN'), deleteUser);
router.get('/', protect, listUsers);

module.exports = router;

