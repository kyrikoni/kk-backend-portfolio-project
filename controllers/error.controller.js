exports.handle404Paths = (req, res, next) => {
  res.status(404).send({ msg: "path not found" });
};

exports.handle500Paths = (req, res, next) => {
  res.status(500).send({ msg: "internal server error" });
};
