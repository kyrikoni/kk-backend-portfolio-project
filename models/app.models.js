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
        msg: "no user found",
      });
    }
    return review.rows[0];
  });
};
