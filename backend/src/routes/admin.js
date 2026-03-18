const express = require('express');
const {
  getUsers,
  getStats,
  updateUserRole,
  deleteUser
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');
const Opportunity = require('../models/Opportunity');

const router = express.Router();

// All routes are protected and require admin access
router.use(protect);
router.use(authorize('ADMIN'));

router.get('/users', getUsers);
router.get('/stats', getStats);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

// Create opportunity
router.post('/opportunities', async (req, res) => {
  try {
    const opp = new Opportunity(req.body);
    await opp.save();
    res.status(201).json(opp);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create opportunity' });
  }
});

// Get all opportunities
router.get('/opportunities', async (req, res) => {
  try {
    const opps = await Opportunity.find({});
    res.json(opps);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch opportunities' });
  }
});

// Update opportunity
router.put('/opportunities/:id', async (req, res) => {
  try {
    const opp = await Opportunity.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(opp);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update opportunity' });
  }
});

// Delete opportunity
router.delete('/opportunities/:id', async (req, res) => {
  try {
    await Opportunity.findByIdAndDelete(req.params.id);
    res.json({ message: 'Opportunity deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete opportunity' });
  }
});

module.exports = router; 