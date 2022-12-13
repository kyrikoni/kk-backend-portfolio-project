const express = require("express");

const {
  getCategories,
  getReviews,
  getReviewById,
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

app.all("*", handle404Paths);

app.use(handleCustomPaths);
app.use(handleSQLErrors);
app.use(handle500Paths);

module.exports = app;
