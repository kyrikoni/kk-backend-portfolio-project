const db = require("../db/connection");

exports.selectCategories = () => {
  const SQL = "SELECT * FROM categories;";
  return db.query(SQL).then((categories) => {
    console.log(categories.rows, "<- categories");
    return categories.rows;
  });
};
