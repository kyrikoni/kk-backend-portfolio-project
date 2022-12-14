const {
  selectCategories,
  selectReviews,
  selectReviewById,
  selectComments,
} = require("../models/app.models");

exports.getCategories = (req, res, next) => {
  selectCategories()
    .then((categories) => {
      res.status(200).send({ categories });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviews = (req, res, next) => {
  selectReviews()
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviewById = (req, res, next) => {
  const reviewId = req.params.review_id;
  selectReviewById(reviewId)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByReviewId = (req, res, next) => {
  const reviewId = req.params.review_id;
  selectComments(reviewId)
    .then((reviewComments) => {
      res.status(200).send({ reviewComments });
    })
    .catch((err) => {
      next(err);
    });
};
