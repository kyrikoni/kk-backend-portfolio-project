const express = require("express");

const {
  getCategories,
  getReviews,
  getReviewById,
  getCommentsByReviewId,
  postCommentByReviewId,
  patchReviewById,
} = require("./controllers/app.controllers");
const {
  handle404Paths,
  handleCustomPaths,
  handleSQLErrors,
  handle500Paths,
} = require("./controllers/error.controller");

const app = express();
app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewById);
app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);

app.post("/api/reviews/:review_id/comments", postCommentByReviewId);

app.patch("/api/reviews/:review_id", patchReviewById);

app.all("*", handle404Paths);

app.use(handleCustomPaths);
app.use(handleSQLErrors);
app.use(handle500Paths);

module.exports = app;
