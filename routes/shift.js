const express = require('express');
   const Shift = require('../models/shift'); // หรือ path ที่ถูกต้อง

   const router = express.Router();

   // สร้าง Shift
   router.post('/', async (req, res) => {
     try {
       const shift = new Shift(req.body);
       await shift.save();
       res.status(201).send(shift);
     } catch (error) {
       res.status(400).send(error);
     }
   });

   // อ่าน Shifts ทั้งหมด
   router.get('/', async (req, res) => {
     try {
       const shifts = await Shift.find();
       res.send(shifts);
     } catch (error) {
       res.status(500).send(error);
     }
   });

   // อ่าน Shift ด้วยชื่อ
   router.get('/:nameShrift', async (req, res) => {
     try {
       const shift = await Shift.findOne({ nameShrift: req.params.nameShrift });
       if (!shift) {
         return res.status(404).send();
       }
       res.send(shift);
     } catch (error) {
       res.status(500).send(error);
     }
   });

   // แก้ไข Shift
   router.put('/:nameShrift', async (req, res) => {
     try {
       const shift = await Shift.findOneAndUpdate(
         { nameShrift: req.params.nameShrift },
         req.body,
         { new: true, runValidators: true }
       );
       if (!shift) {
         return res.status(404).send();
       }
       res.send(shift);
     } catch (error) {
       res.status(400).send(error);
     }
   });

   // ลบ Shift
   router.delete('/:nameShrift', async (req, res) => {
     try {
       const shift = await Shift.findOneAndDelete({ nameShrift: req.params.nameShrift });
       if (!shift) {
         return res.status(404).send();
       }
       res.send(shift);
     } catch (error) {
       res.status(500).send(error);
     }
   });

   module.exports = router;