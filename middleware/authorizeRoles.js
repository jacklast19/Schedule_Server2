// ไฟล์ /middleware/authorizeRoles.js
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
      next();
    };
  };
  const authorizeActiveUser = () => {
    return (req, res, next) => {
      const user = req.user;
  
      if (!user) {
        return res.status(401).json({ message: 'Unauthorized: No user data found' });
      }
  
      if (user.status !== 'active') {
        return res.status(403).json({ message: 'Unauthorized: User status is not active' });
      }
      next();
    };
  };
  
  module.exports = authorizeActiveUser,authorizeRoles;
  //module.exports = authorizeRoles;
  