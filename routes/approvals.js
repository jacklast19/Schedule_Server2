const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const approvalController = require('../controllers/approvalController');
const authenticateToken = require('../middleware/authenticateToken');
const authorizeRoles = require('../middleware/authorizeRoles');
const authorizeActiveUser = require('../middleware/authorizeRoles');

// GET /approvals - ดึงรายการที่รอการอนุมัติทั้งหมด
router.get('/',authenticateToken,authorizeRoles('IT', 'HR','BOARD','HEAD'), auth, approvalController.getPendingApprovals);

// PATCH /approvals/:id/approve - อนุมัติรายการตาม ID
router.patch('/:id/approve',authenticateToken,authorizeRoles('IT', 'HR','BOARD','HEAD'), auth, approvalController.approveApproval);

// PATCH /approvals/:id/reject - ปฏิเสธรายการตาม ID
router.patch('/:id/reject',authenticateToken,authorizeRoles('IT', 'HR','BOARD','HEAD'), auth, approvalController.rejectApproval);

module.exports = router;
