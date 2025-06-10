const mongoose = require('mongoose');
//const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['SUPER_ADMIN', 'ADMIN', 'UNIT_MANAGER', 'USER'] },
  userId: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  group: String,
});