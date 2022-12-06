const database = require("../db");

exports.getCategories = async (req, res, next) => {
    let returnCat = [];
    let returnSub = [];
  if (!req.query.category) {
    res.status(422).json({ message: "category is required" });
  } else {
    const category = req.query.category;
    let main_cat =await database.execute(
      "SELECT * FROM categories WHERE cat_id = ?",
      [category]
    );
    console.log(main_cat)
    if (main_cat[0].length <= 0) {
      res.status(200).json({ message: "No categories found", categories: [] });
    } else {
      for (let i = 0; i < main_cat[0].length; i++) {
        let sub_cat =await database.execute(
            "SELECT * FROM subcategories WHERE cat_id = ? order by sub_name ASC",
            [main_cat[0][i].cat_id]
        );
        for (let j = 0; j < sub_cat[0].length; j++) {
            returnSub.push({
                name: sub_cat[0][j].sub_name,
                name_en: sub_cat[0][j].sub_name_en,
                sub_id : sub_cat[0][j].sub_id
            })
        }
        returnCat.push({
            name: main_cat[0][i].cat_name,
            id: main_cat[0][i].cat_id,
            subcategories: returnSub
        })
      }
      res.status(200).json({ message: "categories found", categories: returnCat });
    }
   
  }
};
