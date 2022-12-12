const express = require("express");

const { getCategories } = require("./controllers/app.controllers");
const {
  handle404Paths,
  handle500Paths,
} = require("./controllers/error.controller");

const app = express();

app.get("/api/categories", getCategories);

app.all("*", handle404Paths);

app.use(handle500Paths);

module.exports = app;
