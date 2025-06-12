const User = require('../models/user');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.login = async (req, res) => {
  const { email, password, timezone } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ msg: 'User not found' });

  const isMatch = await user.comparePassword(password);
  if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

  // (Optional) timezone validation can be added here.

  res.json({
    token: generateToken(user._id),
    user: { id: user._id, name: user.name, role: user.role }
  });
};
