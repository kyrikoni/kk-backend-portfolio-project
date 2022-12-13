const express = require("express");

const { getCategories, getReviews } = require("./controllers/app.controllers");
const {
  handle404Paths,
  handle500Paths,
} = require("./controllers/error.controller");

const app = express();

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.all("*", handle404Paths);

app.use(handle500Paths);

module.exports = app;
