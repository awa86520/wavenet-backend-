const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const userController = require('../controllers/userController');

// Apply protect middleware on all routes
//router.use(protect);

// Create User
router.post('/', userController.createUser);

// List Users
router.get('/', userController.listUsers);

// Update User Role
router.put('/:id', userController.updateUser);

// Delete User
router.delete('/:id', userController.deleteUser);

module.exports = router;


