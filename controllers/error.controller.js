exports.handle404Paths = (req, res, next) => {
  res.status(404).send({ msg: "path not found" });
};

exports.handleCustomPaths = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.handleSQLErrors = (err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502") {
    console.log(err);
    res.status(400).send({ msg: "bad request" });
  } else if (err.code === "23503") {
    console.log(err);
    res.status(404).send({ msg: "not found" });
  }
  next(err);
};

exports.handle500Paths = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "internal server error" });
};
