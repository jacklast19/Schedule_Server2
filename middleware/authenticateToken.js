// ไฟล์ /middleware/authenticateToken.js

const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET; // ใส่ secret key ที่คุณใช้ในการสร้าง JWT

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401); // ถ้าไม่มี token ส่งมา

  jwt.verify(token, secret, (err, user) => {
    if (err) return res.sendStatus(403); // ถ้า token ไม่ถูกต้อง
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
