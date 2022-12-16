const db = require("../db/connection");

exports.selectCategories = () => {
  const categoriesSQL = "SELECT * FROM categories;";
  return db.query(categoriesSQL).then((categories) => {
    return categories.rows;
  });
};

exports.selectReviews = () => {
  const reviewsSQL = `
  SELECT owner, title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, designer, COUNT(comments.review_id) AS comment_count
  FROM reviews
  LEFT JOIN comments
  ON reviews.review_id = comments.review_id
  GROUP BY reviews.review_id
  ORDER BY reviews.created_at DESC
  ;`;
  return db.query(reviewsSQL).then((reviews) => {
    return reviews.rows;
  });
};

exports.selectReviewById = (reviewId) => {
  const reviewSQL = `
  SELECT * FROM reviews
  WHERE review_id = $1;
  `;

  return db.query(reviewSQL, [reviewId]).then((review) => {
    if (!review.rows[0]) {
      return Promise.reject({
        status: 404,
        msg: "no id found",
      });
    }
    return review.rows[0];
  });
};

exports.checkReviewIdExists = (reviewId) => {
  const checkIdSQL = `
  SELECT * FROM reviews
  WHERE review_id = $1
  ;`;

  return db.query(checkIdSQL, [reviewId]).then((review) => {
    if (review.rowCount === 0) {
      return Promise.reject({
        status: 404,
        msg: "no id found",
      });
    } else {
      return Promise.resolve();
    }
  });
};

exports.selectComments = (reviewId) => {
  const commentSQL = `
  SELECT * FROM comments
  WHERE review_id = $1
  ORDER BY created_at DESC
  ;`;

  return db.query(commentSQL, [reviewId]).then((comments) => {
    return comments.rows;
  });
};

exports.insertComment = (newComment, reviewId) => {
  const { username, body } = newComment;
  const insertCommentSQL = `
  INSERT INTO comments (author, body, review_id) VALUES ($1, $2, $3)
  RETURNING *
  ;`;

  return db
    .query(insertCommentSQL, [username, body, reviewId])
    .then((comment) => {
      return comment.rows[0];
    });
};

exports.updateReview = (updateRequest, reviewId) => {
  const { inc_votes } = updateRequest;
  const updateReviewSQL = `
  UPDATE reviews
  SET votes = (votes + $1)
  WHERE review_id = $2
  RETURNING *
  ;`;

  return db.query(updateReviewSQL, [inc_votes, reviewId]).then((review) => {
    if (review.rows[0] === undefined) {
      return Promise.reject({
        status: 404,
        msg: "no id found",
      });
    } else if (review.rows[0].votes < 0) {
      return Promise.reject({
        status: 400,
        msg: "total votes cannot be less than 0",
      });
    }
    return review.rows[0];
  });
};
