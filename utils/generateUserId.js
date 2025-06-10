/**
 * Generates a unique user ID based on role and user count.
 * 
 * @param {string} role - User role: 'ADMIN', 'UNIT_MANAGER', or 'USER'
 * @param {number} count - The current count of users with this role + 1
 * @returns {string} - A unique user ID like A1, UM1, U1
 */
function generateUserId(role, count) {
  switch (role) {
    case 'ADMIN':
      return `A${count}`;
    case 'UNIT_MANAGER':
      return `UM${count}`;
    case 'USER':
      return `U${count}`;
    default:
      throw new Error('Invalid role provided for user ID generation');
  }
}

module.exports = generateUserId;
