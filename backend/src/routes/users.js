const express = require('express');
const fetch = require('node-fetch'); // Make sure you have this installed!
const {
  getBookmarks,
  addBookmark,
  removeBookmark,
  checkBookmark
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const { getRecommendationsForUser } = require('../services/recommendationService');


const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/bookmarks', getBookmarks);
router.post('/bookmarks/:eventId', addBookmark);
router.delete('/bookmarks/:eventId', removeBookmark);
router.get('/bookmarks/:eventId/check', checkBookmark);

// Update user interests, skills, and projects
router.post('/:id/interests', async (req, res) => {
  try {
    const { interests, skills, projects } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { interests, skills, projects },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({
      data: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        interests: user.interests,
        skills: user.skills,
        projects: user.projects,
        bookmarks: user.bookmarks,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user interests/skills/projects' });
  }
});

// Get personalized recommendations for the logged-in user
router.get('/assistant/recommendations', async (req, res) => {
  try {
    const userId = req.user._id;
    const recommendations = await getRecommendationsForUser(userId);
    res.json(recommendations);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});

// ✅✅✅ NEW: ing Face AI Chat endpoint!
// ✅✅✅ NEW: ing Face AI Chat endpoint!
router.post('/assistant/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    // Build messages in OpenAI-style format
    const messages = [
      {
        role: 'system',
        content: 'You are a helpful assistant for students seeking events, jobs, and internships.'
      },
      ...(history || []).map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      })),
      {
        role: 'user',
        content: message
      }
    ];

    const response = await fetch(
      `https://router.huggingface.co/v1/chat/completions`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.INGFACE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'moonshotai/Kimi-K2-Instruct:novita',
          messages: messages
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('ing Face API error:', data);
      return res.status(500).json({ error: 'ing Face API error', detail: data });
    }

    const aiResponse = data.choices?.[0]?.message?.content || 'Sorry, no answer.';

    res.json({ response: aiResponse });
  } catch (err) {
    console.error('ing Face chat error:', err);
    res.status(500).json({ error: 'Failed to get ing Face response' });
  }
});


module.exports = router;
