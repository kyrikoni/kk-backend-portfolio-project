exports.handle404Paths = (req, res, next) => {
  res.status(404).send({ msg: "path not found" });
};
