const express = require("express");
const cors = require("cors");

const {
  getEndpoints,
  getCategories,
  getReviews,
  getReviewById,
  getCommentsByReviewId,
  getUsers,
  postCommentByReviewId,
  patchReviewById,
  deleteCommentById,
} = require("./controllers/app.controllers");
const {
  handle404Paths,
  handleCustomPaths,
  handleSQLErrors,
  handle500Paths,
} = require("./controllers/error.controller");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewById);
app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);

app.get("/api/users", getUsers);

app.post("/api/reviews/:review_id/comments", postCommentByReviewId);

app.patch("/api/reviews/:review_id", patchReviewById);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.all("*", handle404Paths);

app.use(handleCustomPaths);
app.use(handleSQLErrors);
app.use(handle500Paths);

module.exports = app;
