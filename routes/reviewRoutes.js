const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');

const Review = mongoose.model('reviews');

module.exports = app => {
  app.post('/api/reviews', requireLogin, async (req, res) => {
    const { title, body } = req.body;

    const review = new Review({
      title,
      body,
      dateSent: Date.now()
    });
    await review.save();
  });
};
