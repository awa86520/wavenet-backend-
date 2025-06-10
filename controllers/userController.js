const bcrypt = require('bcryptjs');
const User = require('../models/User');
const generateUserId = require('../utils/generateUserId');

exports.createUser = async (req, res) => {
  try {
    const { name, email, role, password, group } = req.body;
    const creatorRole = req.user.role;

    // Role-based permission logic
    if (
      (creatorRole === 'SUPER_ADMIN' && role !== 'ADMIN') ||
      (creatorRole === 'ADMIN' && role !== 'UNIT_MANAGER') ||
      (creatorRole === 'UNIT_MANAGER' && role !== 'USER') ||
      (creatorRole === 'USER')
    ) {
      return res.status(403).json({ message: 'Permission denied to create this role.' });
    }

    const count = await User.countDocuments({ role });
    const userId = generateUserId(role, count + 1);
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      userId,
      group,
      createdBy: req.user._id,
    });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Prevent unauthorized updates
    if (
      (req.user.role === 'ADMIN' && user.role !== 'UNIT_MANAGER') ||
      (req.user.role === 'UNIT_MANAGER' && user.role !== 'USER') ||
      req.user.role === 'USER'
    ) {
      return res.status(403).json({ message: 'Unauthorized to update this user' });
    }

    user.role = req.body.role;
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (
      (req.user.role === 'ADMIN' && user.role !== 'UNIT_MANAGER') ||
      (req.user.role === 'UNIT_MANAGER' && user.role !== 'USER') ||
      req.user.role === 'USER'
    ) {
      return res.status(403).json({ message: 'Unauthorized to delete this user' });
    }

    await user.remove();
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.listUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};
    const { role, _id, group } = req.user;

    if (role === 'SUPER_ADMIN') {
      // See everyone
      query = {};
    } else if (role === 'ADMIN') {
      query = {
        $or: [
          { createdBy: _id },
          { createdBy: { $in: await User.find({ createdBy: _id }).distinct('_id') } }
        ]
      };
    } else if (role === 'UNIT_MANAGER') {
      const usersInGroup = await User.find({ group, role: 'UNIT_MANAGER' }).distinct('_id');
      query = { createdBy: { $in: [...usersInGroup, _id] } };
    } else if (role === 'USER') {
      return res.status(403).json({ message: 'Users cannot list other users' });
    }

    const users = await User.find(query).skip(skip).limit(limit);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};