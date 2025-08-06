// controllers/reviewController.js
import Review from '../models/Review.js';

export const getReviewsForSeller = async (req, res) => {
  const reviews = await Review.find({ sellerId: req.userId });
  res.json(reviews);
};
