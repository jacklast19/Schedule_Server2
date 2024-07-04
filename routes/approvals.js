const express = require('express');
const router = express.Router();
const auth = require('../route/auth');
const approvalController = require('../controllers/approvalController');

// GET /approvals - ดึงรายการที่รอการอนุมัติทั้งหมด
router.get('/', auth, approvalController.getPendingApprovals);

// PATCH /approvals/:id/approve - อนุมัติรายการตาม ID
router.patch('/:id/approve', auth, approvalController.approveApproval);

// PATCH /approvals/:id/reject - ปฏิเสธรายการตาม ID
router.patch('/:id/reject', auth, approvalController.rejectApproval);

module.exports = router;
