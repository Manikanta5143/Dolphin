const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  type: { type: String, enum: ['JOB', 'INTERNSHIP'], required: true },
  description: String,
  tags: [String],
  link: String,
  postedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Opportunity', opportunitySchema); 