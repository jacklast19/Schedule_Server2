const express = require('express');
const router = express.Router();
const multer = require('multer');
const Leave = require('../models/Leave');
const auth = require('../routes/auth');

// ตั้งค่า multer สำหรับอัปโหลดไฟล์
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

const checkPreviousApprovals = (approvals, currentRole) => {
  const roleOrder = ['User', 'Head', 'HR', 'Board'];
  const currentRoleIndex = roleOrder.indexOf(currentRole);
  for (let i = 0; i < currentRoleIndex; i++) {
    const previousApprover = approvals.find(approval => approval.role === roleOrder[i]);
    if (previousApprover && previousApprover.status !== 'approved') {
      return false;
    }
  }
  return true;
};

const postApprovalProcess = async (leaveRequest) => {
  console.log(`Leave request ${leaveRequest._id} has been fully approved.`);
  leaveRequest.status = 'approved';
  await leaveRequest.save();
};

router.patch('/:id/approve/user', auth.authenticateJWT, auth.authorizeRole(['User']), async (req, res) => {
  try {
    const leaveRequest = await Leave.findById(req.params.id);
    if (!checkPreviousApprovals(leaveRequest.approvals, 'User')) {
      return res.status(400).json({ message: 'Previous approval steps not completed' });
    }
    const approver = leaveRequest.approvals.find(approval => approval.role === 'User' && approval.userId.equals(req.user.userId));
    if (!approver) {
      return res.status(404).json({ message: 'User approver not found' });
    }
    approver.status = 'approved';
    approver.date = Date.now();
    await leaveRequest.save();
    res.json(leaveRequest);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id/approve/head', auth.authenticateJWT, auth.authorizeRole(['Head']), async (req, res) => {
  try {
    const leaveRequest = await Leave.findById(req.params.id);
    if (!checkPreviousApprovals(leaveRequest.approvals, 'Head')) {
      return res.status(400).json({ message: 'Previous approval steps not completed' });
    }
    const approver = leaveRequest.approvals.find(approval => approval.role === 'Head' && approval.userId.equals(req.user.userId));
    if (!approver) {
      return res.status(404).json({ message: 'Head approver not found' });
    }
    approver.status = 'approved';
    approver.date = Date.now();
    await leaveRequest.save();
    res.json(leaveRequest);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id/approve/hr', auth.authenticateJWT, auth.authorizeRole(['HR']), async (req, res) => {
  try {
    const leaveRequest = await Leave.findById(req.params.id);
    if (!checkPreviousApprovals(leaveRequest.approvals, 'HR')) {
      return res.status(400).json({ message: 'Previous approval steps not completed' });
    }
    const approver = leaveRequest.approvals.find(approval => approval.role === 'HR' && approval.userId.equals(req.user.userId));
    if (!approver) {
      return res.status(404).json({ message: 'HR approver not found' });
    }
    approver.status = 'approved';
    approver.date = Date.now();
    await leaveRequest.save();
    res.json(leaveRequest);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id/approve/board', auth.authenticateJWT, auth.authorizeRole(['Board']), async (req, res) => {
  try {
    const leaveRequest = await Leave.findById(req.params.id);
    if (!checkPreviousApprovals(leaveRequest.approvals, 'Board')) {
      return res.status(400).json({ message: 'Previous approval steps not completed' });
    }
    const approver = leaveRequest.approvals.find(approval => approval.role === 'Board' && approval.userId.equals(req.user.userId));
    if (!approver) {
      return res.status(404).json({ message: 'Board approver not found' });
    }
    approver.status = 'approved';
    approver.date = Date.now();
    await leaveRequest.save();
    const allApproved = leaveRequest.approvals.every(approval => approval.status === 'approved');
    if (allApproved) {
      await postApprovalProcess(leaveRequest);
    }
    res.json(leaveRequest);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const leaveRecords = await Leave.find().populate('userId');
    res.json(leaveRecords);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', upload.fields([{ name: 'medicalCertificate', maxCount: 1 }, { name: 'attachments', maxCount: 10 }]), async (req, res) => {
  const { userId, startDate, endDate, reason, status, leaveType, approver, department } = req.body;
  const medicalCertificate = req.files && req.files['medicalCertificate'] ? req.files['medicalCertificate'][0].path : null;
  const attachments = req.files && req.files['attachments'] ? req.files['attachments'].map(file => file.path) : [];
  const leaveRecord = new Leave({ 
    userId, 
    startDate, 
    endDate, 
    reason, 
    status, 
    leaveType, 
    approver, 
    department, 
    medicalCertificate, 
    attachments,
    approvals: [
      { role: 'User', status: 'pending' },
      { role: 'Head', status: 'pending' },
      { role: 'HR', status: 'pending' },
      { role: 'Board', status: 'pending' }
    ] 
  });
  try {
    const newLeaveRecord = await leaveRecord.save();
    res.status(201).json(newLeaveRecord);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/:id', getLeaveRecord, (req, res) => {
  res.json(res.leaveRecord);
});

router.patch('/:id', upload.fields([{ name: 'medicalCertificate', maxCount: 1 }, { name: 'attachments', maxCount: 10 }]), async (req, res) => {
  const { userId, startDate, endDate, reason, status, leaveType, approver, department } = req.body;
  const medicalCertificate = req.files && req.files['medicalCertificate'] ? req.files['medicalCertificate'][0].path : null;
  const attachments = req.files && req.files['attachments'] ? req.files['attachments'].map(file => file.path) : [];
  if (userId != null) res.leaveRecord.userId = userId;
  if (startDate != null) res.leaveRecord.startDate = startDate;
  if (endDate != null) res.leaveRecord.endDate = endDate;
  if (reason != null) res.leaveRecord.reason = reason;
  if (status != null) res.leaveRecord.status = status;
  if (leaveType != null) res.leaveRecord.leaveType = leaveType;
  if (approver != null) res.leaveRecord.approver = approver;
  if (department != null) res.leaveRecord.department = department;
  if (medicalCertificate != null) res.leaveRecord.medicalCertificate = medicalCertificate;
  if (attachments.length > 0) res.leaveRecord.attachments = attachments;
  res.leaveRecord.updatedAt = Date.now();
  try {
    const updatedLeaveRecord = await res.leaveRecord.save();
    res.json(updatedLeaveRecord);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', getLeaveRecord, async (req, res) => {
  try {
    await res.leaveRecord.remove();
    res.json({ message: 'Deleted leave record' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getLeaveRecord(req, res, next) {
  let leaveRecord;
  try {
    leaveRecord = await Leave.findById(req.params.id).populate('userId');
    if (leaveRecord == null) {
      return res.status(404).json({ message: 'Cannot find leave record' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.leaveRecord = leaveRecord;
  next();
}

module.exports = router;
