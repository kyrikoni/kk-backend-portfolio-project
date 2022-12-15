const {
  selectCategories,
  selectReviews,
  selectReviewById,
  checkReviewIdExists,
  selectComments,
  insertComment,
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
  Promise.all([checkReviewIdExists(reviewId), selectComments(reviewId)])
    .then((reviewComments) => {
      res.status(200).send({ comments: reviewComments[1] });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentByReviewId = (req, res, next) => {
  const reviewId = req.params.review_id;
  insertComment(req.body, reviewId)
    .then((newComment) => {
      res.status(201).send({ comment: newComment });
    })
    .catch((err) => {
      next(err);
    });
};
