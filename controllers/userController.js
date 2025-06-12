const User = require('../models/user');

// Generate unique user IDs
const generateUserId = async (role) => {
  const prefix = role === 'ADMIN' ? 'A' : role === 'UNITMANAGER' ? 'UM' : 'U';
  const count = await User.countDocuments({ role });
  return `${prefix}${count + 1}`;
};

// Create User
exports.createUser = async (req, res) => {
  try {
    const { name, email, role, password, group } = req.body;

    // Role based creation rules
    if (req.user.role === 'SUPERADMIN' && role !== 'ADMIN') {
      return res.status(400).json({ msg: 'Superadmin can only create Admin users' });
    }
    if (req.user.role === 'ADMIN' && role !== 'UNITMANAGER') {
      return res.status(400).json({ msg: 'Admin can only create Unit Managers' });
    }
    if (req.user.role === 'UNITMANAGER' && role !== 'USER') {
      return res.status(400).json({ msg: 'Unit Manager can only create Users' });
    }

    const userId = await generateUserId(role);
    const newUser = await User.create({
      userId,
      name,
      email,
      role,
      password,
      createdBy: req.user._id,
      group: group || null
    });

    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// List Users (with role-based visibility)
exports.listUsers = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'SUPERADMIN') {
      query = {};
    } else if (req.user.role === 'ADMIN') {
      const adminsGroup = req.user.group;
      if (adminsGroup) {
        const admins = await User.find({ role: 'ADMIN', group: adminsGroup }).select('_id');
        query = { createdBy: { $in: admins.map(a => a._id).concat(req.user._id) } };
      } else {
        query = { createdBy: req.user._id };
      }
    } else if (req.user.role === 'UNITMANAGER') {
      const managersGroup = req.user.group;
      if (managersGroup) {
        const managers = await User.find({ role: 'UNITMANAGER', group: managersGroup }).select('_id');
        query = { createdBy: { $in: managers.map(a => a._id).concat(req.user._id) } };
      } else {
        query = { createdBy: req.user._id };
      }
    } else {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    const users = await User.find(query);
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Update User Role
exports.updateUser = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    user.role = role;
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: 'User deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

