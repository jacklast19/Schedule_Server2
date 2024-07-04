const Approval = require('../models/Approval');
const Document = require('../models/document');
const Leave = require('../models/Leave');
const ShiftSwap = require('../models/ShiftSwap');

// ดึงรายการที่รอการอนุมัติทั้งหมด
exports.getPendingApprovals = async (req, res) => {
  try {
    const approvals = await Approval.find({ status: 'pending' })
      .populate('documentId')
      .populate('leaveRequestId')
      .populate('approverId')
      .populate('shiftSwapId');
    res.json(approvals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// อนุมัติรายการตาม ID
exports.approveApproval = async (req, res) => {
  try {
    const approval = await Approval.findById(req.params.id);
    if (!approval) return res.status(404).json({ msg: 'Approval not found' });

    approval.status = 'approved';
    approval.updatedAt = Date.now();
    await approval.save();

    // อัปเดตสถานะของ Document หรือ LeaveRequest ที่เกี่ยวข้อง
    if (approval.documentId) {
      await Document.findByIdAndUpdate(approval.documentId, { status: 'approved' });
    }
    if (approval.leaveRequestId) {
      await LeaveRequest.findByIdAndUpdate(approval.leaveRequestId, { status: 'approved' });
    }
    if (approval.ShiftSwapId){
      await ShiftSwap.findByIdAndUpdate(approval.ShiftSwapId,{status:'approved'} );
    }

    res.json(approval);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ปฏิเสธรายการตาม ID
exports.rejectApproval = async (req, res) => {
  try {
    const approval = await Approval.findById(req.params.id);
    if (!approval) return res.status(404).json({ msg: 'Approval not found' });

    approval.status = 'rejected';
    approval.updatedAt = Date.now();
    approval.comments = req.body.comments || '';
    await approval.save();

    // อัปเดตสถานะของ Document หรือ LeaveRequest ที่เกี่ยวข้อง
    if (approval.documentId) {
      await Document.findByIdAndUpdate(approval.documentId, { status: 'rejected' });
    }
    if (approval.leaveRequestId) {
      await LeaveRequest.findByIdAndUpdate(approval.leaveRequestId, { status: 'rejected' });
    }

    res.json(approval);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
