const express = require('express');
const router = express.Router();
const {
  getDashboard,
  getDashboardWidgets
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

// Protected routes
router.get('/', protect, getDashboard);
router.get('/widgets', protect, getDashboardWidgets);

module.exports = router;
