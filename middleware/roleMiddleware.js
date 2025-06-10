exports.allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient role' });
    }
    next();
  };
};

// Custom middleware to validate role creation hierarchy
exports.validateRoleCreation = (req, res, next) => {
  const creatorRole = req.user.role;
  const newUserRole = req.body.role;

  const roleRules = {
    SUPER_ADMIN: ['ADMIN'],
    ADMIN: ['UNIT_MANAGER'],
    UNIT_MANAGER: ['USER'],
  };

  if (!roleRules[creatorRole]?.includes(newUserRole)) {
    return res.status(403).json({ message: `You cannot create a ${newUserRole}` });
  }

  next();
};
