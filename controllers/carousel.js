const database = require("../db");

exports.setCarousel = (req, res, next) => {
  const carousel_slide = req.body.slider;
  const image = req.body.image;
  const text = req.body.text;
  const route = req.body.route;

  if (!carousel_slide || !image || !text || !route) {
    res.status(402).json({ message: "fill the required fields" });
  } else {
    database
      .execute("select * from carousel where slider=?", [carousel_slide])
      .then((results) => {
        if (results[0].length == 0) {
          database
            .execute(
              "insert into carousel (slider,image,text,route) VALUES (?,?,?,?)",
              [carousel_slide, image, text, route]
            )
            .then((results) => {
              res
                .status(200)
                .json({ message: "Carousel Inserted Successfully" });
            })
            .catch((err) => {
              if (!err.statusCode) err.statusCode = 500;
              next(err);
            });
        } else {
          database
            .execute(
              "update carousel set image=? , text=?,route=? where slider =?",
              [image, text, route, carousel_slide]
            )
            .then((results) => {
              res.status(200).json({ message: "Carousel Updated Successfuly" });
            })
            .catch((err) => {
              if (!err.statusCode) {
                err.statusCode = 500;
              }
              next(err);
            });
        }
      })
      .catch((err) => {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
      });
  }
};
exports.getCarousel = (req, res, next) => {
  database
    .execute("select * from carousel")
    .then((carousels) => {
        res.status(200).json({message:"All Carousel",carousels:carousels[0]})
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};
